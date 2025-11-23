/**
 * 文件处理工具
 * 支持浏览器端文件识别和文字转换
 */

import mammoth from 'mammoth';

// PDF.js 类型定义（用于类型安全）
type PDFLib = typeof import('pdfjs-dist');

/**
 * 从文件中提取文本内容
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    // .docx 文件 - 使用 mammoth 解析
    if (
      fileName.endsWith('.docx') ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      console.log('🔍 检测到 .docx 文件，使用 mammoth 解析...');
      return await extractFromDocx(file);
    }

    // .pdf 文件 - 使用 pdfjs-dist 解析
    if (
      fileName.endsWith('.pdf') ||
      fileType === 'application/pdf'
    ) {
      console.log('📕 检测到 PDF 文件，使用 pdfjs-dist 解析...');
      return await extractFromPdf(file);
    }

    // .doc 文件 - 旧版 Word 格式提示
    if (fileName.endsWith('.doc') && !fileName.endsWith('.docx')) {
      console.warn('⚠️ 检测到旧版 .doc 文件');
      throw new Error('不支持旧版 .doc 格式，请转换为 .docx 格式后再上传');
    }

    // 纯文本文件
    if (fileType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      console.log('📄 检测到文本文件，直接读取...');
      return await readAsText(file);
    }

    // 默认尝试作为文本读取
    console.log('📝 尝试作为文本文件读取...');
    return await readAsText(file);
  } catch (error) {
    console.error('❌ 文件读取失败:', error);
    throw new Error(error instanceof Error ? error.message : `无法读取文件: ${file.name}`);
  }
}

/**
 * 使用 mammoth 从 .docx 文件中提取文本
 */
async function extractFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await readAsArrayBuffer(file);
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages && result.messages.length > 0) {
      console.warn('⚠️ Mammoth 警告:', result.messages);
    }

    console.log('✅ .docx 文件解析成功');
    console.log('📊 提取的文本长度:', result.value.length, '字符');
    console.log('📋 文本预览:', result.value.substring(0, 200) + '...');

    return result.value;
  } catch (error) {
    console.error('❌ .docx 文件解析失败:', error);
    throw new Error('无法解析 .docx 文件');
  }
}

/**
 * 使用 pdfjs-dist 从 PDF 文件中提取文本
 */
async function extractFromPdf(file: File): Promise<string> {
  try {
    // 动态导入 pdfjs-dist（只在客户端执行）
    if (typeof window === 'undefined') {
      throw new Error('PDF 解析只能在浏览器环境中进行');
    }

    const pdfjsLib = await import('pdfjs-dist');

    // 配置 PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await readAsArrayBuffer(file);

    // 加载 PDF 文档
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    console.log('📕 PDF 文件加载成功');
    console.log('📄 总页数:', pdf.numPages);

    const textPages: string[] = [];

    // 遍历所有页面提取文本
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // 提取页面文本
      const pageText = textContent.items
        .map((item: any) => {
          // 检查 item 是否有 str 属性（文本项）
          return 'str' in item ? item.str : '';
        })
        .join(' ');

      textPages.push(pageText);
      console.log(`  ✓ 第 ${pageNum}/${pdf.numPages} 页解析完成`);
    }

    const fullText = textPages.join('\n\n');

    console.log('✅ PDF 文件解析成功');
    console.log('📊 提取的文本长度:', fullText.length, '字符');
    console.log('📋 文本预览:', fullText.substring(0, 200) + '...');

    return fullText;
  } catch (error) {
    console.error('❌ PDF 文件解析失败:', error);
    throw new Error(error instanceof Error ? error.message : '无法解析 PDF 文件');
  }
}

/**
 * 读取文件为 ArrayBuffer
 */
function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      resolve(arrayBuffer);
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * 读取文件为文本
 */
function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text || '');
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

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
 * 验证文件类型
 */
export function validateFileType(file: File): boolean {
  const allowedExtensions = ['.txt', '.md', '.doc', '.docx', '.pdf'];
  const fileName = file.name.toLowerCase();
  return allowedExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}