import { useCallback, useEffect, useRef } from "react";
import { InputArea } from "./InputArea";
import { Message } from "./Message";
import type { Message as MessageType } from "./types";

interface ChatAreaProps {
	messages: MessageType[];
	onSendMessage: (content: string, options?: {
		showThinking?: boolean;
		showReferences?: boolean;
		useWebSearch?: boolean;
		uploadedFile?: File;
		fileContent?: string;
	}) => void;
	isGenerating?: boolean;
	onStopGenerating?: () => void;
}

export function ChatArea({
	messages,
	onSendMessage,
	isGenerating = false,
	onStopGenerating,
}: ChatAreaProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	return (
		<div className="flex flex-col h-full bg-background">
			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto min-h-0">
				{messages.length === 0 ? (
					<div className="flex h-full items-center justify-center">
						<div className="text-center space-y-6 px-4 max-w-3xl">
							<div className="mx-auto w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
								<img
									src="/logo.jpg"
									alt="库无忧助手"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="space-y-2">
								<h1 className="text-4xl font-bold text-foreground">
									你好,我是库无忧助手
								</h1>
								<p className="text-muted-foreground text-lg">
									我是库无忧助手,可以帮你解决石油化工行业方面的问题
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mt-8">
								{[
									"储罐保温涂层的施工要求和标准",
									"储罐防腐材料的选用原则",
									"储罐维修检测的主要项目有哪些?",
									"储罐外壁防腐涂层的维护保养",
								].map((suggestion) => (
									<button
										key={suggestion}
										type="button"
										onClick={() => onSendMessage(suggestion, {
											showThinking: true,
											showReferences: true,
											useWebSearch: true,
										})}
										className="group rounded-xl border border-border bg-card px-5 py-4 text-left text-sm text-card-foreground transition-all hover:border-primary/50 hover:bg-accent hover:shadow-md"
									>
										<span className="group-hover:text-primary transition-colors">
											{suggestion}
										</span>
									</button>
								))}
							</div>
						</div>
					</div>
				) : (
					<div className="mx-auto max-w-4xl py-4">
						{messages.map((message) => (
							<Message key={message.id} message={message} />
						))}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Input Area */}
			<InputArea
				onSendMessage={onSendMessage}
				isGenerating={isGenerating}
				onStopGenerating={onStopGenerating}
			/>
		</div>
	);
}
