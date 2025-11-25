import { db } from "@/db";
import { profiles } from "@/db/schema";

async function listUsers() {
	try {
		console.log("🔍 正在查询所有用户...\n");
		
		const users = await db.select().from(profiles);

		if (users.length === 0) {
			console.log("❌ 数据库中没有用户");
			return;
		}

		console.log(`✅ 找到 ${users.length} 个用户:\n`);
		users.forEach((user, index) => {
			console.log(`${index + 1}. 用户信息:`);
			console.log(`   ID: ${user.id}`);
			console.log(`   用户名: ${user.username}`);
			console.log(`   邮箱: ${user.email}`);
			console.log(`   角色: ${user.role}`);
			console.log(`   创建时间: ${user.createdAt}`);
			console.log("");
		});
	} catch (error) {
		console.error("❌ 查询失败:", error);
	}
}

listUsers();