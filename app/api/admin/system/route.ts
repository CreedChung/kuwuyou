import { NextResponse } from 'next/server';
import { db } from '@/db';
import { systemSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// 获取系统状态
export async function GET() {
  try {
    // 获取服务器运行时间
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const uptimeStr = `${days}天 ${hours}小时`;

    // 测试数据库连接和响应时间
    let dbStatus: 'normal' | 'warning' | 'error' = 'normal';
    let dbResponseTime = '0ms';
    
    try {
      const start = Date.now();
      // 使用简单的查询测试数据库连接
      await db.$client.execute('SELECT 1');
      const responseTime = Date.now() - start;
      dbResponseTime = `${responseTime}ms`;
      
      if (responseTime > 100) {
        dbStatus = 'warning';
      } else if (responseTime > 500) {
        dbStatus = 'error';
      }
    } catch (error) {
      dbStatus = 'error';
      dbResponseTime = 'N/A';
    }

    // 服务器状态（简化版）
    const serverStatus: 'normal' | 'warning' | 'error' = 'normal';

    // API 状态（简化版，可以通过监控最近的请求错误率来判断）
    const apiStatus: 'normal' | 'warning' | 'error' = 'normal';

    return NextResponse.json({
      success: true,
      data: {
        server: serverStatus,
        database: dbStatus,
        api: apiStatus,
        uptime: uptimeStr,
        dbResponseTime,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('获取系统状态失败:', error);
    return NextResponse.json(
      { success: false, error: '获取系统状态失败' },
      { status: 500 }
    );
  }
}

// 更新系统设置
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { setting, value } = body;

    if (!setting) {
      return NextResponse.json(
        { success: false, error: '缺少设置项' },
        { status: 400 }
      );
    }

    const existingSetting = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, setting))
      .limit(1);

    if (existingSetting.length > 0) {
      await db
        .update(systemSettings)
        .set({
          value: String(value),
          updatedAt: new Date(),
        })
        .where(eq(systemSettings.key, setting));
    } else {
      await db.insert(systemSettings).values({
        id: `setting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        key: setting,
        value: String(value),
        description: null,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: '设置已更新',
      data: { setting, value },
    });
  } catch (error) {
    console.error('更新系统设置失败:', error);
    return NextResponse.json(
      { success: false, error: '更新系统设置失败' },
      { status: 500 }
    );
  }
}