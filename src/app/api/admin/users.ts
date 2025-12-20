import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/db'
import { profiles, userStats } from '@/db/schema'
import { eq, like, or, desc, sql } from 'drizzle-orm'

const formatDate = (date: Date | number | null | undefined): string => {
  if (!date) return ''
  try {
    const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date)
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
  } catch { return '' }
}

const formatDateTime = (date: Date | number | null | undefined): string | null => {
  if (!date) return null
  try {
    const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date)
    return isNaN(d.getTime()) ? null : d.toISOString()
  } catch { return null }
}

const formatUser = (user: any) => ({
  id: user.id,
  name: user.username,
  email: user.email,
  avatar: null,
  role: user.role === 'admin' ? '管理员' : '普通用户',
  status: user.status || 'active',
  joinDate: formatDate(user.createdAt),
  conversationCount: user.conversationCount || 0,
  messageCount: user.messageCount || 0,
  lastActiveAt: formatDateTime(user.lastActiveAt),
})

export const Route = createFileRoute('/api/admin/users')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url)
          const search = searchParams.get('search') || ''
          const status = searchParams.get('status') || 'all'
          const page = parseInt(searchParams.get('page') || '1')
          const pageSize = parseInt(searchParams.get('pageSize') || '10')

          const baseQuery = db
            .select({
              id: profiles.id,
              username: profiles.username,
              email: profiles.email,
              role: profiles.role,
              status: profiles.status,
              createdAt: profiles.createdAt,
              conversationCount: userStats.conversationCount,
              messageCount: userStats.messageCount,
              lastActiveAt: userStats.lastActiveAt,
            })
            .from(profiles)
            .leftJoin(userStats, eq(profiles.id, userStats.userId))

          let whereConditions: any[] = []
          if (search && search !== 'undefined') {
            whereConditions.push(or(like(profiles.username, `%${search}%`), like(profiles.email, `%${search}%`)))
          }
          if (status !== 'all') {
            whereConditions.push(eq(profiles.role, status as 'user' | 'admin'))
          }

          const condition = whereConditions.length > 0 ? whereConditions[0] : undefined

          const [usersData, totalResult] = await Promise.all([
            condition
              ? baseQuery.where(condition).orderBy(desc(profiles.createdAt)).limit(pageSize).offset((page - 1) * pageSize)
              : baseQuery.orderBy(desc(profiles.createdAt)).limit(pageSize).offset((page - 1) * pageSize),
            condition
              ? db.select({ count: sql<number>`count(*)` }).from(profiles).where(condition)
              : db.select({ count: sql<number>`count(*)` }).from(profiles)
          ])

          const total = Number(totalResult[0]?.count) || 0

          return Response.json({
            success: true,
            data: {
              users: usersData.map(formatUser),
              total,
              page,
              pageSize,
              totalPages: Math.ceil(total / pageSize),
            },
          })
        } catch (error) {
          console.error('获取用户列表失败:', error)
          return Response.json({ success: false, error: '获取用户列表失败' }, { status: 500 })
        }
      },

      PUT: async ({ request }) => {
        try {
          const body = await request.json()
          const { userId, username, email, role } = body

          if (!userId) {
            return Response.json({ success: false, error: '缺少用户ID' }, { status: 400 })
          }

          const updateData: any = {}
          if (username) updateData.username = username
          if (email) updateData.email = email
          if (role) updateData.role = role

          if (Object.keys(updateData).length === 0) {
            return Response.json({ success: false, error: '没有需要更新的数据' }, { status: 400 })
          }

          updateData.updatedAt = new Date()
          await db.update(profiles).set(updateData).where(eq(profiles.id, userId))

          return Response.json({ success: true, message: '用户信息更新成功' })
        } catch (error) {
          console.error('更新用户信息失败:', error)
          return Response.json({ success: false, error: '更新用户信息失败' }, { status: 500 })
        }
      },

      DELETE: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url)
          const userId = searchParams.get('userId')

          if (!userId) {
            return Response.json({ success: false, error: '缺少用户ID' }, { status: 400 })
          }

          await db.delete(profiles).where(eq(profiles.id, userId))
          return Response.json({ success: true, message: '用户删除成功' })
        } catch (error) {
          console.error('删除用户失败:', error)
          return Response.json({ success: false, error: '删除用户失败' }, { status: 500 })
        }
      },
    }
  }
})
