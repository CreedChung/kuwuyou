import { useCallback, useRef } from "react";
import type { Message } from "@/components/chat/types";
import { type ZhipuMessage, zhipuService } from "@/services/zhipu";

interface UseZhipuOptions {
	onStreamStart?: (messageId: string) => void;
	onStreamChunk?: (messageId: string, content: string) => void;
	onStreamEnd?: (messageId: string) => void;
	onError?: (error: Error) => void;
}

export function useZhipu(options: UseZhipuOptions = {}) {
	const isGeneratingRef = useRef(false);

	/**
	 * 将聊天消息转换为 Zhipu API 格式
	 */
	const convertMessages = useCallback((messages: Message[]): ZhipuMessage[] => {
		return messages.map((msg) => ({
			role: msg.role === "user" ? "user" : "assistant",
			content: msg.content,
		}));
	}, []);

	/**
	 * 发送消息并处理流式响应
	 */
	const sendMessage = useCallback(
		async (
			messages: Message[],
			messageId: string,
			onUpdate: (content: string) => void,
		): Promise<void> => {
			if (isGeneratingRef.current) {
				throw new Error("已有正在进行的请求");
			}

			if (!zhipuService.hasApiKey()) {
				throw new Error("请先在设置中配置 Zhipu API Key");
			}

			isGeneratingRef.current = true;
			options.onStreamStart?.(messageId);

			try {
				const zhipuMessages = convertMessages(messages);
				let fullContent = "";

				// 使用流式 API
				const stream = zhipuService.chatStream(zhipuMessages);

				for await (const chunk of stream) {
					fullContent += chunk;
					onUpdate(fullContent);
					options.onStreamChunk?.(messageId, fullContent);
				}

				options.onStreamEnd?.(messageId);
			} catch (error) {
				const err = error as Error;

				// 如果是用户主动停止,不报错
				if (err.name === "AbortError") {
					console.log("用户停止了生成");
				} else {
					console.error("Zhipu API 错误:", err);
					options.onError?.(err);
					throw err;
				}
			} finally {
				isGeneratingRef.current = false;
			}
		},
		[convertMessages, options],
	);

	/**
	 * 停止当前的生成
	 */
	const stopGeneration = useCallback(() => {
		zhipuService.stopStream();
		isGeneratingRef.current = false;
	}, []);

	/**
	 * 检查是否正在生成
	 */
	const isGenerating = useCallback(() => {
		return isGeneratingRef.current;
	}, []);

	return {
		sendMessage,
		stopGeneration,
		isGenerating,
	};
}
