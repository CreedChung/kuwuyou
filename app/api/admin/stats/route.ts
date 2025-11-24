import { NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles, conversations, messages, userStats } from '@/db/schema';
import { sql, count, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// 获取系统统计数据
export async function GET() {
  try {
    // 获取总用户数
    const totalUsersResult = await db.select({ count: count() }).from(profiles);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // 获取活跃用户数（最近30天有活动）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsersResult = await db
      .select({ count: count() })
      .from(userStats)
      .where(sql`${userStats.lastActiveAt} > ${Math.floor(thirtyDaysAgo.getTime() / 1000)}`);
    const activeUsers = activeUsersResult[0]?.count || 0;

    // 获取总消息数
    const totalMessagesResult = await db.select({ count: count() }).from(messages);
    const totalMessages = totalMessagesResult[0]?.count || 0;

    // 获取总对话数
    const totalConversationsResult = await db.select({ count: count() }).from(conversations);
    const totalConversations = totalConversationsResult[0]?.count || 0;

    // 计算增长率（简化版本，实际应该对比上个月数据）
    const userGrowth = 12.5; // 模拟数据
    const activeGrowth = 8.2;
    const messageGrowth = 15.7;

    // 模拟收入数据（如果有支付系统，从支付表获取）
    const totalRevenue = 45678;
    const revenueGrowth = -3.1;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalMessages,
        totalConversations,
        totalRevenue,
        userGrowth,
        activeGrowth,
        messageGrowth,
        revenueGrowth,
      },
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}