import { createFileRoute } from "@tanstack/react-router";
import { analysisSystemPrompt } from "../../../../utils/prompt";

export const Route = createFileRoute("/api/analysis/stream")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { content } = await request.json();

          if (!content) {
            return Response.json({ error: "内容不能为空" }, { status: 400 });
          }

          const apiKey = process.env.AI_API_KEY;
          const apiUrl =
            process.env.AI_API_URL || "https://api.siliconflow.cn/v1";
          const model = process.env.DEFAULT_MODEL || "zai-org/GLM-4.6";

          if (!apiKey) {
            return Response.json({ error: "未配置API密钥" }, { status: 500 });
          }

          const response = await fetch(`${apiUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: analysisSystemPrompt },
                { role: "user", content },
              ],
              stream: true,
              temperature: 0.7,
              max_tokens: 8000,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return Response.json(
              {
                error: `API调用失败: ${errorData.error?.message || "未知错误"}`,
              },
              { status: response.status },
            );
          }

          return new Response(response.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            },
          });
        } catch (error) {
          console.error("流式分析API错误:", error);
          return Response.json(
            {
              error: error instanceof Error ? error.message : "服务器内部错误",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
