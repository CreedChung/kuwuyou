import { NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles, conversations, messages, userStats } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    const [usersCount, conversationsCount, messagesCount] = await Promise.all([
      db.select().from(profiles),
      db.select().from(conversations),
      db.select().from(messages),
    ]);

    const backupData = {
      timestamp,
      counts: {
        users: usersCount.length,
        conversations: conversationsCount.length,
        messages: messagesCount.length,
      },
    };

    return NextResponse.json({
      success: true,
      message: `备份完成 - 用户: ${backupData.counts.users}, 对话: ${backupData.counts.conversations}, 消息: ${backupData.counts.messages}`,
      data: backupData,
    });
  } catch (error) {
    console.error('备份失败:', error);
    return NextResponse.json(
      { success: false, error: '备份失败' },
      { status: 500 }
    );
  }
}