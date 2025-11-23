import { AlertCircle, Bot, Loader2, User } from "lucide-react";
import type { Message as MessageType } from "./types";

interface MessageProps {
	message: MessageType;
}

export function Message({ message }: MessageProps) {
	const isUser = message.role === "user";
	const hasError = !!message.error;
	const isStreaming = message.isStreaming;

	return (
		<div
			className={`flex gap-4 px-6 py-8 ${
				isUser ? "bg-background" : "bg-muted/20"
			}`}
		>
			<div className="flex-shrink-0">
				<div
					className={`h-9 w-9 rounded-lg flex items-center justify-center ${
						isUser
							? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
							: hasError
								? "bg-gradient-to-br from-red-500 to-orange-500 text-white"
								: "bg-gradient-to-br from-green-500 to-teal-500 text-white"
					}`}
				>
					{isUser ? (
						<User className="h-5 w-5" />
					) : hasError ? (
						<AlertCircle className="h-5 w-5" />
					) : (
						<Bot className="h-5 w-5" />
					)}
				</div>
			</div>
			<div className="flex-1 space-y-2 min-w-0">
				<div className="flex items-center gap-2">
					<div className="font-semibold text-sm text-foreground">
						{isUser ? "你" : "库无忧助手"}
					</div>
					{isStreaming && !isUser && (
						<div className="flex items-center gap-1 text-xs text-muted-foreground">
							<Loader2 className="h-3 w-3 animate-spin" />
							<span>正在无忧思考...</span>
						</div>
					)}
				</div>

				{hasError ? (
					<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
						<div className="flex items-start gap-2">
							<AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
							<div className="flex-1 text-sm text-destructive">
								<div className="font-medium mb-1">发生错误</div>
								<div className="text-xs opacity-90">{message.error}</div>
							</div>
						</div>
					</div>
				) : (
					<div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap break-words">
						{message.content}
						{isStreaming && message.content && (
							<span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
						)}
					</div>
				)}
			</div>
		</div>
	);
}
