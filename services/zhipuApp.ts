/**
 * 智谱智能体应用服务
 * 基于智谱AI智能体应用API v3
 */

import type {
  ZhipuRequestMessage,
  ZhipuStreamResponse,
  NodeEvent,
  MessageContentData,
  KnowledgeReference,
  RetrievalToolData,
  WebSearchData,
} from "@/components/chat/types";

export interface ZhipuAppConfig {
  appId: string;
  apiKey: string;
  baseURL?: string;
}

export interface CreateConversationResponse {
  data: {
    conversation_id: string;
  };
  code: number;
  message: string;
  timestamp: number;
}

export interface InvokeOptions {
  conversationId?: string;
  stream?: boolean;
  sendLogEvent?: boolean;
  sendProcessMsg?: boolean;
}

class ZhipuAppService {
  private appId: string;
  private apiKey: string;
  private baseURL: string;
  private abortController: AbortController | null = null;

  constructor(config?: ZhipuAppConfig) {
    this.appId = config?.appId || process.env.NEXT_PUBLIC_ZHIPU_APP_ID || "";
    this.apiKey = config?.apiKey || process.env.NEXT_PUBLIC_ZHIPU_API_KEY || "";
    this.baseURL =
      config?.baseURL ||
      process.env.NEXT_PUBLIC_KNOWLEDGE_API_BASE_URL ||
      "https://open.bigmodel.cn/api/llm-application/open";
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
   * 创建新会话
   */
  async createConversation(): Promise<string> {
    if (!this.appId || !this.apiKey) {
      throw new Error("智谱 App ID 或 API Key 未设置");
    }

    const response = await fetch(
      `${this.baseURL}/v2/application/${this.appId}/conversation`,
      {
        method: "POST",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`创建会话失败: ${response.statusText}`);
    }

    const data: CreateConversationResponse = await response.json();
    
    if (data.code !== 200) {
      throw new Error(data.message || "创建会话失败");
    }

    return data.data.conversation_id;
  }

  /**
   * 调用智能体应用（流式）
   */
  async *invokeStream(
    userInput: string,
    options: InvokeOptions = {}
  ): AsyncGenerator<{
    content?: string;
    contentData?: MessageContentData;
    event?: NodeEvent;
    thinking?: string;
    reference?: KnowledgeReference;
    finishReason?: "stop" | "error";
    conversationId?: string;
  }> {
    if (!this.appId || !this.apiKey) {
      throw new Error("智谱 App ID 或 API Key 未设置");
    }

    // 如果没有提供conversationId，创建新会话
    let conversationId = options.conversationId;
    if (!conversationId) {
      conversationId = await this.createConversation();
      yield { conversationId };
    }

    const requestBody = {
      app_id: this.appId,
      conversation_id: conversationId,
      stream: true,
      send_log_event: options.sendLogEvent !== false, // 默认true
      send_process_msg: options.sendProcessMsg !== false, // 默认true
      messages: [
        {
          role: "user",
          content: [
            {
              type: "input",
              value: userInput,
            },
          ],
        },
      ] as ZhipuRequestMessage[],
    };

    this.abortController = new AbortController();

    try {
      const response = await fetch(`${this.baseURL}/v3/application/invoke`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.statusText}`);
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
            const parsed: ZhipuStreamResponse = JSON.parse(data);
            
            for (const choice of parsed.choices) {
              // 处理完成原因
              if (choice.finish_reason) {
                yield { finishReason: choice.finish_reason };
              }

              // 处理增量内容
              if (choice.delta?.content) {
                const contentData = choice.delta.content;
                
                // 处理思考过程
                if (contentData.type === "process_thinking" && typeof contentData.msg === "object" && "text" in contentData.msg) {
                  yield { thinking: contentData.msg.text };
                }
                // 处理普通文本
                else if (contentData.type === "text" && typeof contentData.msg === "string") {
                  yield { 
                    content: contentData.msg,
                    contentData 
                  };
                }
                // 处理其他类型
                else {
                  yield { contentData };
                }
              }

              // 处理事件（节点执行日志）
              if (choice.delta?.event) {
                const event = choice.delta.event;
                yield { event };

                // 提取知识库引用（从 tool_finish 事件中提取）
                if (event.type === "tool_finish" && event.tool_calls?.type === "retrieval") {
                  const toolData = event.tool_calls.tool_calls_data as RetrievalToolData;
                  if (toolData?.slice_info) {
                    try {
                      // slice_info 是一个 JSON 字符串数组，每个元素包含文档切片
                      const slices = JSON.parse(toolData.slice_info) as string[];
                      
                      // 尝试从切片内容中提取文件名
                      // 智谱 API 的切片格式通常包含文档元信息
                      for (const slice of slices) {
                        // 尝试解析切片，它可能是 JSON 对象字符串
                        let content = slice;
                        let source = event.node_name || "知识库";
                        
                        try {
                          const sliceObj = JSON.parse(slice);
                          // 如果切片是对象，提取文件名和内容
                          if (sliceObj.file_name || sliceObj.document_name) {
                            source = sliceObj.file_name || sliceObj.document_name;
                          }
                          if (sliceObj.content || sliceObj.text) {
                            content = sliceObj.content || sliceObj.text;
                          }
                        } catch {
                          // 如果不是 JSON，直接使用原始内容
                          // 尝试从内容中提取可能的文件名（如果格式是 "[文件名] 内容"）
                          const fileNameMatch = slice.match(/^\[([^\]]+)\]\s*(.*)/);
                          if (fileNameMatch) {
                            source = fileNameMatch[1];
                            content = fileNameMatch[2];
                          }
                        }
                        
                        yield {
                          reference: {
                            content: content,
                            source: source,
                          },
                        };
                      }
                    } catch (e) {
                      console.error("解析知识库切片失败:", e);
                    }
                  }
                }

                // 提取联网搜索引用
                if (event.type === "tool_finish" && event.tool_calls?.type === "web_search") {
                  const searchData = event.tool_calls.tool_calls_data as WebSearchData[];
                  if (Array.isArray(searchData)) {
                    for (const item of searchData) {
                      if (item.content) {
                        yield {
                          reference: {
                            content: item.content,
                            source: item.title || item.media,
                          },
                        };
                      }
                    }
                  }
                }
              }
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
  updateConfig(config: Partial<ZhipuAppConfig>) {
    if (config.appId) this.appId = config.appId;
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.baseURL) this.baseURL = config.baseURL;
  }

  /**
   * 检查配置是否完整
   */
  isConfigured(): boolean {
    return !!this.appId && !!this.apiKey;
  }
}

// 导出单例
export const zhipuAppService = new ZhipuAppService();

// 导出类
export { ZhipuAppService };