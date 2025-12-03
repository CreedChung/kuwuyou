/**
 * 聊天核心 Hook
 * 处理消息管理、对话流、分析模式
 */

import { useState, useCallback, useRef } from "react";
import { chatService, type ChatMessage } from "@/services/ChatService";
import type { Message, AnalysisItem, KnowledgeReference } from "@/components/chat/types";
import { chatSystemPrompt } from "@/utils/prompt";
import { detectAnalysisKeyword } from "@/utils/fileProcessor";

export interface ChatOptions {
  showThinking?: boolean;
  showReferences?: boolean;
  useWebSearch?: boolean;
  knowledgeId?: string;
  uploadedFile?: File;
  fileContent?: string;
}

export interface RetrievalContext {
  knowledgeContext?: string;
  webContext?: string;
  references?: KnowledgeReference[];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const currentMessageRef = useRef<Message | null>(null);
  const conversationHistoryRef = useRef<ChatMessage[]>([]);

  /**
   * 处理分析模式 - 改为流式输出
   */
  const handleAnalysisMode = useCallback(async (
    content: string,
    fileContent: string,
    retrievalContext?: RetrievalContext,
    knowledgeId?: string
  ): Promise<void> => {
    console.log("🔍 ========== 启动分析模式（流式）==========");
    console.log("📝 用户输入:", content);
    console.log("📊 文件内容长度:", fileContent.length, "字");

    const knowledgeIdToUse = knowledgeId || process.env.KNOWLEDGE_ID;

    // 构建带检索上下文的文件内容
    const contextParts: string[] = [];
    
    if (retrievalContext?.knowledgeContext) {
      console.log("📚 知识库上下文长度:", retrievalContext.knowledgeContext.length);
      contextParts.push(retrievalContext.knowledgeContext);
    }
    
    if (retrievalContext?.webContext) {
      console.log("🌐 网络搜索上下文长度:", retrievalContext.webContext.length);
      contextParts.push(retrievalContext.webContext);
    }

    // 组合上下文和文件内容
    const finalContent = contextParts.length > 0
      ? `${contextParts.join("\n\n")}\n\n待分析文件内容：\n${fileContent}`
      : fileContent;

    // ========== 第一步：流式显示详细分析 ==========
    console.log("📝 第一步：流式调用分析API");
    
    const step1Response = await fetch("/api/analysis/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: finalContent,
        knowledgeId: knowledgeIdToUse,
      }),
    });

    if (!step1Response.ok) {
      throw new Error(`第一步分析失败 (${step1Response.status})`);
    }

    // 读取流式响应
    const reader = step1Response.body?.getReader();
    const decoder = new TextDecoder();
    let step1Result = "";

    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content && currentMessageRef.current) {
                  step1Result += content;
                  currentMessageRef.current.content += content;
                  
                  // 实时更新UI
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
                      updated[lastIndex] = { ...currentMessageRef.current };
                    }
                    return updated;
                  });
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    }

    console.log("✅ 第一步完成，文本长度:", step1Result.length);

    // ========== 第二步：调用总结API生成结构化结果 ==========
    console.log("📝 第二步：生成结构化结果");
    
    const step2Response = await fetch("/api/analysis/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: step1Result,
      }),
    });

    if (!step2Response.ok) {
      throw new Error(`第二步总结失败 (${step2Response.status})`);
    }

    const step2Data = await step2Response.json();
    
    if (step2Data.success && step2Data.results && currentMessageRef.current) {
      console.log("✅ 第二步完成，结果数量:", step2Data.results.length);
      
      // 追加结构化结果
      currentMessageRef.current.analysisResults = step2Data.results;
      currentMessageRef.current.content += `\n\n---\n\n已完成规范检查分析，共发现 ${step2Data.results.length} 个问题。`;
      
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
          updated[lastIndex] = { ...currentMessageRef.current };
        }
        return updated;
      });
    }

    console.log("========== 分析模式完成 ==========\n");
  }, []);

  /**
   * 构建对话上下文
   */
  const buildContextMessages = useCallback((
    content: string,
    retrievalContext?: RetrievalContext
  ): ChatMessage[] => {
    const messagesWithContext: ChatMessage[] = [...conversationHistoryRef.current];

    // 构建上下文消息
    const contextParts: string[] = [];

    // 添加知识库上下文
    if (retrievalContext?.knowledgeContext) {
      console.log("📚 知识库上下文长度:", retrievalContext.knowledgeContext.length);
      contextParts.push(retrievalContext.knowledgeContext);
    }

    // 添加联网搜索上下文
    if (retrievalContext?.webContext) {
      console.log("🌐 网络搜索上下文长度:", retrievalContext.webContext.length);
      contextParts.push(retrievalContext.webContext);
    }

    // 构建最终的用户消息
    if (contextParts.length > 0) {
      const finalMessage = `${contextParts.join("\n\n")}\n\n用户问题：${content.trim()}`;
      console.log("📝 最终消息长度:", finalMessage.length);
      console.log("📝 最终消息预览:", finalMessage.substring(0, 300) + "...");
      messagesWithContext.push({
        role: "user",
        content: finalMessage,
      });
    } else {
      console.log("⚠️ 没有检索上下文，使用原始消息");
      messagesWithContext.push({
        role: "user",
        content: content.trim(),
      });
    }

    // 更新对话历史（只保存原始用户消息，不包含知识库上下文）
    conversationHistoryRef.current.push({
      role: "user",
      content: content.trim(),
    });

    return messagesWithContext;
  }, []);

  /**
   * 处理对话流
   */
  const processChatStream = useCallback(async (
    messages: ChatMessage[],
    options: ChatOptions
  ): Promise<void> => {
    const stream = chatService.chatCompletionStream(
      messages,
      {
        useKnowledge: false, // 不使用API内置的知识库检索
        useWebSearch: false,
        useThinking: true,   // 启用思维链
        systemPrompt: chatSystemPrompt,
      }
    );

    for await (const chunk of stream) {
      if (!currentMessageRef.current) break;

      // 更新思考过程（根据选项决定是否保存）
      if (chunk.thinking !== undefined && (options.showThinking ?? true)) {
        currentMessageRef.current.thinking =
          (currentMessageRef.current.thinking || "") + chunk.thinking;
      }

      // 更新主要内容（确保不包含思考内容）
      if (chunk.content !== undefined) {
        currentMessageRef.current.content += chunk.content;
      }

      // 添加知识库引用（根据选项决定是否保存）
      if (chunk.references && (options.showReferences ?? true)) {
        if (!currentMessageRef.current.references) {
          currentMessageRef.current.references = [];
        }
        // 合并新的引用，避免重复
        for (const ref of chunk.references) {
          const exists = currentMessageRef.current.references.some(
            (existing) => existing.content === ref.content
          );
          if (!exists) {
            currentMessageRef.current.references.push(ref);
          }
        }
      }

      // 处理完成原因
      if (chunk.finishReason) {
        if (chunk.finishReason === "sensitive" || chunk.finishReason === "network_error") {
          currentMessageRef.current.error =
            chunk.finishReason === "sensitive"
              ? "内容被安全审核拦截"
              : "网络错误";
        }
        currentMessageRef.current.isStreaming = false;
      }

      // 更新 UI
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
          updated[lastIndex] = { ...currentMessageRef.current };
        }
        return updated;
      });
    }

    // 流结束，确保状态更新
    if (currentMessageRef.current) {
      currentMessageRef.current.isStreaming = false;

      // 将助手回复添加到对话历史
      conversationHistoryRef.current.push({
        role: "assistant",
        content: currentMessageRef.current.content,
      });

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
          updated[lastIndex] = { ...currentMessageRef.current };
        }
        return updated;
      });
    }
  }, []);

  /**
   * 发送消息
   */
  const sendMessage = useCallback(async (
    content: string,
    options: ChatOptions = {},
    retrievalContext?: RetrievalContext
  ): Promise<void> => {
    if (!content.trim() || isGenerating) return;

    // 只要上传了文件，就进入分析模式，不需要检测关键词
    const isAnalysisMode = !!options.fileContent;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
      uploadedFileName: options.uploadedFile?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
      thinking: "",
      references: retrievalContext?.references || [],
      analysisResults: [],
    };

    currentMessageRef.current = assistantMessage;
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      if (isAnalysisMode && options.fileContent) {
        await handleAnalysisMode(
          content,
          options.fileContent,
          retrievalContext,
          options.knowledgeId
        );

        if (currentMessageRef.current) {
          currentMessageRef.current.isStreaming = false;
        }

        setIsGenerating(false);
        currentMessageRef.current = null;
        return;
      }

      const contextMessages = buildContextMessages(content, retrievalContext);
      await processChatStream(contextMessages, options);

    } catch (error) {
      console.error("发送消息失败:", error);

      if (currentMessageRef.current) {
        currentMessageRef.current.error =
          error instanceof Error ? error.message : "发送消息失败，请重试";
        currentMessageRef.current.isStreaming = false;

        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
            updated[lastIndex] = { ...currentMessageRef.current };
          }
          return updated;
        });
      }
    } finally {
      setIsGenerating(false);
      currentMessageRef.current = null;
    }
  }, [isGenerating, handleAnalysisMode, buildContextMessages, processChatStream]);

  /**
   * 停止生成
   */
  const stopGenerating = useCallback(() => {
    chatService.stopStream();
    if (currentMessageRef.current) {
      currentMessageRef.current.isStreaming = false;
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
          updated[lastIndex] = { ...currentMessageRef.current };
        }
        return updated;
      });
    }
    setIsGenerating(false);
    currentMessageRef.current = null;
  }, []);

  /**
   * 清空消息
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    conversationHistoryRef.current = [];
    currentMessageRef.current = null;
  }, []);

  /**
   * 创建新会话
   */
  const startNewConversation = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  return {
    messages,
    isGenerating,
    sendMessage,
    stopGenerating,
    clearMessages,
    startNewConversation,
  };
}