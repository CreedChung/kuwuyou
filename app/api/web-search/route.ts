import { NextRequest, NextResponse } from "next/server";
import { apiCache } from "@/lib/apiCache";

export const runtime = "edge";

interface WebSearchRequest {
  query: string;
  count?: number;
}

async function performWebSearch(query: string, count: number = 10) {
  const apiKey = process.env.SEARCH_API_KEY;
  if (!apiKey) {
    throw new Error("博查 API Key 未配置");
  }

  const apiUrl = process.env.SEARCH_API_URL || "https://api.bocha.cn/v1/web-search";

  // 使用缓存键：query + count
  const cacheKey = `web-search:${query}:${count}`;
  
  // 尝试从缓存获取，缓存5分钟
  return apiCache.fetch(
    cacheKey,
    async () => {
      const response = await fetch(apiUrl, {
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
        throw new Error(errorData.message || `博查搜索失败 (${response.status})`);
      }

      const bochaData = await response.json();
      
      if (bochaData.code !== 200) {
        throw new Error(bochaData.msg || "博查搜索返回错误");
      }

      // 转换为统一格式
      const results = bochaData.data.webPages.value.map((page: { summary?: string; snippet: string; siteIcon: string; url: string; siteName: string; datePublished?: string; name: string }, index: number) => ({
        content: page.summary || page.snippet,
        icon: page.siteIcon,
        link: page.url,
        media: page.siteName,
        publish_date: page.datePublished,
        refer: `[${index + 1}]`,
        title: page.name,
      }));

      return {
        created: Date.now(),
        id: bochaData.log_id,
        request_id: bochaData.log_id,
        search_intent: [{
          intent: "search",
          keywords: bochaData.data.queryContext.originalQuery,
          query: bochaData.data.queryContext.originalQuery,
        }],
        search_result: results,
      };
    },
    5 * 60 * 1000 // 缓存5分钟
  );
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const count = parseInt(searchParams.get("count") || "10", 10);

    if (!query) {
      return NextResponse.json(
        { error: "查询内容不能为空" },
        { status: 400 }
      );
    }

    const result = await performWebSearch(query, count);
    return NextResponse.json(result);
  } catch (error) {
    console.error("联网搜索错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "联网搜索失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: WebSearchRequest = await request.json();
    const { query, count = 10 } = body;

    if (!query) {
      return NextResponse.json(
        { error: "查询内容不能为空" },
        { status: 400 }
      );
    }

    const result = await performWebSearch(query, count);
    return NextResponse.json(result);
  } catch (error) {
    console.error("联网搜索错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "联网搜索失败" },
      { status: 500 }
    );
  }
}