"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { Header } from "@/components/chat/Header";
import { Sidebar } from "@/components/chat/Sidebar";
import type { Conversation, Message } from "@/components/chat/types";

export default function ChatPage() {
	const [conversations, setConversations] = useState<Conversation[]>([
		{
			id: "1",
			title: "新对话",
			messages: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	]);
	const [currentConversationId, setCurrentConversationId] = useState<string | null>("1");
	const [isGenerating, setIsGenerating] = useState(false);
	const [aiProvider, setAiProvider] = useState<"zhipu">("zhipu");

	const currentAssistantMessageIdRef = useRef<string | null>(null);

	const currentConversation = conversations.find(
		(c) => c.id === currentConversationId,
	);

	// 加载 AI 提供商设置
	useEffect(() => {
		const savedProvider = localStorage.getItem("ai_provider") as "zhipu" | null;
		if (savedProvider === "zhipu") {
			setAiProvider(savedProvider);
		}
	}, []);

	const handleNewConversation = () => {
		const newConversation: Conversation = {
			id: Date.now().toString(),
			title: "新对话",
			messages: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setConversations([newConversation, ...conversations]);
		setCurrentConversationId(newConversation.id);
	};

	const handleDeleteConversation = (id: string) => {
		const newConversations = conversations.filter((c) => c.id !== id);
		setConversations(newConversations);
		if (currentConversationId === id) {
			setCurrentConversationId(newConversations[0]?.id || null);
		}
	};

	const handleSendMessage = useCallback(
		async (content: string) => {
			if (!currentConversationId || isGenerating) return;

			const userMessage: Message = {
				id: Date.now().toString(),
				role: "user",
				content,
				timestamp: new Date(),
			};

			const assistantMessageId = (Date.now() + 1).toString();
			currentAssistantMessageIdRef.current = assistantMessageId;

			const assistantMessage: Message = {
				id: assistantMessageId,
				role: "assistant",
				content: "",
				timestamp: new Date(),
				isStreaming: true,
			};

			// 更新对话,添加用户消息和空的助手消息
			setConversations((prev) =>
				prev.map((conv) => {
					if (conv.id === currentConversationId) {
						const updatedMessages = [
							...conv.messages,
							userMessage,
							assistantMessage,
						];
						const title =
							conv.messages.length === 0
								? content.slice(0, 30) + (content.length > 30 ? "..." : "")
								: conv.title;
						return {
							...conv,
							messages: updatedMessages,
							title,
							updatedAt: new Date(),
						};
					}
					return conv;
				}),
			);

			setIsGenerating(true);

			// TODO: 实现 AI 调用逻辑
			console.log("发送消息:", content);
		},
		[currentConversationId, isGenerating, conversations],
	);

	const handleStopGenerating = useCallback(() => {
		setIsGenerating(false);

		if (currentAssistantMessageIdRef.current) {
			setConversations((prev) =>
				prev.map((conv) => {
					if (conv.id === currentConversationId) {
						return {
							...conv,
							messages: conv.messages.map((msg) =>
								msg.id === currentAssistantMessageIdRef.current
									? { ...msg, isStreaming: false }
									: msg,
							),
						};
					}
					return conv;
				}),
			);
			currentAssistantMessageIdRef.current = null;
		}
	}, [currentConversationId]);

	const handleOpenKnowledgeBase = useCallback(() => {
		window.location.href = "/knowledge";
	}, []);

	return (
		<SidebarProvider defaultOpen={true}>
			<Sidebar
				conversations={conversations}
				currentConversationId={currentConversationId}
				onSelectConversation={setCurrentConversationId}
				onNewConversation={handleNewConversation}
				onDeleteConversation={handleDeleteConversation}
				onOpenKnowledgeBase={handleOpenKnowledgeBase}
			/>
			<SidebarInset className="flex flex-col h-screen overflow-hidden">
				<Header />
				<div className="flex-1 overflow-hidden">
					<ChatArea
						messages={currentConversation?.messages || []}
						onSendMessage={handleSendMessage}
						isGenerating={isGenerating}
						onStopGenerating={handleStopGenerating}
					/>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}