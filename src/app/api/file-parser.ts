import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/file-parser')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { fileName, fileData, fileType } = await request.json()

          if (!fileData) {
            return Response.json({ error: '未找到文件' }, { status: 400 })
          }

          const apiKey = process.env.KNOWLEDGE_API_KEY
          if (!apiKey) {
            return Response.json({ error: '服务器未配置 API_KEY' }, { status: 500 })
          }

          const fileExt = fileName.split('.').pop()?.toLowerCase() || fileType || ''
          console.log('📄 开始解析文件:', fileName)

          // 将 base64 转回 File
          const buffer = Buffer.from(fileData, 'base64')
          const blob = new Blob([buffer])

          // 1. 创建解析任务
          const createFormData = new FormData()
          createFormData.append('file', blob, fileName)
          createFormData.append('tool_type', 'lite')
          createFormData.append('file_type', fileExt.toUpperCase())

          const createResponse = await fetch('https://open.bigmodel.cn/api/paas/v4/files/parser/create', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}` },
            body: createFormData,
          })

          console.log('📡 创建任务响应状态:', createResponse.status)

          if (!createResponse.ok) {
            const errText = await createResponse.text()
            console.error('❌ 创建任务失败:', errText)
            return Response.json({ error: '创建解析任务失败: ' + errText }, { status: 500 })
          }

          const createResult = await createResponse.json()
          console.log('📋 创建任务结果:', JSON.stringify(createResult))
          const taskId = createResult.task_id
          console.log('✅ 任务创建成功, Task ID:', taskId)

          // 2. 轮询获取结果
          for (let i = 0; i < 60; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000))

            const resultResponse = await fetch(
              `https://open.bigmodel.cn/api/paas/v4/files/parser/result/${taskId}/text`,
              { headers: { 'Authorization': `Bearer ${apiKey}` } }
            )

            if (!resultResponse.ok) continue

            const result = await resultResponse.json()
            console.log(`📊 第 ${i + 1} 次轮询, 状态: ${result.status}`)

            if (result.status === 'succeeded' && result.content) {
              console.log('✅ 解析成功!')
              return Response.json({ success: true, content: result.content, message: '文件解析成功' })
            }

            if (result.status === 'failed') {
              return Response.json({ error: result.message || '文件解析失败' }, { status: 500 })
            }
          }

          return Response.json({ error: '解析超时，请稍后重试' }, { status: 500 })
        } catch (error) {
          console.error('文件解析错误:', error)
          return Response.json({ error: error instanceof Error ? error.message : '文件解析失败' }, { status: 500 })
        }
      }
    }
  }
})
