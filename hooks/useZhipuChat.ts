/**
 * 智谱对话补全 Hook
 * 使用知识库检索API + 对话补全API
 */

import { useState, useCallback, useRef } from "react";
import { zhipuChatService, type ChatMessage } from "@/services/zhipuChat";
import { knowledgeRetrievalService, type RetrievalSlice } from "@/services/knowledgeRetrieval";
import { webSearchService, type WebSearchResult } from "@/services/webSearch";
import type { Message, KnowledgeReference, AnalysisItem } from "@/components/chat/types";
import { chatSystemPrompt } from "@/utils/prompt";
import { detectAnalysisKeyword } from "@/utils/fileProcessor";

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
      useWebSearch?: boolean;
      knowledgeId?: string;
      uploadedFile?: File;
      fileContent?: string;
    } = {}
  ) => {
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
      references: [],
      analysisResults: [],
    };

    currentMessageRef.current = assistantMessage;
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // 如果是分析模式,调用分析API
      if (isAnalysisMode && options.fileContent) {
        console.log("🔍 ========== 启动分析模式 ==========");
        console.log("📝 用户输入:", content);
        console.log("📄 文件名:", options.uploadedFile?.name);
        console.log("📊 文件内容长度:", options.fileContent.length, "字");
        console.log("📋 文件内容预览:", options.fileContent.substring(0, 200) + "...");

        const knowledgeId = options.knowledgeId || process.env.NEXT_PUBLIC_ZHIPU_KNOWLEDGE_ID;
        console.log("🔑 知识库ID:", knowledgeId);

        const requestData = {
          content: options.fileContent,
          knowledgeId: knowledgeId,
        };
        console.log("📤 发送分析请求:", requestData);

        const analysisResponse = await fetch("/api/analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: options.fileContent,
            knowledgeId: knowledgeId,
          }),
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

          currentMessageRef.current.analysisResults = analysisData.results as AnalysisItem[];
          currentMessageRef.current.content = `已完成规范检查分析，共发现 ${analysisData.results.length} 个问题。`;
          currentMessageRef.current.isStreaming = false;

          console.log("========== 分析模式完成 ==========\n");

          // 更新UI
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
              updated[lastIndex] = { ...currentMessageRef.current };
            }
            return updated;
          });

          // 添加到对话历史
          conversationHistoryRef.current.push({
            role: "assistant",
            content: currentMessageRef.current.content,
          });

          setIsGenerating(false);
          currentMessageRef.current = null;
          return;
        }
      }

      // 第一步：检索知识库（如果开关打开且配置了知识库ID）
      let retrievalSlices: RetrievalSlice[] = [];
      const knowledgeId = options.knowledgeId || process.env.NEXT_PUBLIC_ZHIPU_KNOWLEDGE_ID;

      console.log("📋 检查知识库检索条件:", {
        knowledgeId,
        showReferences: options.showReferences,
        willExecute: !!(knowledgeId && options.showReferences)
      });

      if (knowledgeId && options.showReferences) {
        try {
          console.log("🔍 开始知识库检索...");
          const retrievalResult = await knowledgeRetrievalService.retrieve({
            query: content.trim(),
            knowledge_ids: [knowledgeId],
            top_k: 10, // 返回前10个最相关的结果
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
              type: "knowledge" as const,
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
      } else if (!options.showReferences) {
        console.log("⏭️ 知识库检索已关闭");
      }

      // 第二步：联网搜索（如果开关打开）
      let webSearchResults: WebSearchResult[] = [];

      console.log("🌐 检查联网搜索条件:", {
        useWebSearch: options.useWebSearch,
        willExecute: !!options.useWebSearch
      });

      if (options.useWebSearch) {
        try {
          console.log("🌐 开始联网搜索...");
          const searchResponse = await webSearchService.search(content.trim(), {
            searchEngine: "search_std",
            count: 10,
          });

          webSearchResults = searchResponse.search_result || [];

          // 将搜索结果转换为引用格式并显示
          if (webSearchResults.length > 0) {
            const webReferences = webSearchService.formatAsReferences(webSearchResults);

            // 合并知识库和网络搜索的引用
            if (!currentMessageRef.current.references) {
              currentMessageRef.current.references = [];
            }
            currentMessageRef.current.references = [
              ...currentMessageRef.current.references,
              ...webReferences,
            ];

            // 更新UI显示搜索结果
            setMessages((prev) => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
                updated[lastIndex] = { ...currentMessageRef.current };
              }
              return updated;
            });

            console.log("✅ 联网搜索完成:", webSearchResults.length, "个结果");
          } else {
            console.log("⚠️ 联网搜索无结果");
          }
        } catch (error) {
          console.error("❌ 联网搜索失败:", error);
          // 搜索失败不影响后续对话，继续执行
        }
      } else {
        console.log("⏭️ 联网搜索已关闭");
      }

      // 第三步：构建对话上下文（包含知识库检索结果和联网搜索结果）
      const messagesWithContext: ChatMessage[] = [...conversationHistoryRef.current];

      // 构建上下文消息
      const contextParts: string[] = [];

      // 添加知识库上下文
      if (retrievalSlices.length > 0) {
        const knowledgeContext = knowledgeRetrievalService.formatAsContext(retrievalSlices);
        contextParts.push(knowledgeContext);
      }

      // 添加联网搜索上下文
      if (webSearchResults.length > 0) {
        const webContext = webSearchService.formatAsContext(webSearchResults);
        contextParts.push(webContext);
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

      // 第四步：调用对话API（不再使用retrieval工具，因为我们已经手动检索了）
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