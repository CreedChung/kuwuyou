import { createFileRoute } from '@tanstack/react-router'
import { z } from "zod"

const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
})

const chatCompletionSchema = z.object({
  model: z.string().optional(),
  messages: z.array(chatMessageSchema).min(1),
  stream: z.boolean().default(true),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(100000).optional(),
  thinking: z.object({
    type: z.enum(["enabled"]),
  }).optional(),
})

export const Route = createFileRoute('/api/chat/completions')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const validatedData = chatCompletionSchema.parse(body)

          const AI_API_KEY = process.env.AI_API_KEY
          const AI_API_URL = process.env.AI_API_URL || 'https://api.siliconflow.cn/v1'
          const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'MiniMaxAI/MiniMax-M2'
          const DEFAULT_TEMPERATURE = parseFloat(process.env.TEMPERATURE || '0.7')
          const DEFAULT_MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '12800')

          if (!AI_API_KEY) {
            return Response.json({ error: 'AI API key not configured' }, { status: 500 })
          }

          const requestBody = {
            ...validatedData,
            model: validatedData.model || DEFAULT_MODEL,
            temperature: validatedData.temperature ?? DEFAULT_TEMPERATURE,
            max_tokens: validatedData.max_tokens ?? DEFAULT_MAX_TOKENS,
          }

          const response = await fetch(`${AI_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
          })

          if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            return Response.json({ error: error.message || 'AI API error' }, { status: response.status })
          }

          // 流式响应
          if (validatedData.stream) {
            return new Response(response.body, {
              headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
              }
            })
          }

          const data = await response.json()
          return Response.json(data)
        } catch (error) {
          console.error('Chat completion error:', error)
          return Response.json({ error: "Invalid request" }, { status: 400 })
        }
      }
    }
  }
})
