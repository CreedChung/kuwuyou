import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface WebSearchRequest {
  query: string;
  searchEngine?: string;
  count?: number;
  provider?: "zhipu" | "bocha"; // 搜索引擎提供商
}

export async function POST(request: NextRequest) {
  try {
    const body: WebSearchRequest = await request.json();
    const {
      query,
      searchEngine = "search_std",
      count = 5,
      provider = process.env.NEXT_PUBLIC_SEARCH_ENGINE as "zhipu" | "bocha" || "bocha"
    } = body;

    if (!query) {
      return NextResponse.json(
        { error: "查询内容不能为空" },
        { status: 400 }
      );
    }

    // 根据提供商选择不同的搜索服务
    if (provider === "bocha") {
      return await searchWithBocha(query, count);
    } else {
      return await searchWithZhipu(query, searchEngine, count);
    }
  } catch (error) {
    console.error("联网搜索错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "联网搜索失败" },
      { status: 500 }
    );
  }
}

/**
 * 使用博查搜索
 */
async function searchWithBocha(query: string, count: number) {
  const apiKey = process.env.NEXT_PUBLIC_BOCHA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "博查 API Key 未配置" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.bocha.cn/v1/web-search", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      summary: true,
      freshness: "noLimit",
      count: Math.min(count, 50),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("博查搜索API错误:", errorData);
    return NextResponse.json(
      { error: errorData.message || `博查搜索失败 (${response.status})` },
      { status: response.status }
    );
  }

  const bochaData = await response.json();
  
  if (bochaData.code !== 200) {
    return NextResponse.json(
      { error: bochaData.msg || "博查搜索返回错误" },
      { status: bochaData.code }
    );
  }

  // 转换为统一格式
  const results = bochaData.data.webPages.value.map((page: any, index: number) => ({
    content: page.summary || page.snippet,
    icon: page.siteIcon,
    link: page.url,
    media: page.siteName,
    publish_date: page.datePublished,
    refer: `[${index + 1}]`,
    title: page.name,
  }));

  return NextResponse.json({
    created: Date.now(),
    id: bochaData.log_id,
    request_id: bochaData.log_id,
    search_intent: [{
      intent: "search",
      keywords: bochaData.data.queryContext.originalQuery,
      query: bochaData.data.queryContext.originalQuery,
    }],
    search_result: results,
  });
}

/**
 * 使用智谱搜索
 */
async function searchWithZhipu(query: string, searchEngine: string, count: number) {
  const apiKey = process.env.NEXT_PUBLIC_ZHIPU_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "智谱 API Key 未配置" },
      { status: 500 }
    );
  }

  const baseURL = "https://open.bigmodel.cn";

  const response = await fetch(`${baseURL}/api/paas/v4/web_search`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      search_engine: searchEngine,
      search_query: query,
      count,
      search_recency_filter: "noLimit",
      content_size: "medium",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("智谱搜索API错误:", errorData);
    return NextResponse.json(
      { error: errorData.error?.message || `智谱搜索失败 (${response.status})` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}