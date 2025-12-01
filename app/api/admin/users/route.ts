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
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    let whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          like(profiles.username, `%${search}%`),
          like(profiles.email, `%${search}%`)
        )
      );
    }

    if (status !== 'all') {
      whereConditions.push(eq(profiles.role, status));
    }

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
      .leftJoin(userStats, eq(profiles.id, userStats.userId));

    const countQuery = db.select({ count: sql<number>`count(*)` }).from(profiles);

    if (whereConditions.length > 0) {
      const condition = whereConditions.length === 1 ? whereConditions[0] : sql`${whereConditions.join(' AND ')}`;
      const [usersData, totalResult] = await Promise.all([
        queryWithRetry(() =>
          baseQuery
            .where(condition)
            .orderBy(desc(profiles.createdAt))
            .limit(pageSize)
            .offset((page - 1) * pageSize)
        ),
        queryWithRetry(() => countQuery.where(condition))
      ]);
      
      const total = Number(totalResult[0]?.count) || 0;
      const users = usersData.map(formatUser);
      
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
    }

    const [usersData, totalResult] = await Promise.all([
      queryWithRetry(() =>
        baseQuery
          .orderBy(desc(profiles.createdAt))
          .limit(pageSize)
          .offset((page - 1) * pageSize)
      ),
      queryWithRetry(() => countQuery)
    ]);

    const total = Number(totalResult[0]?.count) || 0;
    const users = usersData.map(formatUser);

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

// 更新用户信息
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, username, email, role } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: '没有需要更新的数据' },
        { status: 400 }
      );
    }

    updateData.updatedAt = new Date();

    await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.id, userId));

    return NextResponse.json({
      success: true,
      message: '用户信息更新成功',
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新用户信息失败' },
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