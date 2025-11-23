/**
 * 智谱智能体应用聊天Hook
 */

import { useState, useCallback, useRef } from "react";
import { zhipuAppService } from "@/services/zhipuApp";
import type { Message, KnowledgeReference, NodeEvent } from "@/components/chat/types";

export function useZhipuAppChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const currentMessageRef = useRef<Message | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 发送消息
   */
  const sendMessage = useCallback(async (content: string) => {
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
      events: [],
    };

    currentMessageRef.current = assistantMessage;
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const stream = zhipuAppService.invokeStream(content, {
        conversationId,
        sendLogEvent: true,
        sendProcessMsg: true,
      });

      for await (const chunk of stream) {
        if (!currentMessageRef.current) break;

        // 更新会话ID
        if (chunk.conversationId && !conversationId) {
          setConversationId(chunk.conversationId);
        }

        // 更新思考过程
        if (chunk.thinking) {
          currentMessageRef.current.thinking = 
            (currentMessageRef.current.thinking || "") + chunk.thinking;
        }

        // 更新主要内容
        if (chunk.content) {
          currentMessageRef.current.content += chunk.content;
        }

        // 添加知识库引用
        if (chunk.reference) {
          if (!currentMessageRef.current.references) {
            currentMessageRef.current.references = [];
          }
          // 避免重复添加相同内容
          const exists = currentMessageRef.current.references.some(
            (ref) => ref.content === chunk.reference!.content
          );
          if (!exists) {
            currentMessageRef.current.references.push(chunk.reference);
          }
        }

        // 添加事件日志
        if (chunk.event) {
          if (!currentMessageRef.current.events) {
            currentMessageRef.current.events = [];
          }
          currentMessageRef.current.events.push(chunk.event);
        }

        // 处理完成原因
        if (chunk.finishReason) {
          if (chunk.finishReason === "error") {
            currentMessageRef.current.error = "生成过程中发生错误";
          }
          currentMessageRef.current.isStreaming = false;
        }

        // 更新UI
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
  }, [conversationId, isGenerating]);

  /**
   * 停止生成
   */
  const stopGenerating = useCallback(() => {
    zhipuAppService.stopStream();
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
    setConversationId(undefined);
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
    conversationId,
    sendMessage,
    stopGenerating,
    clearMessages,
    startNewConversation,
  };
}