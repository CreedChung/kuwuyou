import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 查询参数验证 schema
const querySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	size: z.coerce.number().int().min(1).max(100).default(10),
});

// 知识库列表项类型
interface KnowledgeListItem {
	id: string;
	embedding_id: number;
	name: string;
	description: string;
	background: string;
	icon: string;
	document_size: number;
	length: number;
	word_num: number;
}

// 响应类型
interface KnowledgeListResponse {
	data: {
		list: KnowledgeListItem[];
		total: number;
	};
	code: number;
	message: string;
	timestamp: number;
}

export async function GET(request: NextRequest) {
	try {
		console.log("==================== 知识库 API 请求开始 ====================");
		
		// 获取 Authorization header
		const authorization = request.headers.get("Authorization");
		console.log("Authorization header:", authorization ? `Bearer ${authorization.substring(7, 20)}...` : "未提供");
		
		if (!authorization || !authorization.startsWith("Bearer ")) {
			console.log("❌ Authorization 验证失败");
			return NextResponse.json(
				{
					code: 401,
					message: "缺少或无效的 Authorization header"
				},
				{ status: 401 }
			);
		}

		// 提取 token
		const token = authorization.substring(7);
		console.log("✅ Token 提取成功");

		// 获取查询参数
		const { searchParams } = new URL(request.url);
		const page = searchParams.get("page") || "1";
		const size = searchParams.get("size") || "10";
		console.log("查询参数:", { page, size });

		// 验证查询参数
		const validationResult = querySchema.safeParse({
			page,
			size,
		});

		if (!validationResult.success) {
			console.log("❌ 参数验证失败:", validationResult.error.issues);
			const firstError = validationResult.error.issues[0];
			return NextResponse.json(
				{
					code: 400,
					message: firstError?.message || "参数验证失败",
				},
				{ status: 400 }
			);
		}

		const { page: validPage, size: validSize } = validationResult.data;
		console.log("✅ 参数验证成功:", { validPage, validSize });

		// 从环境变量获取 API 基础地址
		const apiBaseUrl = process.env.NEXT_PUBLIC_KNOWLEDGE_API_BASE_URL ||
			"https://open.bigmodel.cn/api/llm-application/open";
		console.log("API 基础地址:", apiBaseUrl);

		// 调用智谱 AI 知识库 API
		const url = `${apiBaseUrl}/knowledge?page=${validPage}&size=${validSize}`;
		console.log("请求 URL:", url);
		
		console.log("📡 开始调用智谱 AI API...");
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		console.log("响应状态:", response.status, response.statusText);

		// 获取响应数据
		const data: KnowledgeListResponse = await response.json();
		console.log("📦 响应数据:", JSON.stringify(data, null, 2));

		// 如果智谱 API 返回错误
		if (!response.ok) {
			console.log("❌ 智谱 API 返回错误");
			return NextResponse.json(
				{
					code: data.code || response.status,
					message: data.message || "获取知识库列表失败",
				},
				{ status: response.status }
			);
		}

		console.log("✅ 成功获取知识库列表");
		console.log("知识库数量:", data.data?.total || 0);
		console.log("当前页知识库:", data.data?.list?.length || 0);
		console.log("==================== 知识库 API 请求结束 ====================");
		
		// 返回成功响应
		return NextResponse.json(data, { status: 200 });
		
	} catch (error) {
		console.error("==================== 错误 ====================");
		console.error("获取知识库列表错误:", error);
		console.error("错误详情:", error instanceof Error ? error.stack : error);
		console.error("==================== 错误结束 ====================");
		return NextResponse.json(
			{
				code: 500,
				message: error instanceof Error ? error.message : "获取知识库列表失败，请稍后重试",
			},
			{ status: 500 }
		);
	}
}