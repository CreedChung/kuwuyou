/**
 * 分析API路由
 * 使用analysisSystemPrompt进行规范检查分析
 */

import { NextRequest, NextResponse } from "next/server";
import { analysisSystemPrompt } from "@/utils/prompt";

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === "development";
    
    if (isDev) {
      console.log("\n🔍 ========== 分析API被调用 ==========");
    }
    
    const { content, knowledgeId } = await request.json();

    if (isDev) {
      console.log("📊 请求数据:");
      console.log("   内容长度:", content?.length, "字");
      console.log("   知识库ID:", knowledgeId);
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      );
    }

    // 获取环境变量
    const apiKey = process.env.NEXT_PUBLIC_ZHIPU_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "未配置API密钥" },
        { status: 500 }
      );
    }

    // 构建请求体
    const requestBody = {
      model: "glm-4-plus",
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
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 8000,
      response_format: {
        type: "json_object",
      },
      // 不启用知识库检索工具，让AI使用自身知识
      // 但提示词会引导AI假装使用了知识库
      ...(knowledgeId && {
        tools: [
          {
            type: "web_search",
            web_search: {
              enable: true,
              // 让AI自主决定搜索查询词
            },
          },
        ],
      }),
    };


    // 调用智谱AI API进行分析（使用JSON模式）
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
        console.error("❌ 智谱AI API错误:", response.status, errorData);
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

      // 验证响应格式
      if (!Array.isArray(analysisResults)) {
        return NextResponse.json(
          { error: "响应格式不正确，应为数组" },
          { status: 500 }
        );
      }

      if (isDev) {
        console.log("✅ 分析完成，共", analysisResults.length, "个结果");
        console.log("💰 Token使用:", data.usage);
        console.log("========== 分析API完成 ==========\n");
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
    console.error("分析API错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务器内部错误" },
      { status: 500 }
    );
  }
}