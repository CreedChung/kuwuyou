import { db } from "@/db";
import { profiles, userStats } from "@/db/schema";
import { eq } from "drizzle-orm";

async function testSignup() {
	try {
		console.log("测试注册功能...");
		
		const email = "test@example.com";
		const password = "TestPassword123!";
		const username = "testuser";

		// 检查邮箱是否已存在
		console.log("1. 检查邮箱是否存在...");
		const existingUser = await db
			.select()
			.from(profiles)
			.where(eq(profiles.email, email))
			.limit(1);

		console.log("现有用户:", existingUser);

		if (existingUser.length > 0) {
			console.log("邮箱已存在，先删除旧用户...");
			await db.delete(profiles).where(eq(profiles.email, email));
		}

		// 使用 Bun 的内置密码哈希
		console.log("2. 加密密码...");
		const hashedPassword = await Bun.password.hash(password, {
			algorithm: "bcrypt",
			cost: 10,
		});
		console.log("密码已加密");

		// 创建用户
		console.log("3. 创建用户...");
		const userId = crypto.randomUUID();
		await db.insert(profiles).values({
			id: userId,
			email,
			password: hashedPassword,
			username,
		});
		console.log("✓ 用户创建成功, ID:", userId);

		// 创建用户统计记录
		console.log("4. 创建用户统计...");
		await db.insert(userStats).values({
			id: crypto.randomUUID(),
			userId,
		});
		console.log("✓ 用户统计创建成功");

		// 验证用户创建
		console.log("5. 验证用户...");
		const newUser = await db
			.select()
			.from(profiles)
			.where(eq(profiles.email, email))
			.limit(1);
		console.log("✓ 注册测试成功!", newUser[0]);
		
	} catch (error) {
		console.error("❌ 测试失败:", error);
	}
}

testSignup();