# 智谱 AI 文件解析服务

基于智谱 AI 的文件解析 API,支持多种文件格式的智能解析。

## 功能特性

- ✅ 支持多种文件格式: PDF, Word, Excel, PPT, 图片等
- ✅ 三种解析模式: Lite (免费), Expert, Prime
- ✅ 自动轮询获取解析结果
- ✅ 完整的错误处理和日志输出
- ✅ TypeScript 类型支持

## 支持的文件格式

### Lite 模式 (免费)
- 文档: PDF, DOCX, DOC, XLS, XLSX, PPT, PPTX
- 图片: PNG, JPG, JPEG
- 文本: CSV, TXT, MD
- 最大文件: 50MB
- 输出: 纯文本 (无图片)

### Expert 模式 (0.012元/页)
- 文档: PDF
- 最大文件: 100MB
- 输出: 图片 + Markdown

### Prime 模式 (0.12元/页)
- 文档: PDF, DOCX, DOC, XLS, XLSX, PPT, PPTX
- 图片: PNG, JPG, JPEG, BMP, GIF, WEBP, HEIC 等
- 文本: CSV, TXT, MD, HTML
- 最大文件: 
  - PDF/DOC/DOCX/PPT/PPTX: 100MB
  - XLS/XLSX/CSV: 10MB
  - 图片: 20MB
- 输出: 图片 + Markdown + 布局信息 JSON

## 使用方法

### 1. 在代码中使用

```typescript
import { fileParserService } from '@/services/FileParserService';

// 解析文件
async function parseFile(file: File) {
  try {
    const result = await fileParserService.parseFile(
      file,
      'pdf', // 文件类型
      {
        toolType: 'lite', // 解析模式
        formatType: 'text', // 返回格式
        pollingInterval: 3000, // 轮询间隔(毫秒)
        maxRetries: 100, // 最大重试次数
      }
    );
    
    console.log('解析结果:', result.content);
  } catch (error) {
    console.error('解析失败:', error);
  }
}
```

### 2. 分步使用

```typescript
import { fileParserService } from '@/services/FileParserService';

// 1. 创建解析任务
const createResult = await fileParserService.createTask(
  file,
  'pdf',
  'lite'
);

console.log('任务ID:', createResult.task_id);

// 2. 获取解析结果
const result = await fileParserService.getTaskResult(
  createResult.task_id,
  'text'
);

console.log('解析状态:', result.status);
console.log('解析内容:', result.content);

// 3. 或者使用轮询自动等待完成
const finalResult = await fileParserService.pollTaskResult(
  createResult.task_id,
  {
    formatType: 'text',
    pollingInterval: 3000,
    maxRetries: 100,
  }
);
```

### 3. 命令行测试

```bash
# 设置 API Key
export ZHIPU_API_KEY="your_api_key"

# 解析文件
bun run scripts/test-file-parser.ts ./test.pdf lite

# 使用不同的解析模式
bun run scripts/test-file-parser.ts ./test.pdf expert
bun run scripts/test-file-parser.ts ./test.pdf prime
```

### 4. Web 界面测试

访问 `/file-parser` 页面,可以通过可视化界面测试文件解析功能。

## API 参考

### FileParserService

#### 方法

##### `createTask(file, fileType, toolType)`
创建文件解析任务

参数:
- `file: File` - 要解析的文件
- `fileType: FileType` - 文件类型 (pdf, docx, etc.)
- `toolType: ToolType` - 解析模式 (lite, expert, prime)

返回: `Promise<CreateTaskResponse>`

##### `getTaskResult(taskId, formatType)`
获取任务解析结果

参数:
- `taskId: string` - 任务ID
- `formatType: FormatType` - 返回格式 (text, download_link)

返回: `Promise<TaskResultResponse>`

##### `pollTaskResult(taskId, options)`
轮询获取任务结果(直到完成)

参数:
- `taskId: string` - 任务ID
- `options: FileParserOptions` - 配置选项

返回: `Promise<TaskResultResponse>`

##### `parseFile(file, fileType, options)`
一键解析文件(创建任务 + 轮询结果)

参数:
- `file: File` - 要解析的文件
- `fileType: FileType` - 文件类型
- `options: FileParserOptions` - 配置选项

返回: `Promise<TaskResultResponse>`

#### 工具方法

##### `setApiKey(apiKey)`
设置 API Key

##### `getApiKey()`
获取当前 API Key

##### `hasApiKey()`
检查是否已设置 API Key

##### `getSupportedFileTypes(toolType)`
获取指定解析模式支持的文件类型

##### `getToolTypeDescription(toolType)`
获取解析模式的描述

## 类型定义

```typescript
type ToolType = 'lite' | 'expert' | 'prime';

type FileType = 
  | 'pdf' | 'docx' | 'doc' | 'xls' | 'xlsx' | 'ppt' | 'pptx'
  | 'png' | 'jpg' | 'jpeg' | 'csv' | 'txt' | 'md' | 'html'
  | 'epub' | 'bmp' | 'gif' | 'webp' | 'heic' | 'eps' | 'icns'
  | 'im' | 'pcx' | 'ppm' | 'tiff' | 'xbm' | 'heif' | 'jp2';

type FormatType = 'text' | 'download_link';

type TaskStatus = 'processing' | 'succeeded' | 'failed';

interface CreateTaskResponse {
  message: string;
  success: boolean;
  task_id: string;
}

interface TaskResultResponse {
  status: TaskStatus;
  message: string;
  content?: string;
  task_id: string;
  parsing_result_url?: string;
}

interface FileParserOptions {
  toolType?: ToolType;
  formatType?: FormatType;
  pollingInterval?: number;
  maxRetries?: number;
}
```

## 注意事项

1. **API Key**: 需要在环境变量中设置 `ZHIPU_API_KEY`
2. **文件大小限制**: 不同解析模式有不同的文件大小限制
3. **下载链接有效期**: 解析结果下载链接24小时后失效
4. **轮询超时**: 默认最多轮询100次,每次间隔3秒
5. **价格**: Lite 模式当前免费,2025-10-08 起 0.01 元/次

## 常见问题

**Q: 解析结果能保留原始图片吗?**

A: Prime 与 Expert 支持图片保留(打包下载),Lite 服务不保留图片。

**Q: 下载链接失效怎么办?**

A: 需重新调用解析 API 生成新链接。

**Q: 为什么我的复杂 PDF 解析效果不好?**

A: Lite 服务不适合复杂排版和 OCR 场景,请使用 Prime 服务或 Expert 服务。

## 参考文档

- [智谱 AI 文件解析 API 文档](https://docs.bigmodel.cn)
- [API 接口文档](https://docs.bigmodel.cn/api-reference)
