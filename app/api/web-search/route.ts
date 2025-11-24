import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface WebSearchRequest {
  query: string;
  searchEngine?: string;
  count?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: WebSearchRequest = await request.json();
    const { query, searchEngine = "search_std", count = 5 } = body;

    if (!query) {
      return NextResponse.json(
        { error: "查询内容不能为空" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_ZHIPU_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key 未配置" },
        { status: 500 }
      );
    }

    const baseURL = "https://open.bigmodel.cn";

    // 调用智谱 Web Search API
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
      console.error("联网搜索API错误:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || `联网搜索失败 (${response.status})` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("联网搜索错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "联网搜索失败" },
      { status: 500 }
    );
  }
}