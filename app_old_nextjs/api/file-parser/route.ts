import { NextRequest, NextResponse } from 'next/server';
import { fileParserService, type FileType } from '@/services/FileParserService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '未找到文件' },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: '服务器未配置 AI_KEY' },
        { status: 500 }
      );
    }

    fileParserService.setApiKey(apiKey);

    const fileExt = file.name.split('.').pop()?.toLowerCase() as FileType;
    
    console.log('📄 开始解析文件:', file.name);
    
    const result = await fileParserService.parseFile(file, fileExt, {
      toolType: 'lite',
      formatType: 'text',
      pollingInterval: 2000,
      maxRetries: 60,
    });

    if (result.status === 'succeeded' && result.content) {
      return NextResponse.json({
        success: true,
        content: result.content,
        message: '文件解析成功',
      });
    }

    return NextResponse.json(
      { error: result.message || '文件解析失败' },
      { status: 500 }
    );

  } catch (error) {
    console.error('文件解析错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '文件解析失败' },
      { status: 500 }
    );
  }
}