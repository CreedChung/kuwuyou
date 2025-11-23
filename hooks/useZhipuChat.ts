/**
 * 智谱对话补全 Hook
 * 使用知识库检索API + 对话补全API
 */

import { useState, useCallback, useRef } from "react";
import { zhipuChatService, type ChatMessage } from "@/services/zhipuChat";
import { knowledgeRetrievalService, type RetrievalSlice } from "@/services/knowledgeRetrieval";
import type { Message, KnowledgeReference } from "@/components/chat/types";
import { chatSystemPrompt } from "@/utils/prompt";

export function useZhipuChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const currentMessageRef = useRef<Message | null>(null);
  const conversationHistoryRef = useRef<ChatMessage[]>([]);

  /**
   * 发送消息
   */
  const sendMessage = useCallback(async (
    content: string,
    options: {
      showThinking?: boolean;
      showReferences?: boolean;
      knowledgeId?: string;
    } = {}
  ) => {
    if (!content.trim() || isGenerating) return;

    // 添加用户消息
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
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
      references: [],
    };

    currentMessageRef.current = assistantMessage;
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // 第一步：检索知识库（如果配置了知识库ID）
      let retrievalSlices: RetrievalSlice[] = [];
      const knowledgeId = options.knowledgeId || process.env.NEXT_PUBLIC_ZHIPU_KNOWLEDGE_ID;
      
      if (knowledgeId && (options.showReferences ?? true)) {
        try {
          console.log("🔍 开始知识库检索...");
          const retrievalResult = await knowledgeRetrievalService.retrieve({
            query: content.trim(),
            knowledge_ids: [knowledgeId],
            top_k: 5, // 返回前5个最相关的结果
            recall_method: "mixed", // 使用混合检索
          });

          retrievalSlices = retrievalResult.data;

          // 将检索结果转换为引用格式并显示
          if (retrievalSlices.length > 0) {
            currentMessageRef.current.references = retrievalSlices.map(slice => ({
              // 清除多余的空格和换行，保持文本连续
              content: slice.text.replace(/\s+/g, ' ').trim(),
              source: slice.metadata.doc_name,
              score: slice.score,
            }));

            // 更新UI显示检索结果
            setMessages((prev) => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
                updated[lastIndex] = { ...currentMessageRef.current };
              }
              return updated;
            });

            console.log("✅ 知识库检索完成:", retrievalSlices.length, "个结果");
          } else {
            console.log("⚠️ 知识库检索无结果");
          }
        } catch (error) {
          console.error("❌ 知识库检索失败:", error);
          // 检索失败不影响后续对话，继续执行
        }
      }

      // 第二步：构建对话上下文（包含知识库检索结果）
      const messagesWithContext: ChatMessage[] = [...conversationHistoryRef.current];
      
      // 如果有检索结果，将其作为系统消息添加到对话历史
      if (retrievalSlices.length > 0) {
        const contextMessage = knowledgeRetrievalService.formatAsContext(retrievalSlices);
        messagesWithContext.push({
          role: "user",
          content: content.trim(),
        });
        
        // 在实际发送前，添加知识库上下文到最后一条用户消息
        messagesWithContext[messagesWithContext.length - 1] = {
          role: "user",
          content: `${contextMessage}\n\n用户问题：${content.trim()}`,
        };
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

      // 第三步：调用对话API（不再使用retrieval工具，因为我们已经手动检索了）
      const stream = zhipuChatService.chatCompletionStream(
        messagesWithContext,
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
  }, [isGenerating]);

  /**
   * 停止生成
   */
  const stopGenerating = useCallback(() => {
    zhipuChatService.stopStream();
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