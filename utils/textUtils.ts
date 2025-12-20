/**
 * 文本处理工具函数
 */

/**
 * 截断文本到指定长度
 */
export function truncateText(text: string, maxLength: number = 5000): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength);
}

/**
 * 检测文本中是否包含"分析"关键词
 */
export function detectAnalysisKeyword(text: string): boolean {
  return text.includes('分析');
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 验证文件类型
 */
export function validateFileType(file: File): boolean {
  const allowedExtensions = ['.txt', '.md', '.doc', '.docx', '.pdf'];
  const fileName = file.name?.toLowerCase() || '';
  return allowedExtensions.some(ext => fileName.endsWith(ext));
}
