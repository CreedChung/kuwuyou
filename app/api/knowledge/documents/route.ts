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

		const apiKey = process.env.AI_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{ code: 500, message: "服务器未配置 AI_KEY" },
				{ status: 500 }
			);
		}

		const params = new URLSearchParams({
			knowledge_id: knowledgeId,
			page,
			size,
		});

		if (word) {
			params.append("word", word);
		}

		const response = await fetch(
			`https://open.bigmodel.cn/api/llm-application/open/document?${params.toString()}`,
			{
				headers: {
					Authorization: `Bearer ${apiKey}`,
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