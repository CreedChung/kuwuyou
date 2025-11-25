import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmin(email: string) {
	try {
		console.log("🔍 正在检查管理员账户...");
		console.log("邮箱:", email);
		
		const users = await db
			.select()
			.from(profiles)
			.where(eq(profiles.email, email))
			.limit(1);

		if (users.length === 0) {
			console.log("❌ 未找到该邮箱的用户");
			return;
		}

		const user = users[0];
		console.log("\n✅ 找到用户:");
		console.log("ID:", user.id);
		console.log("用户名:", user.username);
		console.log("邮箱:", user.email);
		console.log("角色:", user.role);
		console.log("创建时间:", user.createdAt);
		
		if (user.role === "admin") {
			console.log("\n✅ 该用户是管理员");
		} else {
			console.log("\n❌ 该用户不是管理员，当前角色:", user.role);
		}
	} catch (error) {
		console.error("❌ 检查失败:", error);
	}
}

// 从命令行参数获取邮箱
const email = process.argv[2];

if (!email) {
	console.log("用法: bun run scripts/check-admin.ts <邮箱地址>");
	console.log("示例: bun run scripts/check-admin.ts admin@example.com");
	process.exit(1);
}

checkAdmin(email);