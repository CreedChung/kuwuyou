/**
 * 博查 AI 搜索服务
 * 使用 Bocha Web Search API 进行联网搜索
 */

export interface BochaWebPageValue {
  id: string | null;
  name: string;
  url: string;
  displayUrl: string;
  snippet: string;
  summary?: string;
  siteName: string;
  siteIcon: string;
  datePublished?: string;
  dateLastCrawled: string;
  cachedPageUrl: string | null;
  language: string | null;
  isFamilyFriendly: boolean | null;
  isNavigational: boolean | null;
}

export interface BochaImageValue {
  webSearchUrl: string | null;
  name: string | null;
  thumbnailUrl: string;
  datePublished: string | null;
  contentUrl: string;
  hostPageUrl: string;
  contentSize: string | null;
  encodingFormat: string | null;
  hostPageDisplayUrl: string | null;
  width: number;
  height: number;
  thumbnail: { width: number; height: number } | null;
}

export interface BochaSearchResponse {
  code: number;
  log_id: string;
  msg: string | null;
  data: {
    _type: string;
    queryContext: {
      originalQuery: string;
    };
    webPages: {
      webSearchUrl: string;
      totalEstimatedMatches: number;
      value: BochaWebPageValue[];
      someResultsRemoved: boolean;
    };
    images: {
      id: string | null;
      readLink: string | null;
      webSearchUrl: string | null;
      value: BochaImageValue[];
      isFamilyFriendly: boolean | null;
    };
    videos: {
      id: string | null;
      readLink: string | null;
      webSearchUrl: string | null;
      isFamilyFriendly: boolean | null;
      scenario: string;
      value: unknown[];
    } | null;
  };
}

export interface BochaSearchOptions {
  summary?: boolean;        // 是否显示摘要
  freshness?: string;       // 时间范围: noLimit, oneDay, oneWeek, oneMonth, oneYear
  count?: number;           // 返回结果数量 (1-50)
  include?: string;         // 指定搜索的网站范围
  exclude?: string;         // 排除搜索的网站范围
}

class BochaSearchService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_BOCHA_API_KEY || "";
    this.baseURL = "https://api.bocha.cn/v1";
  }

  /**
   * 执行博查搜索
   */
  async search(query: string, options: BochaSearchOptions = {}): Promise<BochaSearchResponse> {
    if (!this.apiKey) {
      throw new Error("博查 API Key 未配置");
    }

    const {
      summary = true,
      freshness = "noLimit",
      count = 10,
      include,
      exclude,
    } = options;

    const requestBody: Record<string, string | number | boolean> = {
      query,
      summary,
      freshness,
      count,
    };

    if (include) {
      requestBody.include = include;
    }

    if (exclude) {
      requestBody.exclude = exclude;
    }

    const response = await fetch(`${this.baseURL}/web-search`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `博查搜索失败 (${response.status})`);
    }

    const data: BochaSearchResponse = await response.json();
    
    if (data.code !== 200) {
      throw new Error(data.msg || "博查搜索返回错误");
    }

    return data;
  }

  /**
   * 将博查搜索结果转换为统一格式
   */
  convertToUnifiedFormat(bochaResponse: BochaSearchResponse) {
    const results = bochaResponse.data.webPages.value.map((page, index) => ({
      content: page.summary || page.snippet,
      icon: page.siteIcon,
      link: page.url,
      media: page.siteName,
      publish_date: page.datePublished,
      refer: `[${index + 1}]`,
      title: page.name,
    }));

    return {
      created: Date.now(),
      id: bochaResponse.log_id,
      request_id: bochaResponse.log_id,
      search_intent: [{
        intent: "search",
        keywords: bochaResponse.data.queryContext.originalQuery,
        query: bochaResponse.data.queryContext.originalQuery,
      }],
      search_result: results,
    };
  }
}

// 导出单例
export const bochaSearchService = new BochaSearchService();

// 导出类以便测试
export { BochaSearchService };