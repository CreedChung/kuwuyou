/**
 * 知识库检索 Hook
 * 处理知识库检索和联网搜索
 */

import { useCallback } from "react";
import { knowledgeRetrievalService, type RetrievalSlice } from "@/services/KnowledgeRetrievalService";
import { webSearchService, type WebSearchResult } from "@/services/WebSearchService";
import type { KnowledgeReference } from "@/components/chat/types";

export interface RetrievalOptions {
  showReferences?: boolean;
  useWebSearch?: boolean;
  knowledgeId?: string;
}

export interface RetrievalResult {
  knowledgeSlices: RetrievalSlice[];
  webResults: WebSearchResult[];
  references: KnowledgeReference[];
  knowledgeContext?: string;
  webContext?: string;
}

export function useRetrieval() {
  /**
   * 执行知识库检索
   */
  const retrieveFromKnowledge = useCallback(async (
    query: string,
    knowledgeId: string
  ): Promise<RetrievalSlice[]> => {
    console.log("🔍 开始知识库检索...");
    
    try {
      const retrievalResult = await knowledgeRetrievalService.retrieve({
        query: query.trim(),
        knowledge_ids: [knowledgeId],
        top_k: 10, // 返回前10个最相关的结果
        recall_method: "mixed", // 使用混合检索
      });

      const retrievalSlices = retrievalResult.data;
      console.log("✅ 知识库检索完成:", retrievalSlices.length, "个结果");
      
      return retrievalSlices;
    } catch (error) {
      console.error("❌ 知识库检索失败:", error);
      throw error;
    }
  }, []);

  /**
   * 执行联网搜索
   */
  const searchWeb = useCallback(async (
    query: string
  ): Promise<WebSearchResult[]> => {
    console.log("🌐 开始联网搜索...");
    
    try {
      const searchResponse = await webSearchService.search(query.trim(), {
        searchEngine: "search_std",
        count: 10,
      });

      const webSearchResults = searchResponse.search_result || [];
      console.log("✅ 联网搜索完成:", webSearchResults.length, "个结果");
      
      return webSearchResults;
    } catch (error) {
      console.error("❌ 联网搜索失败:", error);
      throw error;
    }
  }, []);

  /**
   * 将检索结果转换为引用格式
   */
  const formatKnowledgeReferences = useCallback((
    retrievalSlices: RetrievalSlice[]
  ): KnowledgeReference[] => {
    if (retrievalSlices.length === 0) return [];

    return retrievalSlices.map(slice => ({
      // 清除多余的空格和换行，保持文本连续
      content: slice.text.replace(/\s+/g, ' ').trim(),
      source: slice.metadata.doc_name,
      score: slice.score,
      type: "knowledge" as const,
    }));
  }, []);

  /**
   * 执行完整的检索流程（知识库 + 联网搜索）
   */
  const performRetrieval = useCallback(async (
    query: string,
    options: RetrievalOptions
  ): Promise<RetrievalResult> => {
    const result: RetrievalResult = {
      knowledgeSlices: [],
      webResults: [],
      references: [],
    };

    const knowledgeId = options.knowledgeId || process.env.NEXT_PUBLIC_ZHIPU_KNOWLEDGE_ID;

    console.log("📋 检查检索条件:", {
      knowledgeId,
      showReferences: options.showReferences,
      useWebSearch: options.useWebSearch,
      willExecuteKnowledge: !!(knowledgeId && options.showReferences),
      willExecuteWeb: !!options.useWebSearch
    });

    // 知识库检索
    if (knowledgeId && options.showReferences) {
      try {
        const retrievalSlices = await retrieveFromKnowledge(query, knowledgeId);
        result.knowledgeSlices = retrievalSlices;

        if (retrievalSlices.length > 0) {
          const knowledgeReferences = formatKnowledgeReferences(retrievalSlices);
          result.references = [...result.references, ...knowledgeReferences];
          
          // 构建知识库上下文
          result.knowledgeContext = knowledgeRetrievalService.formatAsContext(retrievalSlices);
        } else {
          console.log("⚠️ 知识库检索无结果");
        }
      } catch (error) {
        console.error("❌ 知识库检索失败:", error);
        // 检索失败不影响后续流程，继续执行
      }
    } else if (!options.showReferences) {
      console.log("⏭️ 知识库检索已关闭");
    }

    // 联网搜索
    if (options.useWebSearch) {
      try {
        const webSearchResults = await searchWeb(query);
        result.webResults = webSearchResults;

        if (webSearchResults.length > 0) {
          const webReferences = webSearchService.formatAsReferences(webSearchResults);
          
          // 合并知识库和网络搜索的引用
          result.references = [...result.references, ...webReferences];
          
          // 构建联网搜索上下文
          result.webContext = webSearchService.formatAsContext(webSearchResults);
        } else {
          console.log("⚠️ 联网搜索无结果");
        }
      } catch (error) {
        console.error("❌ 联网搜索失败:", error);
        // 搜索失败不影响后续流程，继续执行
      }
    } else {
      console.log("⏭️ 联网搜索已关闭");
    }

    return result;
  }, [retrieveFromKnowledge, searchWeb, formatKnowledgeReferences]);

  return {
    performRetrieval,
    retrieveFromKnowledge,
    searchWeb,
    formatKnowledgeReferences,
  };
}