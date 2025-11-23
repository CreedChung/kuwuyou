/**
 * 测试文档列表 API
 * 使用方法: bun run scripts/test-documents-api.ts
 */

const ZHIPU_API_KEY = process.env.NEXT_PUBLIC_ZHIPU_API_KEY;
const KNOWLEDGE_ID = "你的知识库ID"; // 替换为实际的知识库ID

async function testDocumentsAPI() {
	console.log("🔍 开始测试文档列表 API...\n");

	if (!ZHIPU_API_KEY) {
		console.error("❌ 错误: 未找到 NEXT_PUBLIC_ZHIPU_API_KEY 环境变量");
		console.log("请在 .env 文件中配置: NEXT_PUBLIC_ZHIPU_API_KEY=your_api_key");
		process.exit(1);
	}

	try {
		// 测试获取文档列表
		console.log("📋 测试 1: 获取文档列表");
		console.log(`知识库ID: ${KNOWLEDGE_ID}`);
		
		const params = new URLSearchParams({
			knowledge_id: KNOWLEDGE_ID,
			page: "1",
			size: "10",
		});

		const response = await fetch(
			`https://open.bigmodel.cn/api/llm-application/open/document?${params.toString()}`,
			{
				headers: {
					Authorization: `Bearer ${ZHIPU_API_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();

		if (response.ok && data.code === 200) {
			console.log("✅ 成功获取文档列表");
			console.log(`📊 总文档数: ${data.data.total}`);
			console.log(`📄 当前页文档数: ${data.data.list?.length || 0}\n`);

			if (data.data.list && data.data.list.length > 0) {
				console.log("📝 文档示例:");
				const doc = data.data.list[0];
				console.log(`  - ID: ${doc.id}`);
				console.log(`  - 名称: ${doc.name}`);
				console.log(`  - 字数: ${doc.word_num}`);
				console.log(`  - 向量化状态: ${doc.embedding_stat}`);
				if (doc.failInfo) {
					console.log(`  - 失败信息: ${doc.failInfo.embedding_msg}`);
				}
			}
		} else {
			console.error("❌ 获取失败:");
			console.error(`状态码: ${data.code}`);
			console.error(`消息: ${data.message}`);
		}

		// 测试搜索功能
		console.log("\n🔎 测试 2: 搜索文档");
		const searchParams = new URLSearchParams({
			knowledge_id: KNOWLEDGE_ID,
			page: "1",
			size: "10",
			word: "测试", // 搜索关键词
		});

		const searchResponse = await fetch(
			`https://open.bigmodel.cn/api/llm-application/open/document?${searchParams.toString()}`,
			{
				headers: {
					Authorization: `Bearer ${ZHIPU_API_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		const searchData = await searchResponse.json();

		if (searchResponse.ok && searchData.code === 200) {
			console.log("✅ 搜索成功");
			console.log(`📊 找到 ${searchData.data.total} 个匹配的文档`);
		} else {
			console.error("❌ 搜索失败:");
			console.error(`状态码: ${searchData.code}`);
			console.error(`消息: ${searchData.message}`);
		}

		console.log("\n✨ 测试完成!");
	} catch (error) {
		console.error("\n❌ 测试过程中发生错误:");
		console.error(error);
		process.exit(1);
	}
}

// 运行测试
testDocumentsAPI();