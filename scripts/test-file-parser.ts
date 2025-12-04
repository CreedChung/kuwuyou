/**
 * 文件解析服务测试脚本
 * 使用方法: bun run scripts/test-file-parser.ts <文件路径> [toolType]
 */

import { fileParserService, type FileType, type ToolType } from '../services/FileParserService';
import { readFileSync } from 'fs';
import { basename } from 'path';

async function testFileParser() {
    // 获取命令行参数
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('使用方法: bun run scripts/test-file-parser.ts <文件路径> [toolType]');
        console.log('示例: bun run scripts/test-file-parser.ts ./test.pdf lite');
        console.log('toolType 可选值: lite (默认), expert, prime');
        process.exit(1);
    }

    const filePath = args[0];
    const toolType = (args[1] || 'lite') as ToolType;

    // 检查环境变量
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
        console.error('❌ 请设置环境变量 ZHIPU_API_KEY');
        process.exit(1);
    }

    console.log('🔑 使用 API Key:', apiKey.substring(0, 10) + '...');
    fileParserService.setApiKey(apiKey);

    try {
        // 读取文件
        console.log('📂 读取文件:', filePath);
        const fileBuffer = readFileSync(filePath);
        const fileName = basename(filePath);
        const fileExt = fileName.split('.').pop()?.toLowerCase() as FileType;

        // 创建 File 对象
        const file = new File([fileBuffer], fileName, {
            type: getContentType(fileExt),
        });

        console.log('📄 文件信息:');
        console.log('  - 文件名:', fileName);
        console.log('  - 文件大小:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('  - 文件类型:', fileExt);
        console.log('  - 解析模式:', toolType);
        console.log('');

        // 开始解析
        console.log('🚀 开始解析...');
        const startTime = Date.now();

        const result = await fileParserService.parseFile(file, fileExt, {
            toolType,
            formatType: 'text',
            pollingInterval: 3000,
            maxRetries: 100,
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log('');
        console.log('✅ 解析完成!');
        console.log('⏱️ 耗时:', duration, '秒');
        console.log('');
        console.log('📊 解析结果:');
        console.log('  - 状态:', result.status);
        console.log('  - 任务ID:', result.task_id);

        if (result.content) {
            console.log('  - 文本长度:', result.content.length, '字符');
            console.log('');
            console.log('📝 解析内容:');
            console.log('─'.repeat(80));
            console.log(result.content);
            console.log('─'.repeat(80));
        }

        if (result.parsing_result_url) {
            console.log('');
            console.log('🔗 下载链接:', result.parsing_result_url);
            console.log('⚠️ 注意: 下载链接24小时后失效');
        }

    } catch (error) {
        console.error('❌ 解析失败:', error);
        process.exit(1);
    }
}

function getContentType(ext: string): string {
    const contentTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'doc': 'application/msword',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xls': 'application/vnd.ms-excel',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'ppt': 'application/vnd.ms-powerpoint',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'txt': 'text/plain',
        'md': 'text/markdown',
        'csv': 'text/csv',
    };
    return contentTypes[ext] || 'application/octet-stream';
}

// 运行测试
testFileParser();
