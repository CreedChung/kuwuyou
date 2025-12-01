import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiCache } from "@/lib/apiCache";

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
		const isDev = process.env.NODE_ENV === "development";
		
		if (isDev) {
			console.log("==================== 知识库 API 请求开始 ====================");
		}
		
		// 获取 Authorization header
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

		// 提取 token
		const token = authorization.substring(7);

		// 获取查询参数
		const { searchParams } = new URL(request.url);
		const page = searchParams.get("page") || "1";
		const size = searchParams.get("size") || "10";

		// 验证查询参数
		const validationResult = querySchema.safeParse({
			page,
			size,
		});

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

		const { page: validPage, size: validSize } = validationResult.data;

		// 从环境变量获取 API 基础地址
		const apiBaseUrl = process.env.KNOWLEDGE_API_BASE_URL ||
			"https://open.bigmodel.cn/api/llm-application/open";

		// 使用缓存键：token + page + size
		const cacheKey = `knowledge:${token.substring(0, 10)}:${validPage}:${validSize}`;
		
		// 使用缓存和请求去重，缓存2分钟
		const data = await apiCache.fetch<KnowledgeListResponse>(
			cacheKey,
			async () => {
				const url = `${apiBaseUrl}/knowledge?page=${validPage}&size=${validSize}`;
				
				const response = await fetch(url, {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				// 获取响应数据
				const data: KnowledgeListResponse = await response.json();

				// 如果智谱 API 返回错误
				if (!response.ok) {
					throw new Error(data.message || "获取知识库列表失败");
				}

				return data;
			},
			2 * 60 * 1000 // 缓存2分钟
		);

		if (isDev) {
			console.log("✅ 成功获取知识库列表");
			console.log("知识库数量:", data.data?.total || 0);
			console.log("==================== 知识库 API 请求结束 ====================");
		}
		
		// 返回成功响应
		return NextResponse.json(data, { status: 200 });
		
	} catch (error) {
		console.error("获取知识库列表错误:", error);
		return NextResponse.json(
			{
				code: 500,
				message: error instanceof Error ? error.message : "获取知识库列表失败，请稍后重试",
			},
			{ status: 500 }
		);
	}
}