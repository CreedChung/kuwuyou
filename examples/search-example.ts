/**
 * 博查搜索使用示例
 * 
 * 本文件展示了如何使用集成的搜索服务
 */

import { webSearchService } from '@/services/webSearch';
import { bochaSearchService } from '@/services/bochaSearch';

// ============================================
// 示例 1: 基础搜索 (使用环境变量配置的默认引擎)
// ============================================
export async function basicSearchExample() {
  try {
    const result = await webSearchService.search('阿里巴巴2024年ESG报告');
    
    console.log('搜索结果数量:', result.search_result.length);
    console.log('第一条结果:', result.search_result[0]);
    
    return result;
  } catch (error) {
    console.error('搜索失败:', error);
    throw error;
  }
}

// ============================================
// 示例 2: 指定使用博查搜索
// ============================================
export async function bochaSearchExample() {
  try {
    const result = await webSearchService.search('Next.js 15 新特性', {
      provider: 'bocha',
      count: 10,
    });
    
    // 格式化为上下文文本
    const context = webSearchService.formatAsContext(result.search_result);
    console.log('上下文文本:\n', context);
    
    return result;
  } catch (error) {
    console.error('博查搜索失败:', error);
    throw error;
  }
}

// ============================================
// 示例 3: 指定使用智谱搜索
// ============================================
export async function zhipuSearchExample() {
  try {
    const result = await webSearchService.search('人工智能最新进展', {
      provider: 'zhipu',
      searchEngine: 'search_pro', // 使用专业搜索
      count: 5,
    });
    
    // 格式化为引用格式
    const references = webSearchService.formatAsReferences(result.search_result);
    console.log('引用格式:', references);
    
    return result;
  } catch (error) {
    console.error('智谱搜索失败:', error);
    throw error;
  }
}

// ============================================
// 示例 4: 直接使用博查服务 (高级选项)
// ============================================
export async function advancedBochaExample() {
  try {
    const result = await bochaSearchService.search('TypeScript 最佳实践', {
      summary: true,              // 显示摘要
      freshness: 'oneMonth',      // 搜索一个月内的内容
      count: 20,                  // 返回20条结果
      include: 'github.com|stackoverflow.com', // 只搜索这些域名
    });
    
    console.log('博查原始响应:', result);
    
    // 转换为统一格式
    const unified = bochaSearchService.convertToUnifiedFormat(result);
    console.log('统一格式:', unified);
    
    return unified;
  } catch (error) {
    console.error('高级搜索失败:', error);
    throw error;
  }
}

// ============================================
// 示例 5: 检查API配置
// ============================================
export function checkApiConfiguration() {
  console.log('=== API 配置检查 ===');
  console.log('博查API已配置:', webSearchService.hasBochaApi());
  console.log('智谱API已配置:', webSearchService.hasZhipuApi());
  console.log('当前默认引擎:', webSearchService.getCurrentProvider());
  
  if (!webSearchService.hasBochaApi() && !webSearchService.hasZhipuApi()) {
    console.warn('⚠️ 警告: 没有配置任何搜索API!');
    return false;
  }
  
  return true;
}

// ============================================
// 示例 6: 错误处理
// ============================================
export async function errorHandlingExample() {
  try {
    // 尝试搜索
    const result = await webSearchService.search('测试查询');
    return result;
  } catch (error) {
    if (error instanceof Error) {
      // 根据错误消息提供友好的提示
      if (error.message.includes('API Key 未配置')) {
        console.error('❌ 请在 .env 文件中配置 API Key');
        console.log('💡 提示: 访问 https://open.bocha.cn 获取博查 API Key');
      } else if (error.message.includes('403')) {
        console.error('❌ API 余额不足，请充值');
      } else if (error.message.includes('429')) {
        console.error('❌ 请求频率限制，请稍后重试');
      } else {
        console.error('❌ 搜索失败:', error.message);
      }
    }
    throw error;
  }
}

// ============================================
// 示例 7: 在 React 组件中使用
// ============================================
export const SearchComponent = () => {
  // 示例代码 (需要在实际组件中使用)
  const handleSearch = async (query: string) => {
    try {
      const result = await webSearchService.search(query, {
        count: 10,
      });
      
      // 处理搜索结果
      console.log('搜索成功:', result);
      
      // 格式化为上下文供 AI 使用
      const context = webSearchService.formatAsContext(result.search_result);
      
      return { result, context };
    } catch (error) {
      console.error('搜索失败:', error);
      throw error;
    }
  };
  
  return {
    handleSearch,
  };
};

// ============================================
// 示例 8: 批量搜索
// ============================================
export async function batchSearchExample() {
  const queries = [
    '人工智能',
    '机器学习',
    '深度学习',
  ];
  
  try {
    // 并发搜索
    const results = await Promise.all(
      queries.map(query => 
        webSearchService.search(query, { count: 5 })
      )
    );
    
    console.log('批量搜索完成:', results.length, '个查询');
    
    return results;
  } catch (error) {
    console.error('批量搜索失败:', error);
    throw error;
  }
}

// ============================================
// 示例 9: 搜索结果过滤
// ============================================
export async function filterSearchResultsExample() {
  try {
    const result = await webSearchService.search('编程教程', {
      count: 20,
    });
    
    // 过滤出最近一年的结果
    const recentResults = result.search_result.filter(item => {
      if (!item.publish_date) return false;
      
      const publishDate = new Date(item.publish_date);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      return publishDate > oneYearAgo;
    });
    
    console.log('总结果:', result.search_result.length);
    console.log('最近一年的结果:', recentResults.length);
    
    return recentResults;
  } catch (error) {
    console.error('搜索过滤失败:', error);
    throw error;
  }
}

// ============================================
// 示例 10: 搜索结果排序
// ============================================
export async function sortSearchResultsExample() {
  try {
    const result = await webSearchService.search('技术文章', {
      count: 20,
    });
    
    // 按发布日期排序 (最新的在前)
    const sortedResults = [...result.search_result].sort((a, b) => {
      if (!a.publish_date || !b.publish_date) return 0;
      return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
    });
    
    console.log('排序后的结果:', sortedResults.map(r => ({
      title: r.title,
      date: r.publish_date,
    })));
    
    return sortedResults;
  } catch (error) {
    console.error('搜索排序失败:', error);
    throw error;
  }
}

// ============================================
// 主函数 - 运行所有示例
// ============================================
export async function runAllExamples() {
  console.log('=== 开始运行搜索示例 ===\n');
  
  // 检查配置
  if (!checkApiConfiguration()) {
    console.error('请先配置 API Key');
    return;
  }
  
  try {
    console.log('\n1. 基础搜索示例');
    await basicSearchExample();
    
    console.log('\n2. 博查搜索示例');
    await bochaSearchExample();
    
    console.log('\n3. 智谱搜索示例');
    await zhipuSearchExample();
    
    console.log('\n4. 高级博查搜索示例');
    await advancedBochaExample();
    
    console.log('\n5. 错误处理示例');
    await errorHandlingExample();
    
    console.log('\n6. 批量搜索示例');
    await batchSearchExample();
    
    console.log('\n7. 搜索结果过滤示例');
    await filterSearchResultsExample();
    
    console.log('\n8. 搜索结果排序示例');
    await sortSearchResultsExample();
    
    console.log('\n=== 所有示例运行完成 ===');
  } catch (error) {
    console.error('\n运行示例时出错:', error);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runAllExamples();
}