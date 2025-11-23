"use client";

import { Clock, MessageSquare } from "lucide-react";
import * as React from "react";
import type { Conversation } from "@/components/chat/types";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

interface SearchConversationsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	conversations: Conversation[];
	onSelectConversation: (id: string) => void;
}

export function SearchConversationsDialog({
	open,
	onOpenChange,
	conversations,
	onSelectConversation,
}: SearchConversationsDialogProps) {
	const [searchQuery, setSearchQuery] = React.useState("");

	// 过滤对话
	const filteredConversations = React.useMemo(() => {
		if (!searchQuery.trim()) {
			return conversations;
		}

		const query = searchQuery.toLowerCase();
		return conversations.filter(
			(conv) =>
				conv.title.toLowerCase().includes(query) ||
				conv.messages.some((msg) => msg.content.toLowerCase().includes(query)),
		);
	}, [conversations, searchQuery]);

	// 格式化时间
	const formatTime = (timestamp: number) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInMs = now.getTime() - date.getTime();
		const diffInHours = diffInMs / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return date.toLocaleTimeString("zh-CN", {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (diffInHours < 48) {
			return "昨天";
		} else if (diffInHours < 168) {
			return `${Math.floor(diffInHours / 24)}天前`;
		} else {
			return date.toLocaleDateString("zh-CN", {
				month: "short",
				day: "numeric",
			});
		}
	};

	const handleSelect = (conversationId: string) => {
		onSelectConversation(conversationId);
		onOpenChange(false);
		setSearchQuery("");
	};

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput
				placeholder="搜索对话..."
				value={searchQuery}
				onValueChange={setSearchQuery}
			/>
			<CommandList>
				<CommandEmpty>未找到相关对话</CommandEmpty>
				<CommandGroup heading="对话历史">
					{filteredConversations.map((conversation) => (
						<CommandItem
							key={conversation.id}
							value={conversation.id}
							onSelect={() => handleSelect(conversation.id)}
							className="flex items-center justify-between"
						>
							<div className="flex items-center gap-3 flex-1 min-w-0">
								<MessageSquare
									size={16}
									strokeWidth={2}
									className="opacity-60 shrink-0"
									aria-hidden="true"
								/>
								<div className="flex flex-col min-w-0 flex-1">
									<span className="truncate">{conversation.title}</span>
									{conversation.messages.length > 0 && (
										<span className="text-xs text-muted-foreground truncate">
											{conversation.messages[
												conversation.messages.length - 1
											].content.substring(0, 50)}
											{conversation.messages[conversation.messages.length - 1]
												.content.length > 50
												? "..."
												: ""}
										</span>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 ml-2">
								<Clock size={12} strokeWidth={2} aria-hidden="true" />
								<span>{formatTime(conversation.timestamp)}</span>
							</div>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
