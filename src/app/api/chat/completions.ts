import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const chatCompletionSchema = z.object({
  model: z.string().optional(),
  messages: z.array(chatMessageSchema).min(1),
  stream: z.boolean().default(true),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(100000).optional(),
  thinking: z
    .object({
      type: z.enum(["enabled"]),
    })
    .optional(),
});

export const Route = createFileRoute("/api/chat/completions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validatedData = chatCompletionSchema.parse(body);

          const AI_API_KEY = process.env.AI_API_KEY;
          const AI_API_URL =
            process.env.AI_API_URL || "https://api.siliconflow.cn/v1";
          const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "zai-org/GLM-4.6";
          const FALLBACK_MODEL =
            process.env.FALLBACK_MODEL || "Qwen/Qwen3-235B-A22B-Instruct-2507";
          const DEFAULT_TEMPERATURE = parseFloat(
            process.env.TEMPERATURE || "0.7",
          );
          const DEFAULT_MAX_TOKENS = parseInt(
            process.env.MAX_TOKENS || "12800",
          );

          if (!AI_API_KEY) {
            return Response.json(
              { error: "AI API key not configured" },
              { status: 500 },
            );
          }

          // 模型降级逻辑
          const requestedModel = validatedData.model || DEFAULT_MODEL;
          const requestBody = {
            ...validatedData,
            model: requestedModel,
            temperature: validatedData.temperature ?? DEFAULT_TEMPERATURE,
            max_tokens: validatedData.max_tokens ?? DEFAULT_MAX_TOKENS,
          };

          let response = await fetch(`${AI_API_URL}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AI_API_KEY}`,
            },
            body: JSON.stringify(requestBody),
          });

          // 如果请求失败，尝试备用模型（避免无限递归）
          if (!response.ok && FALLBACK_MODEL) {
            const isPrimaryModel =
              !validatedData.model || requestedModel === DEFAULT_MODEL;
            const isFallbackModel = requestedModel === FALLBACK_MODEL;

            if (isPrimaryModel && !isFallbackModel) {
              console.log(
                `模型 ${requestedModel} 失败，尝试备用模型 ${FALLBACK_MODEL}`,
              );

              const fallbackRequestBody = {
                ...requestBody,
                model: FALLBACK_MODEL,
              };

              response = await fetch(`${AI_API_URL}/chat/completions`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${AI_API_KEY}`,
                },
                body: JSON.stringify(fallbackRequestBody),
              });
            }
          }

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return Response.json(
              { error: error.message || "AI API error" },
              { status: response.status },
            );
          }

          // 流式响应
          if (validatedData.stream) {
            return new Response(response.body, {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
              },
            });
          }

          const data = await response.json();
          return Response.json(data);
        } catch (error) {
          console.error("Chat completion error:", error);
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }
      },
    },
  },
});
