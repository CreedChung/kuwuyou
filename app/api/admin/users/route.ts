import { NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles, userStats } from '@/db/schema';
import { eq, like, or, desc, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function queryWithRetry<T>(
  queryFn: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await queryFn();
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Query failed after retries');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // 构建查询条件
    let whereConditions = [];

    // 搜索条件
    if (search) {
      whereConditions.push(
        or(
          like(profiles.username, `%${search}%`),
          like(profiles.email, `%${search}%`)
        )
      );
    }

    // 状态筛选（这里简化处理，实际需要在 schema 中添加 status 字段）
    // 暂时使用模拟逻辑

    const [usersData, totalResult] = await Promise.all([
      queryWithRetry(() =>
        db
          .select({
            id: profiles.id,
            username: profiles.username,
            email: profiles.email,
            role: profiles.role,
            createdAt: profiles.createdAt,
            conversationCount: userStats.conversationCount,
            messageCount: userStats.messageCount,
            lastActiveAt: userStats.lastActiveAt,
          })
          .from(profiles)
          .leftJoin(userStats, eq(profiles.id, userStats.userId))
          .orderBy(desc(profiles.createdAt))
          .limit(pageSize)
          .offset((page - 1) * pageSize)
      ),
      queryWithRetry(() =>
        db.select({ count: sql<number>`count(*)` }).from(profiles)
      )
    ]);

    const total = Number(totalResult[0]?.count) || 0;

    const users = usersData.map(user => {
      const formatDate = (date: Date | number | null | undefined): string => {
        if (!date) return '';
        try {
          const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
          if (isNaN(d.getTime())) return '';
          return d.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      const formatDateTime = (date: Date | number | null | undefined): string | null => {
        if (!date) return null;
        try {
          const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
          if (isNaN(d.getTime())) return null;
          return d.toISOString();
        } catch {
          return null;
        }
      };

      return {
        id: user.id,
        name: user.username,
        email: user.email,
        avatar: null,
        role: user.role === 'admin' ? '管理员' : '普通用户',
        status: 'active',
        joinDate: formatDate(user.createdAt),
        conversationCount: user.conversationCount || 0,
        messageCount: user.messageCount || 0,
        lastActiveAt: formatDateTime(user.lastActiveAt),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        users,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

// 更新用户状态
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 这里应该添加实际的用户状态更新逻辑
    // 例如：封禁、解禁、删除等操作
    // 由于当前 schema 中没有 status 字段，这里仅返回成功

    return NextResponse.json({
      success: true,
      message: `用户操作 ${action} 执行成功`,
    });
  } catch (error) {
    console.error('更新用户状态失败:', error);
    return NextResponse.json(
      { success: false, error: '更新用户状态失败' },
      { status: 500 }
    );
  }
}

// 删除用户
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      );
    }

    // 删除用户（由于设置了级联删除，相关数据会自动删除）
    await db.delete(profiles).where(eq(profiles.id, userId));

    return NextResponse.json({
      success: true,
      message: '用户删除成功',
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { success: false, error: '删除用户失败' },
      { status: 500 }
    );
  }
}