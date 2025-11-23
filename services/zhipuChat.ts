/**
 * 智谱对话补全服务
 * 基于智谱AI对话补全API v4
 * 支持知识库检索、联网搜索、思维链等功能
 */

import type { KnowledgeReference } from "@/components/chat/types";

// 对话消息
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// 知识库检索工具
export interface RetrievalTool {
  type: "retrieval";
  retrieval: {
    knowledge_id: string;
    prompt_template?: string;
  };
}

// 联网搜索工具
export interface WebSearchTool {
  type: "web_search";
  web_search: {
    enable: boolean;
    search_engine?: "search_std" | "search_pro" | "search_pro_sogou" | "search_pro_quark";
    search_result?: boolean;
  };
}

// 思维链配置
export interface ThinkingConfig {
  type: "enabled" | "disabled";
}

// 请求参数
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  thinking?: ThinkingConfig;
  tools?: (RetrievalTool | WebSearchTool)[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

// 流式响应块
export interface ChatCompletionChunk {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
      reasoning_content?: string;
    };
    finish_reason?: "stop" | "length" | "tool_calls" | "sensitive" | "network_error";
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  web_search?: Array<{
    icon?: string;
    title?: string;
    link?: string;
    media?: string;
    content?: string;
    refer?: string;
  }>;
}

export interface ZhipuChatConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
  knowledgeId?: string;
}

class ZhipuChatService {
  private apiKey: string;
  private baseURL: string;
  private model: string;
  private knowledgeId?: string;
  private abortController: AbortController | null = null;

  constructor(config?: ZhipuChatConfig) {
    this.apiKey = config?.apiKey || process.env.NEXT_PUBLIC_ZHIPU_API_KEY || "";
    this.baseURL = config?.baseURL || "https://open.bigmodel.cn/api";
    this.model = config?.model || "glm-4.5-air";
    this.knowledgeId = config?.knowledgeId || process.env.NEXT_PUBLIC_ZHIPU_KNOWLEDGE_ID;
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
   * 调用对话补全 API（流式）
   */
  async *chatCompletionStream(
    messages: ChatMessage[],
    options: {
      useKnowledge?: boolean;
      useWebSearch?: boolean;
      useThinking?: boolean;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): AsyncGenerator<{
    content?: string;
    thinking?: string;
    references?: KnowledgeReference[];
    finishReason?: string;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  }> {
    if (!this.apiKey) {
      throw new Error("智谱 API Key 未设置");
    }

    // 构建工具列表
    const tools: (RetrievalTool | WebSearchTool)[] = [];
    
    // 添加知识库检索工具
    if (options.useKnowledge && this.knowledgeId) {
      tools.push({
        type: "retrieval",
        retrieval: {
          knowledge_id: this.knowledgeId,
        },
      });
    }

    // 添加联网搜索工具
    if (options.useWebSearch) {
      tools.push({
        type: "web_search",
        web_search: {
          enable: true,
          search_engine: "search_pro",
          search_result: true,
        },
      });
    }

    const requestBody: ChatCompletionRequest = {
      model: this.model,
      messages,
      stream: true,
      temperature: options.temperature ?? 0.95,
      max_tokens: options.maxTokens ?? 8192,
    };

    // 添加思维链配置
    if (options.useThinking) {
      requestBody.thinking = { type: "enabled" };
    }

    // 添加工具
    if (tools.length > 0) {
      requestBody.tools = tools;
    }

    this.abortController = new AbortController();

    try {
      const response = await fetch(`${this.baseURL}/paas/v4/chat/completions`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`请求失败 (${response.status}): ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法读取响应流");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim() || !line.startsWith("data:")) continue;

          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            return;
          }

          try {
            const parsed: ChatCompletionChunk = JSON.parse(data);

            for (const choice of parsed.choices) {
              // 处理完成原因
              if (choice.finish_reason) {
                yield { finishReason: choice.finish_reason };
              }

              // 处理增量内容
              if (choice.delta) {
                // 思维链内容
                if (choice.delta.reasoning_content) {
                  yield { thinking: choice.delta.reasoning_content };
                }

                // 普通文本内容
                if (choice.delta.content) {
                  yield { content: choice.delta.content };
                }
              }
            }

            // 处理知识库引用（从 web_search 字段）
            if (parsed.web_search && parsed.web_search.length > 0) {
              const references: KnowledgeReference[] = parsed.web_search
                .filter(item => item.content)
                .map(item => ({
                  content: item.content!,
                  source: item.title || item.media || "搜索结果",
                }));

              if (references.length > 0) {
                yield { references };
              }
            }

            // 处理 token 使用统计
            if (parsed.usage) {
              yield { usage: parsed.usage };
            }
          } catch (e) {
            console.error("解析SSE数据失败:", e, data);
          }
        }
      }
    } finally {
      this.abortController = null;
    }
  }

  /**
   * 停止当前流式请求
   */
  stopStream() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<ZhipuChatConfig>) {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.baseURL) this.baseURL = config.baseURL;
    if (config.model) this.model = config.model;
    if (config.knowledgeId !== undefined) this.knowledgeId = config.knowledgeId;
  }

  /**
   * 检查配置是否完整
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * 检查知识库是否配置
   */
  hasKnowledge(): boolean {
    return !!this.knowledgeId;
  }
}

// 导出单例
export const zhipuChatService = new ZhipuChatService();

// 导出类
export { ZhipuChatService };