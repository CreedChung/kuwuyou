/**
 * Zhipu AI 服务
 * 使用 Vercel AI SDK 和 zhipu-ai-provider
 */

import { type LanguageModel, generateText, streamText } from "ai";
import type { CoreUserMessage, CoreAssistantMessage, CoreSystemMessage } from "ai";
import { createZhipu } from "zhipu-ai-provider";

export interface ZhipuMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface ZhipuChatOptions {
	model?: string;
	temperature?: number;
	maxTokens?: number;
	topP?: number;
}

class ZhipuService {
	private apiKey: string;
	private baseURL: string;
	private zhipuInstance: ReturnType<typeof createZhipu> | null = null;
	private abortController: AbortController | null = null;

	constructor(apiKey?: string) {
		this.apiKey = apiKey || process.env.NEXT_PUBLIC_ZHIPU_API_KEY || "";
		this.baseURL =
			process.env.NEXT_PUBLIC_ZHIPU_API_BASE_URL ||
			"https://open.bigmodel.cn/api/paas/v4";
		this.initializeProvider();
	}

	/**
	 * 初始化 Zhipu Provider
	 */
	private initializeProvider() {
		if (this.apiKey) {
			this.zhipuInstance = createZhipu({
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
	private convertMessages(messages: ZhipuMessage[]): Array<CoreUserMessage | CoreAssistantMessage | CoreSystemMessage> {
		return messages.map((msg) => ({
			role: msg.role,
			content: msg.content,
		})) as Array<CoreUserMessage | CoreAssistantMessage | CoreSystemMessage>;
	}

	/**
	 * 发送聊天请求（非流式）
	 */
	async chat(
		messages: ZhipuMessage[],
		options: ZhipuChatOptions = {},
	): Promise<string> {
		if (!this.apiKey || !this.zhipuInstance) {
			throw new Error("Zhipu API Key 未设置");
		}

		const coreMessages = this.convertMessages(messages);
		const model = this.zhipuInstance(options.model || "glm-4-plus") as unknown as LanguageModel;

		const { text } = await generateText({
			model,
			messages: coreMessages,
			temperature: options.temperature,
			...(options.maxTokens && { maxOutputTokens: options.maxTokens }),
			topP: options.topP,
		});

		return text;
	}

	/**
	 * 发送聊天请求（流式响应）
	 */
	async *chatStream(
		messages: ZhipuMessage[],
		options: ZhipuChatOptions = {},
	): AsyncGenerator<string, void, unknown> {
		if (!this.apiKey || !this.zhipuInstance) {
			throw new Error("Zhipu API Key 未设置");
		}

		// 创建新的 AbortController
		this.abortController = new AbortController();

		try {
			const coreMessages = this.convertMessages(messages);
			const model = this.zhipuInstance(options.model || "glm-4-plus") as unknown as LanguageModel;

			const result = await streamText({
				model,
				messages: coreMessages,
				temperature: options.temperature,
				...(options.maxTokens && { maxOutputTokens: options.maxTokens }),
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
			"glm-4-plus",
			"glm-4-0520",
			"glm-4",
			"glm-4-air",
			"glm-4-airx",
			"glm-4-flash",
			"glm-4-flashx",
			"glm-4v",
			"glm-4v-plus",
		];
	}
}

// 导出单例
export const zhipuService = new ZhipuService();

// 导出类以便测试
export { ZhipuService };
