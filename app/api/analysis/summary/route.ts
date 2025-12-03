/**
 * 分析API - 第二步结构化总结
 * 使用analysisSummaryPrompt + glm-4.5-flash 生成JSON格式结果
 */

import { NextRequest, NextResponse } from "next/server";
import { analysisSummaryPrompt } from "@/utils/prompt";

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === "development";
    
    if (isDev) {
      console.log("\n📝 ========== 第二步：结构化总结API ==========");
    }
    
    const { content } = await request.json();

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
      model: "glm-4.5-flash",
      messages: [
        {
          role: "system",
          content: analysisSummaryPrompt,
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 8000,
      response_format: {
        type: "json_object",
      },
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

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "未收到有效响应" },
        { status: 500 }
      );
    }

    // 解析JSON响应
    try {
      const analysisResults = JSON.parse(assistantMessage);

      if (!Array.isArray(analysisResults)) {
        return NextResponse.json(
          { error: "响应格式不正确，应为数组" },
          { status: 500 }
        );
      }

      if (isDev) {
        console.log("✅ 总结完成，共", analysisResults.length, "个结果");
        console.log("💰 Token使用:", data.usage);
      }

      return NextResponse.json({
        success: true,
        results: analysisResults,
        usage: data.usage,
      });
    } catch (parseError) {
      console.error("❌ JSON解析失败:", parseError);
      return NextResponse.json(
        {
          error: "响应解析失败",
          rawResponse: assistantMessage
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("总结API错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务器内部错误" },
      { status: 500 }
    );
  }
}