"use client";

import { useCallback, useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { Header } from "@/components/chat/Header";
import { Sidebar } from "@/components/chat/Sidebar";
import { useChat } from "@/hooks/useChat";
import { useRetrieval } from "@/hooks/useRetrieval";
import type { Conversation } from "@/components/chat/types";
import { sliceText, joinSlices } from "@/utils/textSlicer";
import { ChatTutorial } from "@/components/chat/ChatTutorial";

export function ChatPageContent() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

	const {
		messages,
		isGenerating,
		sendMessage: sendChatMessage,
		stopGenerating,
		startNewConversation,
	} = useChat();
	
	const { performRetrieval } = useRetrieval();

	useEffect(() => {
		if (conversations.length === 0) {
			const initialConversation: Conversation = {
				id: Date.now().toString(),
				title: "新对话",
				messages: [],
				timestamp: Date.now(),
			};
			setConversations([initialConversation]);
			setCurrentConversationId(initialConversation.id);
		}
	}, [conversations.length]);

	useEffect(() => {
		if (currentConversationId && messages.length > 0) {
			setConversations((prev) =>
				prev.map((conv) => {
					if (conv.id === currentConversationId) {
						const title =
							conv.messages.length === 0 && messages.length > 0
								? messages[0].content.slice(0, 30) +
								  (messages[0].content.length > 30 ? "..." : "")
								: conv.title;

						return {
							...conv,
							messages: messages,
							title,
							timestamp: Date.now(),
							lastMessage: messages[messages.length - 1]?.content,
						};
					}
					return conv;
				})
			);
		}
	}, [messages, currentConversationId]);

	const currentConversation = conversations.find(
		(c) => c.id === currentConversationId
	);

	const handleNewConversation = useCallback(() => {
		const newConversation: Conversation = {
			id: Date.now().toString(),
			title: "新对话",
			messages: [],
			timestamp: Date.now(),
		};
		setConversations((prev) => [newConversation, ...prev]);
		setCurrentConversationId(newConversation.id);
		startNewConversation();
	}, [startNewConversation]);

	const handleDeleteConversation = useCallback(
		(id: string) => {
			const newConversations = conversations.filter((c) => c.id !== id);
			setConversations(newConversations);
			if (currentConversationId === id) {
				const nextConv = newConversations[0];
				setCurrentConversationId(nextConv?.id || null);
				if (nextConv) {
					startNewConversation();
				}
			}
		},
		[conversations, currentConversationId, startNewConversation]
	);

	const handleSelectConversation = useCallback(
		(id: string) => {
			setCurrentConversationId(id);
			startNewConversation();
		},
		[startNewConversation]
	);

	const handleSendMessage = useCallback(
		async (content: string, options?: { showThinking?: boolean; showReferences?: boolean; useWebSearch?: boolean; knowledgeId?: string; uploadedFile?: File; fileContent?: string }) => {
			if (!currentConversationId || isGenerating) return;

			try {
				const needsRetrieval = options?.showReferences || options?.useWebSearch;
				
				if (needsRetrieval) {
					const retrievalOptions = {
						showReferences: options.showReferences,
						useWebSearch: options.useWebSearch,
						knowledgeId: options.knowledgeId,
					};

					const isAnalysisMode = !!options?.fileContent;
					let queryForRetrieval: string;
					
					if (isAnalysisMode && options.fileContent) {
						const fileContent = options.fileContent;
						
						if (fileContent.length > 1000) {
							const slices = sliceText(fileContent, {
								sliceLength: 100,
								maxSlices: 10,
								random: true,
							});
							queryForRetrieval = joinSlices(slices);
						} else {
							queryForRetrieval = fileContent;
						}
					} else {
						queryForRetrieval = content;
					}

					const retrievalResult = await performRetrieval(queryForRetrieval, retrievalOptions);
					
					const retrievalContext = {
						knowledgeContext: retrievalResult.knowledgeContext,
						webContext: retrievalResult.webContext,
						references: retrievalResult.references,
					};
					
					await sendChatMessage(content, options, retrievalContext);
				} else {
					await sendChatMessage(content, options, undefined);
				}
				
			} catch (error) {
				console.error("❌ 发送消息失败:", error);
				throw error;
			}
		},
		[currentConversationId, isGenerating, sendChatMessage, performRetrieval]
	);

	const handleStopGenerating = useCallback(() => {
		stopGenerating();
	}, [stopGenerating]);

	const handleRegenerateMessage = useCallback(
		(messageId: string) => {
			if (isGenerating) return;

			const messageIndex = messages.findIndex((m) => m.id === messageId);
			if (messageIndex === -1 || messages[messageIndex].role !== "assistant") return;

			const userMessageIndex = messageIndex - 1;
			if (userMessageIndex < 0 || messages[userMessageIndex].role !== "user") return;

			const userMessage = messages[userMessageIndex];

			const newMessages = messages.slice(0, userMessageIndex);
			setConversations((prev) =>
				prev.map((conv) => {
					if (conv.id === currentConversationId) {
						return {
							...conv,
							messages: newMessages,
							timestamp: Date.now(),
						};
					}
					return conv;
				})
			);

			setTimeout(() => {
				handleSendMessage(userMessage.content, {
					showThinking: true,
					showReferences: true,
					useWebSearch: true,
				});
			}, 100);
		},
		[messages, isGenerating, currentConversationId, handleSendMessage]
	);

	const handleOpenKnowledgeBase = useCallback(() => {
		window.location.href = "/knowledge";
	}, []);

	return (
		<SidebarProvider defaultOpen={true}>
			<ChatTutorial />
			<Sidebar
				conversations={conversations}
				currentConversationId={currentConversationId}
				onSelectConversation={handleSelectConversation}
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
						onRegenerateMessage={handleRegenerateMessage}
					/>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
