import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/knowledge/upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url)
          const knowledgeId = searchParams.get('id')

          if (!knowledgeId) {
            return Response.json({ code: 400, message: '缺少知识库 ID' }, { status: 400 })
          }

          const apiKey = process.env.KNOWLEDGE_API_KEY
          if (!apiKey) {
            return Response.json({ code: 500, message: '服务器未配置 KNOWLEDGE_API_KEY' }, { status: 500 })
          }

          const formData = await request.clone().formData()

          const response = await fetch(
            `https://open.bigmodel.cn/api/llm-application/open/document/upload_document/${knowledgeId}`,
            {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${apiKey}` },
              body: formData,
            }
          )

          const data = await response.json()

          if (!response.ok) {
            return Response.json({ code: data.code || response.status, message: data.message || '上传文档失败' }, { status: response.status })
          }

          return Response.json(data)
        } catch (error) {
          console.error('上传文档错误:', error)
          return Response.json({ code: 500, message: '服务器错误' }, { status: 500 })
        }
      }
    }
  }
})
