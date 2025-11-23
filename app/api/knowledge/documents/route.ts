import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const knowledgeId = searchParams.get("knowledge_id");
		const page = searchParams.get("page") || "1";
		const size = searchParams.get("size") || "10";
		const word = searchParams.get("word") || "";

		if (!knowledgeId) {
			return NextResponse.json(
				{ code: 400, message: "缺少 knowledge_id 参数" },
				{ status: 400 }
			);
		}

		// 获取 Authorization header
		const authorization = request.headers.get("Authorization");
		if (!authorization) {
			return NextResponse.json(
				{ code: 401, message: "未提供认证信息" },
				{ status: 401 }
			);
		}

		// 构建请求参数
		const params = new URLSearchParams({
			knowledge_id: knowledgeId,
			page,
			size,
		});

		if (word) {
			params.append("word", word);
		}

		// 调用智谱 API
		const response = await fetch(
			`https://open.bigmodel.cn/api/llm-application/open/document?${params.toString()}`,
			{
				headers: {
					Authorization: authorization,
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{
					code: data.code || response.status,
					message: data.message || "获取文档列表失败",
				},
				{ status: response.status }
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("获取文档列表错误:", error);
		return NextResponse.json(
			{ code: 500, message: "服务器错误" },
			{ status: 500 }
		);
	}
}