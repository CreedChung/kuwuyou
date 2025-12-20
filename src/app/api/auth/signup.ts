import { createFileRoute } from '@tanstack/react-router'
import { db } from "@/db"
import { profiles, userStats } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import bcrypt from "bcryptjs"

const signupSchema = z.object({
	email: z.string().email("邮箱格式不正确"),
	password: z.string().min(8, "密码至少需要8个字符"),
	username: z.string().min(3, "用户名至少需要3个字符"),
})

export const Route = createFileRoute('/api/auth/signup')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          
          const validationResult = signupSchema.safeParse(body)
          if (!validationResult.success) {
            const firstError = validationResult.error.issues[0]
            return Response.json(
              { error: firstError?.message || "请求数据格式不正确" },
              { status: 400 }
            )
          }

          const { email, password, username } = validationResult.data

          const existingUser = await db
            .select()
            .from(profiles)
            .where(eq(profiles.email, email))
            .limit(1)

          if (existingUser.length > 0) {
            return Response.json(
              { error: "该邮箱已被注册" },
              { status: 409 }
            )
          }

          const existingUsername = await db
            .select()
            .from(profiles)
            .where(eq(profiles.username, username))
            .limit(1)

          if (existingUsername.length > 0) {
            return Response.json(
              { error: "该用户名已被使用" },
              { status: 409 }
            )
          }

          const hashedPassword = await bcrypt.hash(password, 10)

          const userId = crypto.randomUUID()
          await db.insert(profiles).values({
            id: userId,
            email,
            password: hashedPassword,
            username,
          })

          await db.insert(userStats).values({
            id: crypto.randomUUID(),
            userId,
          })

          return Response.json(
            {
              success: true,
              message: "注册成功",
              user: {
                id: userId,
                email,
                username,
                role: 'user',
              },
            },
            { status: 201 }
          )
        } catch (error) {
          console.error("注册错误:", error)
          return Response.json(
            { error: "注册失败，请稍后重试" },
            { status: 500 }
          )
        }
      }
    }
  }
})
