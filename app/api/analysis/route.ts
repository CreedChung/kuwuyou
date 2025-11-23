/**
 * 分析API路由
 * 使用analysisSystemPrompt进行规范检查分析
 */

import { NextRequest, NextResponse } from "next/server";
import { analysisSystemPrompt } from "@/utils/prompt";

export async function POST(request: NextRequest) {
  try {
    console.log("\n🔍 ========== 分析API被调用 ==========");
    const { content, knowledgeId } = await request.json();
    
    console.log("📊 请求数据:");
    console.log("   内容长度:", content?.length, "字");
    console.log("   知识库ID:", knowledgeId);
    console.log("   内容预览:", content?.substring(0, 200) + "...");

    if (!content || typeof content !== "string") {
      console.error("❌ 验证失败: 内容不能为空");
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      );
    }

    // 获取环境变量
    const apiKey = process.env.NEXT_PUBLIC_ZHIPU_API_KEY;
    if (!apiKey) {
      console.error("❌ 未配置API密钥");
      return NextResponse.json(
        { error: "未配置API密钥" },
        { status: 500 }
      );
    }
    console.log("✅ API密钥已配置");

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
      ...(knowledgeId && {
        tools: [
          {
            type: "retrieval",
            retrieval: {
              knowledge_id: knowledgeId,
              prompt_template: "从知识库中搜索: {{query}}",
            },
          },
          {
            type: "web_search",
            web_search: {
              enable: true,
              search_query: content.substring(0, 200),
            },
          },
        ],
      }),
    };
    
    console.log("📤 发送给智谱AI的请求:");
    console.log("   模型:", requestBody.model);
    console.log("   启用工具:", knowledgeId ? "知识库检索 + 联网搜索" : "无");
    console.log("   JSON模式:", "已启用");

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
      console.error("❌ 智谱AI API错误:");
      console.error("   状态码:", response.status);
      console.error("   错误详情:", errorData);
      return NextResponse.json(
        { error: `API调用失败: ${errorData.error?.message || "未知错误"}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("📥 智谱AI响应:");
    console.log("   完整响应:", JSON.stringify(data, null, 2));
    
    const assistantMessage = data.choices?.[0]?.message?.content;
    console.log("📝 助手消息内容:", assistantMessage);

    if (!assistantMessage) {
      console.error("❌ 未收到有效响应");
      return NextResponse.json(
        { error: "未收到有效响应" },
        { status: 500 }
      );
    }

    // 解析JSON响应
    try {
      console.log("🔄 开始解析JSON响应...");
      const analysisResults = JSON.parse(assistantMessage);
      console.log("✅ JSON解析成功");
      console.log("📊 解析结果:", analysisResults);
      
      // 验证响应格式
      if (!Array.isArray(analysisResults)) {
        console.error("❌ 响应格式不正确，应为数组，实际类型:", typeof analysisResults);
        return NextResponse.json(
          { error: "响应格式不正确，应为数组" },
          { status: 500 }
        );
      }

      console.log("✅ 验证通过，共", analysisResults.length, "个分析结果");
      console.log("💰 Token使用:", data.usage);
      console.log("========== 分析API完成 ==========\n");

      return NextResponse.json({
        success: true,
        results: analysisResults,
        usage: data.usage,
      });
    } catch (parseError) {
      console.error("❌ JSON解析失败:");
      console.error("   错误:", parseError);
      console.error("   原始响应:", assistantMessage);
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