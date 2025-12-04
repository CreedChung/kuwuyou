/**
 * 文本切片工具
 * 用于将长文本切分成小片段,以适应API的长度限制
 */

export interface TextSliceOptions {
  sliceLength?: number;
  maxSlices?: number;
  random?: boolean;
}

const DEFAULT_OPTIONS: Required<TextSliceOptions> = {
  sliceLength: 100,
  maxSlices: 10,
  random: true,
};

/**
 * 将文本切分成指定长度的片段
 */
export function sliceText(
  text: string,
  options: TextSliceOptions = {}
): string[] {
  const { sliceLength, maxSlices, random } = { ...DEFAULT_OPTIONS, ...options };

  if (!text || text.trim().length === 0) {
    return [];
  }

  const cleanText = text.trim();
  const textLength = cleanText.length;

  if (textLength <= sliceLength) {
    return [cleanText];
  }

  const slices: string[] = [];
  for (let i = 0; i < textLength; i += sliceLength) {
    slices.push(cleanText.slice(i, i + sliceLength));
  }

  if (random && slices.length > maxSlices) {
    const shuffled = [...slices].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, maxSlices);
  }

  return slices.slice(0, maxSlices);
}

/**
 * 将多个文本片段合并成单个字符串
 */
export function joinSlices(slices: string[], separator: string = ' '): string {
  return slices.filter(s => s && s.trim().length > 0).join(separator);
}

/**
 * 计算文本适合的切片数量
 */
export function calculateOptimalSlices(textLength: number, maxLength: number = 1000): number {
  if (textLength <= maxLength) {
    return 1;
  }
  const sliceLength = 100;
  const totalSlices = Math.ceil(textLength / sliceLength);
  const optimalSlices = Math.min(totalSlices, 10);
  return optimalSlices;
}