import { NextResponse } from 'next/server';
import { db } from '@/db';

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

    // 这里应该将设置保存到数据库或配置文件
    // 目前仅返回成功响应
    console.log(`更新系统设置: ${setting} = ${value}`);

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