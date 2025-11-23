/**
 * 智谱对话补全 Hook
 * 使用新的对话补全 API，支持知识库检索
 */

import { useState, useCallback, useRef } from "react";
import { zhipuChatService, type ChatMessage } from "@/services/zhipuChat";
import type { Message, KnowledgeReference } from "@/components/chat/types";

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

    // 更新对话历史
    conversationHistoryRef.current.push({
      role: "user",
      content: content.trim(),
    });

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
      // API 始终启用知识库和思维链
      const stream = zhipuChatService.chatCompletionStream(
        conversationHistoryRef.current,
        {
          useKnowledge: true,  // 始终启用知识库
          useWebSearch: false,
          useThinking: true,   // 始终启用思维链
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