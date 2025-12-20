import { createFileRoute } from '@tanstack/react-router'
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

const loginSchema = z.object({
	email: z.string().email("邮箱格式不正确"),
	password: z.string().min(1, "请输入密码"),
})

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          
          const validationResult = loginSchema.safeParse(body)
          if (!validationResult.success) {
            const firstError = validationResult.error.issues[0]
            return Response.json(
              { error: firstError?.message || "请求数据格式不正确" },
              { status: 400 }
            )
          }

          const { email, password } = validationResult.data

          const users = await db
            .select()
            .from(profiles)
            .where(eq(profiles.email, email))
            .limit(1)

          if (users.length === 0) {
            return Response.json(
              { error: "邮箱或密码错误" },
              { status: 401 }
            )
          }

          const user = users[0]

          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            return Response.json(
              { error: "邮箱或密码错误" },
              { status: 401 }
            )
          }

          const { password: _, ...userWithoutPassword } = user

          return Response.json(
            {
              success: true,
              message: "登录成功",
              user: {
                ...userWithoutPassword,
                role: userWithoutPassword.role || 'user',
              },
            },
            { status: 200 }
          )
        } catch (error) {
          console.error("登录错误:", error)
          return Response.json(
            { error: "登录失败，请稍后重试" },
            { status: 500 }
          )
        }
      }
    }
  }
})
