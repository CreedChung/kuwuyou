# 搜索服务集成说明

## 快速开始

本项目已集成**博查(Bocha)**和**智谱**两种搜索引擎,可通过环境变量轻松切换。

### 1. 配置 API Key

编辑 `.env` 文件,添加博查 API Key:

```env
# 博查 API Key (从 https://open.bocha.cn 获取)
NEXT_PUBLIC_BOCHA_API_KEY=your_api_key_here

# 选择搜索引擎: bocha 或 zhipu
NEXT_PUBLIC_SEARCH_ENGINE=bocha
```

### 2. 获取博查 API Key

1. 访问 [https://open.bocha.cn](https://open.bocha.cn)
2. 注册并登录账号
3. 进入"API KEY 管理"页面
4. 创建或获取 API Key
5. 复制到 `.env` 文件

### 3. 基础使用

```typescript
import { webSearchService } from '@/services/webSearch';

// 执行搜索
const result = await webSearchService.search('你的搜索查询');

// 查看结果
console.log(result.search_result);
```

## 主要特性

### ✅ 博查搜索优势

- 🎯 **搜索结果准确** - 从全网数百亿网页中精准搜索
- 📝 **摘要完整** - 提供结构化的内容摘要,更适合AI使用
- ⏱️ **时间过滤** - 支持按时间范围搜索(天/周/月/年)
- 🌐 **域名过滤** - 可指定或排除特定网站
- 📊 **结果丰富** - 单次最多返回50条高质量结果
- 🔗 **格式统一** - 兼容 Bing Search API 响应格式

### 🔄 灵活切换

通过环境变量一键切换搜索引擎:

```env
# 使用博查(推荐)
NEXT_PUBLIC_SEARCH_ENGINE=bocha

# 或使用智谱
NEXT_PUBLIC_SEARCH_ENGINE=zhipu
```

## 使用示例

### 基础搜索

```typescript
import { webSearchService } from '@/services/webSearch';

const result = await webSearchService.search('Next.js 15 新特性', {
  count: 10  // 返回10条结果
});
```

### 指定搜索引擎

```typescript
// 使用博查搜索
const bochaResult = await webSearchService.search('查询内容', {
  provider: 'bocha',
  count: 20
});

// 使用智谱搜索
const zhipuResult = await webSearchService.search('查询内容', {
  provider: 'zhipu',
  searchEngine: 'search_std',
  count: 5
});
```

### 格式化结果

```typescript
const result = await webSearchService.search('AI技术');

// 转换为引用格式
const references = webSearchService.formatAsReferences(result.search_result);

// 转换为上下文文本(适合LLM)
const context = webSearchService.formatAsContext(result.search_result);
```

## 响应格式

```typescript
{
  search_result: [
    {
      title: "网页标题",
      content: "网页摘要或内容",
      link: "https://example.com",
      media: "网站名称",
      icon: "网站图标URL",
      publish_date: "2024-07-22T08:18:30+08:00",
      refer: "[1]"
    },
    // ... 更多结果
  ]
}
```

## 文档和示例

- 📖 **完整文档**: [`docs/BOCHA_SEARCH_INTEGRATION.md`](docs/BOCHA_SEARCH_INTEGRATION.md)
- 💻 **代码示例**: [`examples/search-example.ts`](examples/search-example.ts)

## 相关文件

```
├── services/
│   ├── webSearch.ts          # 统一搜索服务(推荐使用)
│   └── bochaSearch.ts        # 博查搜索适配器
├── app/api/web-search/
│   └── route.ts              # 搜索 API 路由
├── docs/
│   └── BOCHA_SEARCH_INTEGRATION.md  # 详细文档
└── examples/
    └── search-example.ts     # 使用示例
```

## 常见问题

### Q: 如何获取博查 API Key?
A: 访问 [https://open.bocha.cn](https://open.bocha.cn) 注册账号后,在"API KEY 管理"页面获取。

### Q: 博查搜索收费吗?
A: 博查采用按量计费,需要先充值。具体定价请访问官网查看。

### Q: 请求频率有限制吗?
A: 有限制,具体限制与充值金额相关。收到429错误时表示达到限制。

### Q: 可以同时使用两种搜索引擎吗?
A: 可以,在代码中通过 `provider` 参数指定使用哪个引擎。

### Q: 如何处理搜索错误?
A: 使用 try-catch 包裹搜索调用,根据错误消息进行相应处理。详见示例文件。

## 技术支持

- 博查官网: [https://open.bocha.cn](https://open.bocha.cn)
- 智谱官网: [https://open.bigmodel.cn](https://open.bigmodel.cn)
- 项目文档: [`docs/BOCHA_SEARCH_INTEGRATION.md`](docs/BOCHA_SEARCH_INTEGRATION.md)

## 更新日志

### v1.0.0 (2024-11-24)
- ✅ 集成博查 Web Search API
- ✅ 支持智谱和博查两种搜索引擎
- ✅ 提供统一的搜索接口
- ✅ 支持通过环境变量切换引擎
- ✅ 完整的文档和示例代码

---

**开始使用**: 配置好 `.env` 文件后,即可通过 `webSearchService.search()` 开始搜索! 🚀