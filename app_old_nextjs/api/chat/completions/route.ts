import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const chatMessageSchema = z.object({
	role: z.enum(["system", "user", "assistant"]),
	content: z.string(),
});

const chatCompletionSchema = z.object({
	model: z.string().default("deepseek-ai/DeepSeek-V3.2"),
	messages: z.array(chatMessageSchema).min(1),
	stream: z.boolean().default(true),
	temperature: z.number().min(0).max(2).default(0.95),
	max_tokens: z.number().int().min(1).max(50000).default(12800),
	thinking: z.object({
		type: z.enum(["enabled"]),
	}).optional(),
});

export async function POST(request: NextRequest) {
	try {
		const isDev = process.env.NODE_ENV === "development";

		if (isDev) {
			console.log("==================== Chat Completions API 请求开始 ====================");
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

		const validationResult = chatCompletionSchema.safeParse(body);

		if (!validationResult.success) {
			const firstError = validationResult.error.issues[0];
			return NextResponse.json(
				{ error: firstError?.message || "参数验证失败" },
				{ status: 400 }
			);
		}

		const params = validationResult.data;

		const apiBaseUrl = process.env.AI_BASE_URL ||
			"https://open.bigmodel.cn/api/paas/v4";

		if (isDev) {
			console.log("🚀 Chat Completions 请求:", {
				model: params.model,
				messageCount: params.messages.length,
				stream: params.stream,
				useThinking: !!params.thinking,
			});
		}

		const response = await fetch(`${apiBaseUrl}/chat/completions`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`请求失败 (${response.status}): ${errorText}`);
		}

		if (params.stream) {
			if (isDev) {
				console.log("📡 返回流式响应");
			}

			return new NextResponse(response.body, {
				headers: {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
					"Connection": "keep-alive",
				},
			});
		} else {
			const data = await response.json();

			if (isDev) {
				console.log("✅ Chat Completions 成功");
				console.log("==================== Chat Completions API 请求结束 ====================");
			}

			return NextResponse.json(data, { status: 200 });
		}

	} catch (error) {
		console.error("Chat Completions 错误:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "请求失败，请稍后重试" },
			{ status: 500 }
		);
	}
}