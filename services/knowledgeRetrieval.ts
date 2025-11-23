/**
 * 智谱知识库检索服务
 * 基于智谱AI知识库检索API
 */

export interface KnowledgeRetrievalConfig {
  apiKey: string;
  baseURL?: string;
}

// 检索请求参数
export interface RetrievalRequest {
  request_id?: string;
  query: string;
  knowledge_ids: string[];
  document_ids?: string[];
  top_k?: number; // 最终召回数量 [1-20]，默认8
  top_n?: number; // 初始召回数量 [1-100]，默认10
  recall_method?: "embedding" | "keyword" | "mixed"; // 检索类型
  recall_ratio?: number; // 混合检索中向量检索的权重 [0-100]，默认80
  rerank_status?: 0 | 1; // 是否开启重排，0: 不开启，1: 开启
  rerank_model?: "rerank" | "rerank-pro"; // 重排模型
  fractional_threshold?: number; // 相似度阈值
}

// 检索结果切片
export interface RetrievalSlice {
  text: string; // 切片内容
  score: number; // 相似度分数
  metadata: {
    _id: string; // 切片ID
    knowledge_id: string; // 知识库ID
    doc_id: string; // 文档ID
    doc_name: string; // 文档名称
    doc_url: string; // 文档URL
    contextual_text: string; // 上下文增强内容
  };
}

// 检索响应
export interface RetrievalResponse {
  data: RetrievalSlice[];
  code: number;
  message: string;
  timestamp: number;
}

class KnowledgeRetrievalService {
  private apiKey: string;
  private baseURL: string;

  constructor(config?: KnowledgeRetrievalConfig) {
    this.apiKey = config?.apiKey || process.env.NEXT_PUBLIC_ZHIPU_API_KEY || "";
    this.baseURL = config?.baseURL || "https://open.bigmodel.cn/api";
  }

  /**
   * 获取请求头
   */
  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * 检索知识库
   */
  async retrieve(params: RetrievalRequest): Promise<RetrievalResponse> {
    if (!this.apiKey) {
      throw new Error("智谱 API Key 未设置");
    }

    if (!params.query || params.query.length > 1000) {
      throw new Error("查询内容必须在1-1000字以内");
    }

    if (!params.knowledge_ids || params.knowledge_ids.length === 0) {
      throw new Error("至少需要提供一个知识库ID");
    }

    console.log("🔍 知识库检索请求:", {
      query: params.query,
      knowledge_ids: params.knowledge_ids,
      top_k: params.top_k || 8,
      recall_method: params.recall_method || "embedding",
    });

    try {
      const response = await fetch(
        `${this.baseURL}/llm-application/open/knowledge/retrieve`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({
            request_id: params.request_id || `retrieve-${Date.now()}`,
            query: params.query,
            knowledge_ids: params.knowledge_ids,
            document_ids: params.document_ids,
            top_k: params.top_k || 8,
            top_n: params.top_n || 10,
            recall_method: params.recall_method || "embedding",
            recall_ratio: params.recall_ratio || 80,
            rerank_status: params.rerank_status || 0,
            rerank_model: params.rerank_model,
            fractional_threshold: params.fractional_threshold,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`知识库检索失败 (${response.status}): ${errorText}`);
      }

      const result: RetrievalResponse = await response.json();

      if (result.code !== 200) {
        throw new Error(`知识库检索失败: ${result.message}`);
      }

      console.log("✅ 知识库检索成功:", {
        count: result.data.length,
        sources: [...new Set(result.data.map(s => s.metadata.doc_name))],
      });

      return result;
    } catch (error) {
      console.error("❌ 知识库检索错误:", error);
      throw error;
    }
  }

  /**
   * 格式化检索结果为上下文文本
   */
  formatAsContext(slices: RetrievalSlice[]): string {
    if (!slices || slices.length === 0) {
      return "";
    }

    const context = slices
      .map((slice, index) => {
        const source = slice.metadata.doc_name || "未知文档";
        const content = slice.text;
        const score = (slice.score * 100).toFixed(1);
        return `[引用${index + 1}] 来源：${source} (相关度: ${score}%)\n${content}`;
      })
      .join("\n\n");

    return `以下是从知识库中检索到的相关信息：\n\n${context}\n\n请基于以上信息回答用户问题。如果信息不足，可以结合你的知识补充，但请明确区分哪些来自知识库，哪些是你的补充。`;
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<KnowledgeRetrievalConfig>) {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.baseURL) this.baseURL = config.baseURL;
  }

  /**
   * 检查配置是否完整
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// 导出单例
export const knowledgeRetrievalService = new KnowledgeRetrievalService();

// 导出类
export { KnowledgeRetrievalService };