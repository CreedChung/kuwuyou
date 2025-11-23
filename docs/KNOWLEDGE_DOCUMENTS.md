# 知识库文档列表功能

## 功能概述

实现了智谱 AI 知识库的文档列表查看功能,支持:

- ✅ 查看知识库下的所有文档
- ✅ 搜索文档
- ✅ 分页浏览
- ✅ 查看文档详细信息(字数、长度、向量化状态等)
- ✅ 显示向量化失败信息

## 文件结构

```
components/knowledge/
├── DocumentTypes.ts          # 文档类型定义
├── DocumentCard.tsx          # 文档卡片组件
├── DocumentList.tsx          # 文档列表组件
└── index.ts                  # 导出所有组件

app/
├── knowledge/
│   ├── page.tsx             # 知识库列表页面
│   └── [id]/
│       └── page.tsx         # 文档列表页面 (新增)
└── api/
    └── knowledge/
        └── documents/
            └── route.ts     # 文档列表 API (新增)

scripts/
└── test-documents-api.ts    # API 测试脚本
```

## 使用方法

### 1. 查看文档列表

在知识库列表页面,点击任意知识库卡片,会跳转到该知识库的文档列表页面:

```
/knowledge/{knowledge_id}
```

### 2. 搜索文档

在文档列表页面顶部的搜索框中输入文档名称,点击"搜索"按钮或按 Enter 键。

### 3. 查看文档状态

每个文档卡片会显示:
- **文档名称和 URL**
- **向量化状态**:
  - 🟢 已完成 (绿色)
  - 🔵 处理中 (蓝色)
  - 🟡 待处理 (灰色)
  - 🔴 失败 (红色) - 会显示失败原因
- **统计信息**: 字数、长度、切片字数
- **文档类型**: 智能切片 / 自定义切片

## API 接口

### 获取文档列表

**接口**: `GET /api/knowledge/documents`

**请求参数**:
```typescript
{
  knowledge_id: string;  // 必需,知识库ID
  page?: number;         // 可选,页码,默认1
  size?: number;         // 可选,每页数量,默认10
  word?: string;         // 可选,搜索关键词
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "请求成功",
  "data": {
    "list": [
      {
        "id": "12312121212",
        "name": "文档名称",
        "url": "https://example.com/doc.pdf",
        "knowledge_type": 1,
        "word_num": 1000,
        "length": 1500,
        "sentence_size": 300,
        "embedding_stat": 2,
        "custom_separator": ["\n\n"],
        "failInfo": {
          "embedding_code": 10002,
          "embedding_msg": "字数超出限制"
        }
      }
    ],
    "total": 10
  }
}
```

## 测试

运行测试脚本验证 API:

```bash
# 1. 修改 scripts/test-documents-api.ts 中的 KNOWLEDGE_ID
# 2. 运行测试
bun run scripts/test-documents-api.ts
```

## 组件使用示例

### DocumentCard 组件

```tsx
import { DocumentCard } from "@/components/knowledge";

<DocumentCard
  document={document}
  onClick={() => console.log("点击文档", document)}
/>
```

### DocumentList 组件

```tsx
import { DocumentList } from "@/components/knowledge";

<DocumentList
  loading={loading}
  documents={documents}
  searchQuery={searchQuery}
  onDocumentClick={(doc) => console.log("点击", doc)}
/>
```

## 数据类型

### KnowledgeDocument

```typescript
interface KnowledgeDocument {
  id: string;                    // 文档ID
  knowledge_type: number;        // 切片类型: 1=智能切片, 2=自定义切片
  custom_separator: string[];    // 自定义分隔符
  sentence_size: number;         // 切片字数
  length: number;                // 文档长度
  word_num: number;              // 字数
  name: string;                  // 文档名称
  url: string;                   // 文档URL
  embedding_stat: number;        // 向量化状态: 0=待处理, 1=处理中, 2=已完成, 3=失败
  failInfo?: {                   // 失败信息(仅在 embedding_stat=3 时存在)
    embedding_code: number;      // 失败状态码
    embedding_msg: string;       // 失败消息
  };
}
```

## 扩展功能

可以进一步实现:

- [ ] 上传文档
- [ ] 删除文档
- [ ] 编辑文档信息
- [ ] 查看文档内容
- [ ] 重新向量化
- [ ] 批量操作

## 注意事项

1. **API Key**: 确保在 `.env` 文件中配置了 `NEXT_PUBLIC_ZHIPU_API_KEY`
2. **权限**: 只能访问属于当前账号的知识库文档
3. **分页**: 默认每页显示 10 条记录
4. **搜索**: 搜索会调用后端 API,支持按文档名称搜索

## 相关文档

- [知识库列表功能](./DATABASE_SETUP.md)
- [智谱 AI API 文档](https://open.bigmodel.cn/dev/api)