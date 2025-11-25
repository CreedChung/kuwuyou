import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, userStats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

// 注册请求验证 schema
const signupSchema = z.object({
	email: z.string().email("邮箱格式不正确"),
	password: z.string().min(8, "密码至少需要8个字符"),
	username: z.string().min(3, "用户名至少需要3个字符"),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		
		// 验证请求数据
		const validationResult = signupSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.issues[0];
			return NextResponse.json(
				{ error: firstError?.message || "请求数据格式不正确" },
				{ status: 400 }
			);
		}

		const { email, password, username } = validationResult.data;

		// 检查邮箱是否已存在
		const existingUser = await db
			.select()
			.from(profiles)
			.where(eq(profiles.email, email))
			.limit(1);

		if (existingUser.length > 0) {
			return NextResponse.json(
				{ error: "该邮箱已被注册" },
				{ status: 409 }
			);
		}

		// 检查用户名是否已存在
		const existingUsername = await db
			.select()
			.from(profiles)
			.where(eq(profiles.username, username))
			.limit(1);

		if (existingUsername.length > 0) {
			return NextResponse.json(
				{ error: "该用户名已被使用" },
				{ status: 409 }
			);
		}

		// 使用 bcrypt 哈希密码
		const hashedPassword = await bcrypt.hash(password, 10);

		// 创建用户
		const userId = crypto.randomUUID();
		await db.insert(profiles).values({
			id: userId,
			email,
			password: hashedPassword,
			username,
		});

		// 创建用户统计记录
		await db.insert(userStats).values({
			id: crypto.randomUUID(),
			userId,
		});

		return NextResponse.json(
			{
				success: true,
				message: "注册成功",
				user: {
					id: userId,
					email,
					username,
					role: 'user', // 新用户默认为普通用户
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("注册错误:", error);
		return NextResponse.json(
			{ error: "注册失败，请稍后重试" },
			{ status: 500 }
		);
	}
}