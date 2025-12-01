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
   * 处理分析模式
   */
  const handleAnalysisMode = useCallback(async (
    content: string,
    fileContent: string,
    knowledgeId?: string
  ): Promise<AnalysisItem[] | null> => {
    console.log("🔍 ========== 启动分析模式 ==========");
    console.log("📝 用户输入:", content);
    console.log("📊 文件内容长度:", fileContent.length, "字");
    console.log("📋 文件内容预览:", fileContent.substring(0, 200) + "...");

    const knowledgeIdToUse = knowledgeId || process.env.ZHIPU_KNOWLEDGE_ID;
    console.log("🔑 知识库ID:", knowledgeIdToUse);

    const requestData = {
      content: fileContent,
      knowledgeId: knowledgeIdToUse,
    };
    console.log("📤 发送分析请求:", requestData);

    const analysisResponse = await fetch("/api/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json().catch(() => ({}));
      const errorMessage = errorData.error || `分析请求失败 (${analysisResponse.status})`;
      console.error("❌ 分析API错误:");
      console.error("   状态码:", analysisResponse.status);
      console.error("   错误信息:", errorMessage);
      console.error("   详细数据:", errorData);
      throw new Error(errorMessage);
    }

    const analysisData = await analysisResponse.json();
    console.log("📥 收到分析响应:", analysisData);

    if (analysisData.success && analysisData.results) {
      console.log("✅ 分析成功!");
      console.log("📊 分析结果数量:", analysisData.results.length);
      console.log("📋 分析结果详情:");
      analysisData.results.forEach((item: AnalysisItem, index: number) => {
        console.log(`\n--- 问题 ${index + 1} ---`);
        console.log("原句:", item.origin);
        console.log("依据:", item.reason);
        console.log("问题描述:", item.issueDes);
        console.log("修改建议:", item.suggestion);
      });

      if (analysisData.usage) {
        console.log("\n💰 Token使用情况:", analysisData.usage);
      }

      console.log("========== 分析模式完成 ==========\n");
      return analysisData.results as AnalysisItem[];
    }

    return null;
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
      contextParts.push(retrievalContext.knowledgeContext);
    }

    // 添加联网搜索上下文
    if (retrievalContext?.webContext) {
      contextParts.push(retrievalContext.webContext);
    }

    // 构建最终的用户消息
    if (contextParts.length > 0) {
      messagesWithContext.push({
        role: "user",
        content: `${contextParts.join("\n\n")}\n\n用户问题：${content.trim()}`,
      });
    } else {
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
      if (chunk.thinking && (options.showThinking ?? true)) {
        currentMessageRef.current.thinking =
          (currentMessageRef.current.thinking || "") + chunk.thinking;
      }

      // 更新主要内容
      if (chunk.content) {
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

    // 检测是否是分析模式
    const isAnalysisMode = options.fileContent && detectAnalysisKeyword(content);

    // 添加用户消息
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: isAnalysisMode ? content.trim() : content.trim(),
      timestamp: Date.now(),
      uploadedFileName: options.uploadedFile?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    // 创建助手消息
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
      // 如果是分析模式,调用分析API
      if (isAnalysisMode && options.fileContent) {
        const analysisResults = await handleAnalysisMode(
          content,
          options.fileContent,
          options.knowledgeId
        );

        if (analysisResults) {
          currentMessageRef.current.analysisResults = analysisResults;
          currentMessageRef.current.content = `已完成规范检查分析，共发现 ${analysisResults.length} 个问题。`;
          currentMessageRef.current.isStreaming = false;

          // 更新UI
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
              updated[lastIndex] = { ...currentMessageRef.current };
            }
            return updated;
          });

          setIsGenerating(false);
          currentMessageRef.current = null;
          return;
        }
      }

      // 构建对话上下文并处理对话流
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