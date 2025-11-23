import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// 获取知识库 ID
		const knowledgeId = request.nextUrl.searchParams.get("id");
		
		if (!knowledgeId) {
			return NextResponse.json(
				{ code: 400, message: "缺少知识库 ID" },
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

		// 获取 FormData
		const formData = await request.formData();

		// 调用智谱 API 上传文档
		const response = await fetch(
			`https://open.bigmodel.cn/api/llm-application/open/document/upload_document/${knowledgeId}`,
			{
				method: "POST",
				headers: {
					Authorization: authorization,
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