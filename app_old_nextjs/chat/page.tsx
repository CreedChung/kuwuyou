"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { Header } from "@/components/chat/Header";
import { Sidebar } from "@/components/chat/Sidebar";
import { useChat } from "@/hooks/useChat";
import { useRetrieval } from "@/hooks/useRetrieval";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import type { Conversation } from "@/components/chat/types";

import { sliceText, joinSlices } from "@/utils/textSlicer";
import { ChatTutorial } from "@/components/chat/ChatTutorial";



export default function ChatPage() {
	return (
		<ProtectedRoute>
			<ChatPageContent />
		</ProtectedRoute>
	);
}

function ChatPageContent() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

	// 使用聊天和检索Hook
	const {
		messages,
		isGenerating,
		sendMessage: sendChatMessage,
		stopGenerating,
		startNewConversation,
	} = useChat();
	
	const { performRetrieval } = useRetrieval();

	// 初始化第一个对话
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

	// 同步消息到当前对话
	useEffect(() => {
		if (currentConversationId && messages.length > 0) {
			setConversations((prev) =>
				prev.map((conv) => {
					if (conv.id === currentConversationId) {
						// 如果是第一次发送消息，更新标题
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
					// 如果切换到其他对话，需要重新开始会话
					startNewConversation();
				}
			}
		},
		[conversations, currentConversationId, startNewConversation]
	);

	const handleSelectConversation = useCallback(
		(id: string) => {
			setCurrentConversationId(id);
			// 切换对话时开始新会话
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
						console.log("📊 分析模式：文件内容长度", fileContent.length, "字符");
						
						if (fileContent.length > 1000) {
							const slices = sliceText(fileContent, {
								sliceLength: 100,
								maxSlices: 10,
								random: true,
							});
							queryForRetrieval = joinSlices(slices);
							console.log("✂️ 文件内容过长，已切片：", slices.length, "片，总长度", queryForRetrieval.length, "字符");
						} else {
							queryForRetrieval = fileContent;
							console.log("✅ 文件内容长度适中，无需切片");
						}
					} else {
						queryForRetrieval = content;
						console.log("💬 对话模式：使用用户提问作为检索关键词");
					}

					const retrievalResult = await performRetrieval(queryForRetrieval, retrievalOptions);
					
					const retrievalContext = {
						knowledgeContext: retrievalResult.knowledgeContext,
						webContext: retrievalResult.webContext,
						references: retrievalResult.references,
					};
					
					console.log("✅ 检索完成，引用数量:", retrievalResult.references.length);
					
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

			// 找到要重新生成的助手消息
			const messageIndex = messages.findIndex((m) => m.id === messageId);
			if (messageIndex === -1 || messages[messageIndex].role !== "assistant") return;

			// 找到之前的用户消息
			const userMessageIndex = messageIndex - 1;
			if (userMessageIndex < 0 || messages[userMessageIndex].role !== "user") return;

			const userMessage = messages[userMessageIndex];

			// 删除用户消息和助手消息
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

			// 重新发送用户消息
			// 检查用户消息是否有上传的文件信息
			const hasFile = !!userMessage.uploadedFileName;
			
			// 重新发送（使用默认选项：显示思考过程、引用和联网搜索）
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