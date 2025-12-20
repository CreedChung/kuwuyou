import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/knowledge/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const apiKey = process.env.KNOWLEDGE_API_KEY
          if (!apiKey) {
            return Response.json({ code: 500, message: '服务器未配置 KNOWLEDGE_API_KEY' }, { status: 500 })
          }

          const { searchParams } = new URL(request.url)
          const page = searchParams.get('page') || '1'
          const size = searchParams.get('size') || '10'

          const apiBaseUrl = 'https://open.bigmodel.cn/api/llm-application/open'
          const url = `${apiBaseUrl}/knowledge?page=${page}&size=${size}`

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          })

          const data = await response.json()

          if (!response.ok) {
            return Response.json({ code: 500, message: data.message || '获取知识库列表失败' }, { status: 500 })
          }

          return Response.json(data)
        } catch (error) {
          console.error('获取知识库列表错误:', error)
          return Response.json({ code: 500, message: '获取知识库列表失败' }, { status: 500 })
        }
      }
    }
  }
})
