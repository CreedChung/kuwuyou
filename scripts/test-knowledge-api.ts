/**
 * 测试知识库 API
 * 运行: bun run scripts/test-knowledge-api.ts
 */

const API_URL = "http://localhost:3000/api/knowledge";

// 从环境变量获取 API Key
const API_KEY = process.env.NEXT_PUBLIC_ZHIPU_API_KEY;

async function testKnowledgeAPI() {
	console.log("==================== 测试知识库 API ====================\n");
	
	if (!API_KEY) {
		console.error("❌ 错误: 请在 .env.local 文件中设置 NEXT_PUBLIC_ZHIPU_API_KEY");
		console.error("示例: NEXT_PUBLIC_ZHIPU_API_KEY=your_api_key_here\n");
		return;
	}

	console.log("🔑 API Key:", `${API_KEY.substring(0, 20)}...`);
	console.log("🌐 请求地址:", API_URL);
	console.log("\n📡 发送请求...\n");

	try {
		const response = await fetch(`${API_URL}?page=1&size=10`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${API_KEY}`,
				"Content-Type": "application/json",
			},
		});

		console.log("📊 响应状态:", response.status, response.statusText);
		
		const data = await response.json();
		
		console.log("\n📦 响应数据:");
		console.log(JSON.stringify(data, null, 2));

		if (response.ok && data.data) {
			console.log("\n✅ 成功获取知识库列表!");
			console.log(`📚 总计: ${data.data.total} 个知识库`);
			console.log(`📄 当前页: ${data.data.list?.length || 0} 个知识库\n`);
			
			if (data.data.list && data.data.list.length > 0) {
				console.log("知识库列表:");
				data.data.list.forEach((item: any, index: number) => {
					console.log(`\n${index + 1}. ${item.name}`);
					console.log(`   ID: ${item.id}`);
					console.log(`   描述: ${item.description || "无"}`);
					console.log(`   文档数: ${item.document_size}`);
					console.log(`   总字数: ${item.word_num}`);
				});
			}
		} else {
			console.log("\n❌ 请求失败");
			console.log("错误信息:", data.message || "未知错误");
		}

	} catch (error) {
		console.error("\n❌ 请求错误:");
		console.error(error);
	}

	console.log("\n==================== 测试结束 ====================");
}

// 运行测试
testKnowledgeAPI();