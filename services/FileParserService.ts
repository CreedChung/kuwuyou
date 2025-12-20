/**
 * 智谱 AI 文件解析服务
 * 支持 Lite、Expert、Prime 三种解析模式
 */

export type ToolType = 'lite' | 'expert' | 'prime';

export type FileType =
  | 'pdf' | 'docx' | 'doc' | 'xls' | 'xlsx' | 'ppt' | 'pptx'
  | 'png' | 'jpg' | 'jpeg' | 'csv' | 'txt' | 'md' | 'html'
  | 'epub' | 'bmp' | 'gif' | 'webp' | 'heic' | 'eps' | 'icns'
  | 'im' | 'pcx' | 'ppm' | 'tiff' | 'xbm' | 'heif' | 'jp2';

export type FormatType = 'text' | 'download_link';

export type TaskStatus = 'processing' | 'succeeded' | 'failed';

export interface CreateTaskResponse {
  message: string;
  success: boolean;
  task_id: string;
}

export interface TaskResultResponse {
  status: TaskStatus;
  message: string;
  content?: string;
  task_id: string;
  parsing_result_url?: string;
}

export interface FileParserOptions {
  toolType?: ToolType;
  formatType?: FormatType;
  pollingInterval?: number; // 轮询间隔(毫秒)
  maxRetries?: number; // 最大重试次数
}

class FileParserService {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'server-side-key';
    this.baseURL = 'https://open.bigmodel.cn/api/llm-application/open';
  }

  /**
   * 设置 API Key
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * 获取当前 API Key
   */
  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * 检查 API Key 是否已设置
   */
  hasApiKey(): boolean {
    return !!this.apiKey && this.apiKey !== 'server-side-key';
  }

  /**
   * 创建文件解析任务
   */
  async createTask(
    file: File,
    fileType: FileType,
    toolType: ToolType = 'lite'
  ): Promise<CreateTaskResponse> {
    console.log('🚀 创建文件解析任务');
    console.log('📄 文件名:', file.name);
    console.log('📦 文件大小:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('🔧 解析类型:', toolType);

    // 验证文件大小
    this.validateFileSize(file, toolType);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tool_type', toolType);
    formData.append('file_type', fileType.toUpperCase());

    try {
      const response = await fetch(`${this.baseURL}/files/parser/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败 (${response.status})`);
      }

      const result: CreateTaskResponse = await response.json();
      console.log('✅ 任务创建成功, Task ID:', result.task_id);
      return result;
    } catch (error) {
      console.error('❌ 创建任务失败:', error);
      throw error;
    }
  }

  /**
   * 获取任务结果
   */
  async getTaskResult(
    taskId: string,
    formatType: FormatType = 'text'
  ): Promise<TaskResultResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/files/parser/result/${taskId}/${formatType}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败 (${response.status})`);
      }

      const result: TaskResultResponse = await response.json();
      return result;
    } catch (error) {
      console.error('❌ 获取任务结果失败:', error);
      throw error;
    }
  }

  /**
   * 轮询获取任务结果(直到完成或失败)
   */
  async pollTaskResult(
    taskId: string,
    options: FileParserOptions = {}
  ): Promise<TaskResultResponse> {
    const {
      formatType = 'text',
      pollingInterval = 3000,
      maxRetries = 100,
    } = options;

    console.log('🔄 开始轮询任务结果...');
    console.log('⏱️ 轮询间隔:', pollingInterval, 'ms');
    console.log('🔢 最大重试次数:', maxRetries);

    for (let i = 0; i < maxRetries; i++) {
      const result = await this.getTaskResult(taskId, formatType);

      console.log(`📊 第 ${i + 1} 次轮询, 状态: ${result.status}`);

      if (result.status === 'succeeded') {
        console.log('✅ 解析成功!');
        if (formatType === 'text' && result.content) {
          console.log('📝 文本内容长度:', result.content.length, '字符');
        } else if (formatType === 'download_link' && result.parsing_result_url) {
          console.log('🔗 下载链接:', result.parsing_result_url);
        }
        return result;
      }

      if (result.status === 'failed') {
        console.error('❌ 解析失败:', result.message);
        throw new Error(result.message || '文件解析失败');
      }

      // 继续等待
      if (i < maxRetries - 1) {
        await this.sleep(pollingInterval);
      }
    }

    throw new Error('轮询超时,请稍后重试');
  }

  /**
   * 一键解析文件(创建任务 + 轮询结果)
   */
  async parseFile(
    file: File,
    fileType: FileType,
    options: FileParserOptions = {}
  ): Promise<TaskResultResponse> {
    const { toolType = 'lite' } = options;

    console.log('🎯 开始一键解析文件');

    // 1. 创建任务
    const createResult = await this.createTask(file, fileType, toolType);

    // 2. 轮询结果
    const result = await this.pollTaskResult(createResult.task_id, options);

    return result;
  }

  /**
   * 验证文件大小
   */
  private validateFileSize(file: File, toolType: ToolType) {
    const sizeMB = file.size / 1024 / 1024;
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    let maxSize = 50; // Lite 默认 50MB

    if (toolType === 'prime') {
      if (['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(fileExt)) {
        maxSize = 100;
      } else if (['xls', 'xlsx', 'csv'].includes(fileExt)) {
        maxSize = 10;
      } else if (['png', 'jpg', 'jpeg'].includes(fileExt)) {
        maxSize = 20;
      }
    } else if (toolType === 'expert') {
      maxSize = 100;
    }

    if (sizeMB > maxSize) {
      throw new Error(`文件大小超过限制 (${maxSize}MB)`);
    }
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取支持的文件类型
   */
  getSupportedFileTypes(toolType: ToolType): FileType[] {
    switch (toolType) {
      case 'lite':
        return ['pdf', 'docx', 'doc', 'xls', 'xlsx', 'ppt', 'pptx',
          'png', 'jpg', 'jpeg', 'csv', 'txt', 'md'];
      case 'expert':
        return ['pdf'];
      case 'prime':
        return ['pdf', 'docx', 'doc', 'xls', 'xlsx', 'ppt', 'pptx',
          'png', 'jpg', 'jpeg', 'csv', 'txt', 'md', 'html',
          'bmp', 'gif', 'webp', 'heic', 'eps', 'icns',
          'im', 'pcx', 'ppm', 'tiff', 'xbm', 'heif', 'jp2'];
      default:
        return [];
    }
  }

  /**
   * 获取文件类型描述
   */
  getToolTypeDescription(toolType: ToolType): string {
    switch (toolType) {
      case 'lite':
        return '基础解析 - 快速、免费、纯文本输出';
      case 'expert':
        return '专业解析 - 高精度PDF解析,支持表格和公式';
      case 'prime':
        return '旗舰解析 - 最高精度,支持复杂版式和多模态';
      default:
        return '';
    }
  }
}

// 导出单例
export const fileParserService = new FileParserService();

// 导出类以便测试
export { FileParserService };
