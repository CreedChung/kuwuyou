import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/web-search')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { query, count = 10 } = body

          const SEARCH_API_KEY = process.env.SEARCH_API_KEY
          const SEARCH_API_URL = process.env.SEARCH_API_URL || 'https://api.bocha.cn/v1/web-search'

          if (!SEARCH_API_KEY) {
            return Response.json({ error: '博查 API Key 未配置' }, { status: 500 })
          }

          if (!query) {
            return Response.json({ error: '查询内容不能为空' }, { status: 400 })
          }

          const response = await fetch(SEARCH_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SEARCH_API_KEY}`
            },
            body: JSON.stringify({
              query,
              summary: true,
              freshness: 'noLimit',
              count: Math.min(count, 50)
            })
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `博查搜索失败 (${response.status})`)
          }

          const bochaData = await response.json()
          
          if (bochaData.code !== 200) {
            throw new Error(bochaData.msg || '博查搜索返回错误')
          }

          // 转换为统一格式
          const results = bochaData.data.webPages.value.map((page: any, index: number) => ({
            content: page.summary || page.snippet,
            icon: page.siteIcon,
            link: page.url,
            media: page.siteName,
            publish_date: page.datePublished,
            refer: `[${index + 1}]`,
            title: page.name
          }))

          return Response.json({
            created: Date.now(),
            id: bochaData.log_id,
            request_id: bochaData.log_id,
            search_intent: [{
              intent: 'search',
              keywords: bochaData.data.queryContext.originalQuery,
              query: bochaData.data.queryContext.originalQuery
            }],
            search_result: results
          })
        } catch (error) {
          console.error('Web search error:', error)
          return Response.json({ error: error instanceof Error ? error.message : '联网搜索失败' }, { status: 500 })
        }
      }
    }
  }
})
