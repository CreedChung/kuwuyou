import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { promptSelectorSystemPrompt, promptMap, type PromptMode } from "@/utils/prompt";

const promptSelectorSchema = z.object({
  userMessage: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      console.log("==================== 提示词选择 API 请求开始 ====================");
    }

    const token = process.env.AI_KEY;

    if (!token) {
      if (isDev) console.log("❌ AI_KEY 未配置");
      return NextResponse.json(
        { error: "服务配置错误" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validationResult = promptSelectorSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "参数验证失败" },
        { status: 400 }
      );
    }

    const { userMessage } = validationResult.data;

    const apiBaseUrl = process.env.AI_BASE_URL || "https://open.bigmodel.cn/api/paas/v4";

    if (isDev) {
      console.log("🔍 分析用户消息:", userMessage.substring(0, 50) + "...");
    }

    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3.2",
        messages: [
          { role: "system", content: promptSelectorSystemPrompt },
          { role: "user", content: userMessage }
        ],
        stream: false,
        temperature: 0.1,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`提示词选择请求失败 (${response.status}): ${errorText}`);

      // 429错误回退到默认模式
      if (response.status === 429) {
        return NextResponse.json({
          mode: "chat",
          prompt: promptMap.chat,
          fallback: true,
          error: "API请求过多，使用默认提示词",
        });
      }

      throw new Error(`请求失败 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const selectedMode = (data.choices?.[0]?.message?.content?.trim() || "chat") as PromptMode;

    const validMode = selectedMode in promptMap ? selectedMode : "chat";

    if (isDev) {
      console.log("✅ 选择的模式:", validMode);
      console.log("==================== 提示词选择 API 请求结束 ====================");
    }

    return NextResponse.json({
      mode: validMode,
      prompt: promptMap[validMode],
    });

  } catch (error) {
    console.error("提示词选择错误:", error);

    // 任何错误都回退到默认模式
    return NextResponse.json({
      mode: "chat",
      prompt: promptMap.chat,
      fallback: true,
      error: error instanceof Error ? error.message : "选择失败，使用默认提示词",
    });
  }
}