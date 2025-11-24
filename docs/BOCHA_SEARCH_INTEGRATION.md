# 博查搜索集成文档

## 概述

本项目已集成博查(Bocha) AI 搜索服务,支持通过环境变量在博查和智谱两种搜索引擎之间切换。

## 配置

### 1. 环境变量配置

在 `.env` 文件中添加以下配置:

```env
# 博查 API Key (从 https://open.bocha.cn 获取)
NEXT_PUBLIC_BOCHA_API_KEY=your_bocha_api_key_here

# 搜索引擎选择: zhipu | bocha
NEXT_PUBLIC_SEARCH_ENGINE=bocha
```

### 2. 获取博查 API Key

1. 访问 [博查AI开放平台](https://open.bocha.cn)
2. 注册/登录账号
3. 进入 "API KEY 管理" 页面
4. 创建或获取现有的 API Key
5. 将 API Key 配置到 `.env` 文件中

## 使用方法

### 基础使用

```typescript
import { webSearchService } from '@/services/webSearch';

// 使用默认配置(环境变量中的 NEXT_PUBLIC_SEARCH_ENGINE)
const result = await webSearchService.search('阿里巴巴2024年ESG报告');
```

### 指定搜索引擎

```typescript
import { webSearchService } from '@/services/webSearch';

// 明确指定使用博查搜索
const result = await webSearchService.search('搜索内容', {
  provider: 'bocha',
  count: 10
});

// 明确指定使用智谱搜索
const result = await webSearchService.search('搜索内容', {
  provider: 'zhipu',
  searchEngine: 'search_std',
  count: 5
});
```

### 高级选项

```typescript
import { webSearchService } from '@/services/webSearch';

const result = await webSearchService.search('搜索查询', {
  provider: 'bocha',      // 搜索引擎提供商
  count: 20,              // 返回结果数量 (1-50)
});
```

### 检查API配置

```typescript
import { webSearchService } from '@/services/webSearch';

// 检查是否配置了博查API
if (webSearchService.hasBochaApi()) {
  console.log('博查API已配置');
}

// 检查是否配置了智谱API
if (webSearchService.hasZhipuApi()) {
  console.log('智谱API已配置');
}

// 获取当前默认提供商
const provider = webSearchService.getCurrentProvider();
console.log(`当前使用: ${provider}`);
```

## 响应格式

两种搜索引擎返回的数据会被统一转换为相同格式:

```typescript
interface WebSearchResponse {
  created: number;
  id: string;
  request_id: string;
  search_intent: Array<{
    intent: string;
    keywords: string;
    query: string;
  }>;
  search_result: Array<{
    content: string;      // 网页摘要/内容
    icon: string;         // 网站图标
    link: string;         // 网页链接
    media: string;        // 网站名称
    publish_date?: string; // 发布日期
    refer: string;        // 引用标识 [1], [2], ...
    title: string;        // 网页标题
  }>;
}
```

## 格式化工具

### 转换为引用格式

```typescript
const result = await webSearchService.search('查询');
const references = webSearchService.formatAsReferences(result.search_result);

// references 格式:
// [
//   {
//     content: "...",
//     source: "网站名",
//     link: "https://...",
//     title: "标题",
//     refer: "[1]",
//     publishDate: "2024-07-22",
//     type: "web_search"
//   },
//   ...
// ]
```

### 转换为上下文文本

```typescript
const result = await webSearchService.search('查询');
const context = webSearchService.formatAsContext(result.search_result);

// 输出示例:
// 以下是联网搜索的相关信息:
//
// [1] 标题
// 来源: 网站名
// 链接: https://...
// 发布时间: 2024-07-22
// 内容: ...
//
// ---
//
// [2] 标题
// ...
```

## 博查搜索特性

### 优势
- ✅ 搜索结果准确、摘要完整
- ✅ 更适合AI使用
- ✅ 支持时间范围过滤
- ✅ 支持域名过滤(include/exclude)
- ✅ 返回结构化的摘要内容
- ✅ 单次最多返回50条结果

### 参数说明

博查搜索支持的额外参数(在 API 路由层面):

```typescript
{
  query: string;           // 必填: 搜索查询
  summary: boolean;        // 是否显示摘要 (默认: true)
  freshness: string;       // 时间范围: noLimit, oneDay, oneWeek, oneMonth, oneYear
  count: number;           // 返回数量: 1-50 (默认: 10)
  include?: string;        // 指定搜索域名 (用|分隔)
  exclude?: string;        // 排除搜索域名 (用|分隔)
}
```

## 直接使用博查服务

如果需要直接访问博查原始API:

```typescript
import { bochaSearchService } from '@/services/bochaSearch';

const result = await bochaSearchService.search('查询', {
  summary: true,
  freshness: 'oneWeek',
  count: 20,
  include: 'github.com|stackoverflow.com',
  exclude: 'example.com'
});

// 转换为统一格式
const unified = bochaSearchService.convertToUnifiedFormat(result);
```

## 注意事项

1. **API Key 安全**: API Key 存储在环境变量中,不要提交到版本控制
2. **费率限制**: 博查搜索有请求频率限制,与充值金额相关
3. **结果数量**: 博查搜索单次最多返回50条结果
4. **时间范围**: 推荐使用 `noLimit`,让搜索算法自动优化
5. **摘要内容**: 博查返回的 `summary` 字段通常比 `snippet` 更完整

## 错误处理

```typescript
try {
  const result = await webSearchService.search('查询');
  console.log(result);
} catch (error) {
  if (error instanceof Error) {
    console.error('搜索失败:', error.message);
    // 可能的错误:
    // - "博查 API Key 未配置"
    // - "查询内容不能为空"
    // - "博查搜索失败 (403)" - 余额不足
    // - "博查搜索失败 (429)" - 请求频率限制
  }
}
```

## 切换搜索引擎

要切换搜索引擎,只需修改 `.env` 文件:

```env
# 使用博查搜索
NEXT_PUBLIC_SEARCH_ENGINE=bocha

# 或使用智谱搜索
NEXT_PUBLIC_SEARCH_ENGINE=zhipu
```

重启开发服务器使更改生效。

## API 路由

项目提供了统一的 API 路由 `/api/web-search`,支持两种搜索引擎:

**请求示例:**

```bash
curl -X POST http://localhost:3000/api/web-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "阿里巴巴2024年ESG报告",
    "provider": "bocha",
    "count": 10
  }'
```

**响应格式:** 统一的 `WebSearchResponse` 格式

## 相关文件

- [`services/webSearch.ts`](../services/webSearch.ts) - 统一搜索服务
- [`services/bochaSearch.ts`](../services/bochaSearch.ts) - 博查搜索适配器
- [`app/api/web-search/route.ts`](../app/api/web-search/route.ts) - 搜索 API 路由
- [`.env`](../.env) - 环境变量配置

## 参考链接

- [博查AI开放平台](https://open.bocha.cn)
- [博查 Web Search API 文档](https://open.bocha.cn/docs/web-search)
- [智谱 AI 开放平台](https://open.bigmodel.cn)