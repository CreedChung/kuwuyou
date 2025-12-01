/**
 * 知识库检索 Hook
 * 处理知识库检索和联网搜索，支持重试机制
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

const RETRY_DELAY = 5000;
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useRetrieval() {
  /**
   * 带重试的执行函数
   */
  const executeWithRetry = useCallback(async <T>(
    fn: () => Promise<T>,
    taskName: string
  ): Promise<T | null> => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🔄 ${taskName} 第 ${attempt} 次尝试...`);
        const result = await fn();
        console.log(`✅ ${taskName} 成功`);
        return result;
      } catch (error) {
        console.error(`❌ ${taskName} 第 ${attempt} 次失败:`, error);
        
        if (attempt < MAX_RETRIES) {
          console.log(`⏳ 等待 ${RETRY_DELAY / 1000} 秒后重试...`);
          await sleep(RETRY_DELAY);
        } else {
          console.error(`❌ ${taskName} 重试 ${MAX_RETRIES} 次后仍然失败，跳过该步骤`);
          return null;
        }
      }
    }
    return null;
  }, []);

  /**
   * 执行知识库检索
   */
  const retrieveFromKnowledge = useCallback(async (
    query: string,
    knowledgeId?: string
  ): Promise<RetrievalSlice[]> => {
    const retrievalResult = await knowledgeRetrievalService.retrieve({
      query: query.trim(),
      knowledge_ids: knowledgeId ? [knowledgeId] : undefined,
      top_k: 10,
      recall_method: "mixed",
    });

    const retrievalSlices = retrievalResult.data;
    console.log("📊 知识库检索结果:", retrievalSlices.length, "个");
    
    return retrievalSlices;
  }, []);

  /**
   * 执行联网搜索
   */
  const searchWeb = useCallback(async (
    query: string
  ): Promise<WebSearchResult[]> => {
    const searchResponse = await webSearchService.search(query.trim(), {
      searchEngine: "search_std",
      count: 10,
    });

    const webSearchResults = searchResponse.search_result || [];
    console.log("📊 联网搜索结果:", webSearchResults.length, "个");
    
    return webSearchResults;
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
   * 执行完整的检索流程（知识库 -> 联网搜索 -> 对话）
   * 每个环节失败时等待5秒重试，最多重试3次
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

    console.log("🚀 开始检索流程 (知识库 -> 联网搜索 -> 对话)");
    console.log("📋 检索配置:", {
      knowledgeId: options.knowledgeId || "使用默认",
      enableKnowledge: options.showReferences,
      enableWebSearch: options.useWebSearch,
    });

    // 步骤1: 知识库检索（带重试）
    if (options.showReferences) {
      console.log("\n📖 ========== 步骤1: 知识库检索 ==========");
      
      const retrievalSlices = await executeWithRetry(
        () => retrieveFromKnowledge(query, options.knowledgeId),
        "知识库检索"
      );

      if (retrievalSlices && retrievalSlices.length > 0) {
        result.knowledgeSlices = retrievalSlices;
        const knowledgeReferences = formatKnowledgeReferences(retrievalSlices);
        result.references = [...result.references, ...knowledgeReferences];
        result.knowledgeContext = knowledgeRetrievalService.formatAsContext(retrievalSlices);
        console.log("✅ 知识库检索完成，获得", retrievalSlices.length, "个结果");
      } else {
        console.log("⚠️ 知识库检索失败或无结果，继续下一步骤");
      }
    } else {
      console.log("\n⏭️ 跳过知识库检索（未启用）");
    }

    // 步骤2: 联网搜索（带重试）
    if (options.useWebSearch) {
      console.log("\n🌐 ========== 步骤2: 联网搜索 ==========");
      
      const webSearchResults = await executeWithRetry(
        () => searchWeb(query),
        "联网搜索"
      );

      if (webSearchResults && webSearchResults.length > 0) {
        result.webResults = webSearchResults;
        const webReferences = webSearchService.formatAsReferences(webSearchResults);
        result.references = [...result.references, ...webReferences];
        result.webContext = webSearchService.formatAsContext(webSearchResults);
        console.log("✅ 联网搜索完成，获得", webSearchResults.length, "个结果");
      } else {
        console.log("⚠️ 联网搜索失败或无结果，继续下一步骤");
      }
    } else {
      console.log("\n⏭️ 跳过联网搜索（未启用）");
    }

    console.log("\n🎯 ========== 步骤3: 准备对话 ==========");
    console.log("📊 检索流程完成，汇总:", {
      知识库结果: result.knowledgeSlices.length,
      网络搜索结果: result.webResults.length,
      总引用数: result.references.length,
    });

    return result;
  }, [executeWithRetry, retrieveFromKnowledge, searchWeb, formatKnowledgeReferences]);

  return {
    performRetrieval,
    retrieveFromKnowledge,
    searchWeb,
    formatKnowledgeReferences,
  };
}