/**
 * 博查 AI 联网搜索服务
 * 使用 Bocha Web Search API 进行联网搜索
 */

export interface WebSearchResult {
  content: string;      // 网页摘要
  icon: string;        // 网站图标
  link: string;        // 网页链接
  media: string;       // 网站名称
  publish_date?: string; // 发布日期
  refer: string;       // 引用标识
  title: string;       // 网页标题
}

export interface WebSearchIntent {
  intent: string;      // 搜索意图类型
  keywords: string;    // 搜索关键词
  query: string;       // 原始查询
}

export interface WebSearchResponse {
  created: number;
  id: string;
  request_id: string;
  search_intent: WebSearchIntent[];
  search_result: WebSearchResult[];
}

export interface WebSearchOptions {
  count?: number;              // 返回结果数量 (1-50)
  searchEngine?: string;       // 搜索引擎类型
}

class WebSearchService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.BOCHA_API_KEY || "";
  }

  /**
   * 执行联网搜索
   */
  async search(query: string, options: WebSearchOptions = {}): Promise<WebSearchResponse> {
    const { count = 10 } = options;

    // 调用我们自己的 API 路由
    const response = await fetch("/api/web-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        count,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `联网搜索失败 (${response.status})`);
    }

    return await response.json();
  }

  /**
   * 检查是否配置了API
   */
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  /**
   * 格式化搜索结果为知识库引用格式
   */
  formatAsReferences(results: WebSearchResult[]) {
    return results.map(result => ({
      content: result.content,
      source: result.media,
      link: result.link,
      title: result.title,
      refer: result.refer,
      publishDate: result.publish_date,
      type: "web_search" as const,
    }));
  }

  /**
   * 格式化搜索结果为上下文文本（用于LLM）
   */
  formatAsContext(results: WebSearchResult[]): string {
    if (results.length === 0) {
      return "";
    }

    const contextParts = results.map((result, index) => {
      const parts = [
        `[${result.refer}] ${result.title}`,
        `来源：${result.media}`,
        `链接：${result.link}`,
      ];
      
      if (result.publish_date) {
        parts.push(`发布时间：${result.publish_date}`);
      }
      
      parts.push(`内容：${result.content}`);
      
      return parts.join("\n");
    });

    return `以下是联网搜索的相关信息：\n\n${contextParts.join("\n\n---\n\n")}`;
  }
}

// 导出单例
export const webSearchService = new WebSearchService();

// 导出类以便测试
export { WebSearchService };