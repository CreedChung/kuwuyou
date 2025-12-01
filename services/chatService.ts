/**
 * AI 聊天服务
 * 使用 Vercel AI SDK，支持多种 AI 提供商
 */

import { type LanguageModel, generateText, streamText } from "ai";
import type { UserModelMessage, AssistantModelMessage, SystemModelMessage } from "ai";
import { createZhipu } from "zhipu-ai-provider";
import type { KnowledgeReference } from "../components/chat/types";

export interface ChatServiceMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface ChatServiceOptions {
	model?: string;
	temperature?: number;
	maxTokens?: number;
	topP?: number;
}

interface ChatCompletionChunk {
	id: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		delta: {
			role?: string;
			content?: string;
			reasoning_content?: string;
		};
		finish_reason?: "stop" | "length" | "tool_calls" | "sensitive" | "network_error";
	}>;
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

class ChatService {
	private apiKey: string;
	private baseURL: string;
	private model: string;
	private providerInstance: ReturnType<typeof createZhipu> | null = null;
	private abortController: AbortController | null = null;

	constructor(apiKey?: string, model?: string) {
		this.apiKey = apiKey || "server-side-key";
		this.baseURL =
			process.env.AI_BASE_URL ||
			"https://open.bigmodel.cn/api/paas/v4";
		this.model = model || "glm-4.5-air";
		this.initializeProvider();
	}

	/**
	 * 初始化 AI Provider
	 */
	private initializeProvider() {
		if (this.apiKey) {
			this.providerInstance = createZhipu({
				baseURL: this.baseURL,
				apiKey: this.apiKey,
			});
		}
	}

	/**
	 * 设置 API Key
	 */
	setApiKey(apiKey: string) {
		this.apiKey = apiKey;
		this.initializeProvider();
	}

	/**
	 * 获取当前 API Key
	 */
	getApiKey(): string {
		return this.apiKey;
	}

	/**
	 * 检查 API Key 是否已设置
	 */
	hasApiKey(): boolean {
		return !!this.apiKey;
	}

	/**
	 * 将消息转换为 AI SDK 格式
	 */
	private convertMessages(messages: ChatServiceMessage[]): Array<UserModelMessage | AssistantModelMessage | SystemModelMessage> {
		return messages.map((msg) => ({
			role: msg.role,
			content: msg.content,
		})) as Array<UserModelMessage | AssistantModelMessage | SystemModelMessage>;
	}

	/**
	 * 发送聊天请求（非流式）
	 */
	async chat(
		messages: ChatServiceMessage[],
		options: ChatServiceOptions = {},
	): Promise<string> {
		if (!this.providerInstance) {
			throw new Error("服务初始化失败");
		}

		const coreMessages = this.convertMessages(messages);
		const model = this.providerInstance(options.model || "glm-4.5-air") as unknown as LanguageModel;

		const { text } = await generateText({
			model,
			messages: coreMessages,
			temperature: options.temperature,
			maxOutputTokens: options.maxTokens ?? 50000,
			topP: options.topP,
		});

		return text;
	}

	/**
	 * 发送聊天请求（流式响应）
	 */
	async *chatStream(
		messages: ChatServiceMessage[],
		options: ChatServiceOptions = {},
	): AsyncGenerator<string, void, unknown> {
		if (!this.providerInstance) {
			throw new Error("服务初始化失败");
		}

		// 创建新的 AbortController
		this.abortController = new AbortController();

		try {
			const coreMessages = this.convertMessages(messages);
			const model = this.providerInstance(options.model || "glm-4.5-air") as unknown as LanguageModel;

			const result = await streamText({
				model,
				messages: coreMessages,
				temperature: options.temperature,
				maxOutputTokens: options.maxTokens ?? 50000,
				topP: options.topP,
				abortSignal: this.abortController.signal,
			});

			// 使用 textStream 来获取流式文本
			for await (const chunk of result.textStream) {
				yield chunk;
			}
		} finally {
			this.abortController = null;
		}
	}

	/**
	 * 停止当前的流式请求
	 */
	stopStream() {
		if (this.abortController) {
			this.abortController.abort();
			this.abortController = null;
		}
	}

	/**
	 * 获取可用模型列表
	 */
	getAvailableModels(): string[] {
		return [
			"glm-4.5-air",
		];
	}

	/**
	 * 调用对话补全 API（流式）
	 */
	async *chatCompletionStream(
		messages: ChatMessage[],
		options: {
			useKnowledge?: boolean;
			useWebSearch?: boolean;
			useThinking?: boolean;
			temperature?: number;
			maxTokens?: number;
			systemPrompt?: string;
		} = {}
	): AsyncGenerator<{
		content?: string;
		thinking?: string;
		references?: KnowledgeReference[];
		finishReason?: string;
		usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
	}> {
		console.log("🚀 AI 对话请求开始");
		console.log("📝 用户消息:", messages.filter(m => m.role === "user").map(m => m.content));
		console.log("⚙️ 配置:", {
			useKnowledge: options.useKnowledge,
			useWebSearch: options.useWebSearch,
			useThinking: options.useThinking,
		});

		let finalMessages = messages;
		if (options.systemPrompt) {
			const hasSystemMessage = messages.some(m => m.role === "system");
			if (!hasSystemMessage) {
				finalMessages = [
					{ role: "system", content: options.systemPrompt },
					...messages
				];
				console.log("📋 使用系统提示词");
			}
		}

		const requestBody: Record<string, unknown> = {
			model: this.model || "glm-4.5-air",
			messages: finalMessages,
			stream: true,
			temperature: options.temperature ?? 0.95,
			max_tokens: options.maxTokens ?? 8192,
		};

		if (options.useThinking) {
			requestBody.thinking = { type: "enabled" };
		}

		this.abortController = new AbortController();

		console.log("🔧 请求体:", JSON.stringify(requestBody, null, 2));

		try {
			const response = await fetch("/api/chat/completions", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${this.apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
				signal: this.abortController.signal,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || `请求失败 (${response.status})`);
			}

			const reader = response.body?.getReader();
			if (!reader) {
				throw new Error("无法读取响应流");
			}

			const decoder = new TextDecoder();
			let buffer = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";

				for (const line of lines) {
					if (!line.trim() || !line.startsWith("data:")) continue;

					const data = line.slice(5).trim();
					if (data === "[DONE]") {
						return;
					}

					try {
						const parsed: ChatCompletionChunk = JSON.parse(data);
						
						for (const choice of parsed.choices) {
							// 处理完成原因
							if (choice.finish_reason) {
								yield { finishReason: choice.finish_reason };
							}

							// 处理增量内容
							if (choice.delta) {
								// 思维链内容
								if (choice.delta.reasoning_content) {
									yield { thinking: choice.delta.reasoning_content };
								}

								// 普通文本内容
								if (choice.delta.content) {
									yield { content: choice.delta.content };
								}
							}
						}

						// 处理 token 使用统计
						if (parsed.usage) {
							yield { usage: parsed.usage };
						}
					} catch (e) {
						console.error("❌ 解析SSE数据失败:", e, "原始数据:", data);
					}
				}
			}
		} finally {
			this.abortController = null;
		}
	}

	/**
	 * 获取请求头
	 */
	private getHeaders(): HeadersInit {
		return {
			Authorization: `Bearer ${this.apiKey}`,
			"Content-Type": "application/json",
		};
	}
}

// 导出单例
export const chatService = new ChatService();

// 导出类以便测试
export { ChatService };
