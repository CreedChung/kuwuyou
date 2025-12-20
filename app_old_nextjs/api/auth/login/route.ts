import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// 登录请求验证 schema
const loginSchema = z.object({
	email: z.string().email("邮箱格式不正确"),
	password: z.string().min(1, "请输入密码"),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		
		// 验证请求数据
		const validationResult = loginSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.issues[0];
			return NextResponse.json(
				{ error: firstError?.message || "请求数据格式不正确" },
				{ status: 400 }
			);
		}

		const { email, password } = validationResult.data;

		// 查找用户
		const users = await db
			.select()
			.from(profiles)
			.where(eq(profiles.email, email))
			.limit(1);

		if (users.length === 0) {
			return NextResponse.json(
				{ error: "邮箱或密码错误" },
				{ status: 401 }
			);
		}

		const user = users[0];

		// 验证密码
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "邮箱或密码错误" },
				{ status: 401 }
			);
		}

		// 登录成功，返回用户信息（不包括密码）
		const { password: _, ...userWithoutPassword } = user;

		return NextResponse.json(
			{
				success: true,
				message: "登录成功",
				user: {
					...userWithoutPassword,
					// 确保 role 字段存在，如果数据库中没有则默认为 'user'
					role: userWithoutPassword.role || 'user',
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("登录错误:", error);
		return NextResponse.json(
			{ error: "登录失败，请稍后重试" },
			{ status: 500 }
		);
	}
}