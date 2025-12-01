import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const retrieveSchema = z.object({
	request_id: z.string().optional(),
	query: z.string().min(1).max(1000),
	knowledge_ids: z.array(z.string()).optional(),
	document_ids: z.array(z.string()).optional(),
	top_k: z.number().int().min(1).max(20).default(8),
	top_n: z.number().int().min(1).max(100).default(10),
	recall_method: z.enum(["embedding", "keyword", "mixed"]).default("embedding"),
	recall_ratio: z.number().min(0).max(100).default(80),
	rerank_status: z.union([z.literal(0), z.literal(1)]).default(0),
	rerank_model: z.enum(["rerank", "rerank-pro"]).optional(),
	fractional_threshold: z.number().optional(),
});

export async function POST(request: NextRequest) {
	try {
		const isDev = process.env.NODE_ENV === "development";
		
		if (isDev) {
			console.log("==================== 知识库检索 API 请求开始 ====================");
		}

		const authorization = request.headers.get("Authorization");
		
		if (!authorization || !authorization.startsWith("Bearer ")) {
			if (isDev) console.log("❌ Authorization 验证失败");
			return NextResponse.json(
				{
					code: 401,
					message: "缺少或无效的 Authorization header"
				},
				{ status: 401 }
			);
		}

		const token = authorization.substring(7);

		const body = await request.json();
		
		const validationResult = retrieveSchema.safeParse(body);

		if (!validationResult.success) {
			const firstError = validationResult.error.issues[0];
			return NextResponse.json(
				{
					code: 400,
					message: firstError?.message || "参数验证失败",
				},
				{ status: 400 }
			);
		}

		const params = validationResult.data;

		const defaultKnowledgeId = process.env.KNOWLEDGE_ID;
		const knowledge_ids = params.knowledge_ids && params.knowledge_ids.length > 0
			? params.knowledge_ids
			: defaultKnowledgeId
				? [defaultKnowledgeId]
				: undefined;

		if (!knowledge_ids || knowledge_ids.length === 0) {
			if (isDev) console.log("❌ 未提供知识库ID且未配置默认知识库ID");
			return NextResponse.json(
				{
					code: 400,
					message: "至少需要提供一个知识库ID",
				},
				{ status: 400 }
			);
		}

		// 使用服务器端的 AI_KEY，而不是客户端传来的 token
		const serverToken = process.env.AI_KEY;
		if (!serverToken) {
			if (isDev) console.log("❌ 服务器端未配置 AI_KEY");
			return NextResponse.json(
				{
					code: 500,
					message: "服务器配置错误：缺少 AI_KEY"
				},
				{ status: 500 }
			);
		}

		// KNOWLEDGE_API_URL 应该是完整的 URL
		const apiUrl = process.env.KNOWLEDGE_API_URL ||
			"https://open.bigmodel.cn/api/llm-application/open/knowledge/retrieve";

		if (isDev) {
			console.log("🔍 知识库检索请求:", {
				query: params.query,
				knowledge_ids: knowledge_ids,
				top_k: params.top_k,
				recall_method: params.recall_method,
				usingDefaultKnowledgeId: !params.knowledge_ids || params.knowledge_ids.length === 0,
				serverToken: serverToken.substring(0, 20) + "...",
				apiUrl: apiUrl
			});
		}

		const response = await fetch(
			apiUrl,
			{
				method: "POST",
				headers: {
					"Authorization": `Bearer ${serverToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					request_id: params.request_id || `retrieve-${Date.now()}`,
					query: params.query,
					knowledge_ids: knowledge_ids,
					document_ids: params.document_ids,
					top_k: params.top_k,
					top_n: params.top_n,
					recall_method: params.recall_method,
					recall_ratio: params.recall_ratio,
					rerank_status: params.rerank_status,
					rerank_model: params.rerank_model,
					fractional_threshold: params.fractional_threshold,
				}),
			}
		);

		const data = await response.json();

		if (isDev) {
			console.log("📦 智谱AI API 原始响应:", {
				status: response.status,
				ok: response.ok,
				dataCode: data.code,
				dataMessage: data.message,
				dataCount: data.data?.length || 0
			});
		}

		if (!response.ok) {
			if (isDev) {
				console.error("❌ 智谱AI API 返回错误:", {
					status: response.status,
					data: data
				});
			}
			return NextResponse.json(
				{
					code: response.status,
					message: data.message || data.error?.message || "知识库检索失败",
					data: []
				},
				{ status: response.status }
			);
		}

		// 检查智谱 API 自己返回的 code
		if (data.code && data.code !== 200) {
			if (isDev) {
				console.error("❌ 智谱AI API 业务错误:", {
					code: data.code,
					message: data.message
				});
			}
			return NextResponse.json(
				{
					code: data.code,
					message: data.message || "知识库检索失败",
					data: []
				},
				{ status: 400 }
			);
		}

		if (isDev) {
			console.log("✅ 知识库检索成功:", {
				count: data.data?.length || 0,
			});
			console.log("==================== 知识库检索 API 请求结束 ====================");
		}

		return NextResponse.json({
			code: 200,
			message: data.message || "success",
			data: data.data || [],
			timestamp: Date.now()
		}, { status: 200 });
		
	} catch (error) {
		console.error("知识库检索错误:", error);
		return NextResponse.json(
			{
				code: 500,
				message: error instanceof Error ? error.message : "知识库检索失败，请稍后重试",
			},
			{ status: 500 }
		);
	}
}