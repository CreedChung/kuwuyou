import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/knowledge/retrieve')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { query, knowledge_ids, top_k = 10, recall_method = 'mixed' } = body

          const KNOWLEDGE_API_URL = process.env.KNOWLEDGE_API_URL || 'https://open.bigmodel.cn/api/llm-application/open/knowledge/retrieve'
          const KNOWLEDGE_API_KEY = process.env.KNOWLEDGE_API_KEY
          const KNOWLEDGE_IDS = process.env.KNOWLEDGE_IDS || '1998306783759900672'

          if (!KNOWLEDGE_API_KEY) {
            return Response.json({ error: 'Knowledge API key not configured' }, { status: 500 })
          }

          // 处理知识库ID：如果是数组且第一个元素是'使用默认'，则使用环境变量中的默认值
          let knowledgeIds: string[]
          if (Array.isArray(knowledge_ids) && knowledge_ids[0] === '使用默认') {
            knowledgeIds = KNOWLEDGE_IDS.split(',')
          } else if (Array.isArray(knowledge_ids)) {
            knowledgeIds = knowledge_ids
          } else {
            knowledgeIds = KNOWLEDGE_IDS.split(',')
          }

          const response = await fetch(KNOWLEDGE_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${KNOWLEDGE_API_KEY}`
            },
            body: JSON.stringify({
              query,
              knowledge_ids: knowledgeIds,
              top_k,
              recall_method
            })
          })

          if (!response.ok) {
            throw new Error(`Knowledge API error: ${response.status}`)
          }

          const data = await response.json()
          return Response.json(data)
        } catch (error) {
          console.error('Knowledge retrieval error:', error)
          return Response.json({ error: 'Knowledge retrieval failed' }, { status: 500 })
        }
      }
    }
  }
})
