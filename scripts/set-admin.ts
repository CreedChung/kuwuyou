import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";

async function setAdmin() {
	try {
		// 获取命令行参数（邮箱）
		const email = process.argv[2];

		if (!email) {
			console.error("❌ 请提供用户邮箱");
			console.log("用法: bun scripts/set-admin.ts <email>");
			process.exit(1);
		}

		// 查找用户
		const users = await db
			.select()
			.from(profiles)
			.where(eq(profiles.email, email))
			.limit(1);

		if (users.length === 0) {
			console.error(`❌ 未找到邮箱为 ${email} 的用户`);
			process.exit(1);
		}

		const user = users[0];

		// 更新用户角色为管理员
		await db
			.update(profiles)
			.set({ role: "admin" })
			.where(eq(profiles.id, user.id));

		console.log("✅ 成功！");
		console.log(`用户 ${user.username} (${email}) 已设置为管理员`);
		console.log("\n请重新登录以使更改生效。");
	} catch (error) {
		console.error("❌ 设置管理员失败:", error);
		process.exit(1);
	}
}

setAdmin();