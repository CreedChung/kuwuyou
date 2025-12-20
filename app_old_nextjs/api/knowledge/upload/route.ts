import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const knowledgeId = request.nextUrl.searchParams.get("id");
		
		if (!knowledgeId) {
			return NextResponse.json(
				{ code: 400, message: "缺少知识库 ID" },
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

		const formData = await request.formData();

		const response = await fetch(
			`https://open.bigmodel.cn/api/llm-application/open/document/upload_document/${knowledgeId}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
				body: formData,
			}
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{
					code: data.code || response.status,
					message: data.message || "上传文档失败",
				},
				{ status: response.status }
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("上传文档错误:", error);
		return NextResponse.json(
			{ code: 500, message: "服务器错误" },
			{ status: 500 }
		);
	}
}