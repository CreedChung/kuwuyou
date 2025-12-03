/**
 * 分析API - 第一步流式输出
 * 使用analysisSystemPrompt + glm-4.5-air + 知识库检索 + 网络搜索
 */

import { NextRequest, NextResponse } from "next/server";
import { analysisSystemPrompt } from "@/utils/prompt";

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === "development";
    
    if (isDev) {
      console.log("\n🔍 ========== 第一步：流式分析API ==========");
    }
    
    const { content, knowledgeId } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "未配置API密钥" },
        { status: 500 }
      );
    }

    const requestBody = {
      model: "glm-4.5-air",
      messages: [
        {
          role: "system",
          content: analysisSystemPrompt,
        },
        {
          role: "user",
          content: content,
        },
      ],
      stream: true,
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 8000,
      tools: [
        {
          type: "web_search",
          web_search: {
            enable: true,
          },
        },
        ...(knowledgeId ? [{
          type: "retrieval",
          retrieval: {
            knowledge_id: knowledgeId,
          },
        }] : []),
      ],
    };

    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (isDev) {
        console.error("❌ API错误:", response.status, errorData);
      }
      return NextResponse.json(
        { error: `API调用失败: ${errorData.error?.message || "未知错误"}` },
        { status: response.status }
      );
    }

    // 返回流式响应
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("流式分析API错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务器内部错误" },
      { status: 500 }
    );
  }
}