import { createFileRoute } from "@tanstack/react-router";
import { analysisSummaryPrompt } from "../../../../utils/prompt";

export const Route = createFileRoute("/api/analysis/summary")({
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
          // 分析模式的 summary 使用专用模型配置
          const model =
            process.env.ANALYSIS_SUMMARY_MODEL ||
            "Qwen/Qwen3-30B-A3B-Instruct-2507";

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
                { role: "system", content: analysisSummaryPrompt },
                { role: "user", content },
              ],
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

          const data = await response.json();
          const assistantMessage = data.choices?.[0]?.message?.content;

          if (!assistantMessage) {
            return Response.json({ error: "未收到有效响应" }, { status: 500 });
          }

          // 尝试提取 JSON 数组
          let analysisResults;
          try {
            // 先尝试直接解析
            analysisResults = JSON.parse(assistantMessage);
          } catch {
            // 尝试从文本中提取 JSON 数组
            const jsonMatch = assistantMessage.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              analysisResults = JSON.parse(jsonMatch[0]);
            } else {
              console.error(
                "无法解析JSON:",
                assistantMessage.substring(0, 500),
              );
              return Response.json(
                { error: "响应格式解析失败" },
                { status: 500 },
              );
            }
          }

          if (!Array.isArray(analysisResults)) {
            // 如果是对象且包含数组字段，尝试提取
            if (analysisResults && typeof analysisResults === "object") {
              const arrayField = Object.values(analysisResults).find((v) =>
                Array.isArray(v),
              );
              if (arrayField) {
                analysisResults = arrayField;
              } else {
                return Response.json(
                  { error: "响应格式不正确，应为数组" },
                  { status: 500 },
                );
              }
            }
          }

          return Response.json({
            success: true,
            results: analysisResults,
            usage: data.usage,
          });
        } catch (error) {
          console.error("总结API错误:", error);
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
