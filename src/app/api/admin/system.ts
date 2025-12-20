import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/admin/system')({
  component: () => null,
})

export async function GET() {
  try {
    // 模拟系统信息
    const systemInfo = {
      version: '1.0.0',
      uptime: '5 days',
      memory: '2.1 GB',
      cpu: '15%',
      status: 'healthy'
    }
    
    return new Response(JSON.stringify(systemInfo), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch system info' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
