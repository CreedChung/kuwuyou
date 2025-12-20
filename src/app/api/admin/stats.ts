import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/admin/stats')({
  component: () => null,
})

export async function GET() {
  try {
    // 模拟统计数据
    const stats = {
      totalUsers: 150,
      activeUsers: 89,
      totalChats: 1250,
      totalKnowledge: 45
    }
    
    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
