import { AlertCircle, BookOpen, CheckCheck, ChevronDown, ChevronUp, Copy, Lightbulb, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Streamdown } from "streamdown";
import type { Message as MessageType } from "./types";
import { Button } from "@/components/ui/button";

interface MessageProps {
	message: MessageType;
}

export function Message({ message }: MessageProps) {
	const isUser = message.role === "user";
	const hasError = !!message.error;
	const isStreaming = message.isStreaming;
	const [showThinking, setShowThinking] = useState(true);
	const [showReferences, setShowReferences] = useState(true);
	const [copiedSection, setCopiedSection] = useState<string | null>(null);

	// 复制文本到剪贴板
	const copyToClipboard = async (text: string, section: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedSection(section);
			setTimeout(() => setCopiedSection(null), 2000);
		} catch (err) {
			console.error("复制失败:", err);
		}
	};

	return (
		<div
			className={`flex gap-4 px-6 py-8 ${
				isUser ? "bg-background" : "bg-muted/20"
			}`}
		>
			<div className="flex-shrink-0">
				<div
					className={`h-9 w-9 rounded-lg flex items-center justify-center overflow-hidden ${
						isUser
							? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
							: hasError
								? "bg-gradient-to-br from-red-500 to-orange-500 text-white"
								: "bg-white"
					}`}
				>
					{isUser ? (
						<User className="h-5 w-5" />
					) : hasError ? (
						<AlertCircle className="h-5 w-5" />
					) : (
						<Image
							src="/logo.jpg"
							alt="库无忧助手"
							width={36}
							height={36}
							className="object-cover"
						/>
					)}
				</div>
			</div>
			<div className="flex-1 space-y-3 min-w-0">
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
					<>
						{/* 知识库引用 */}
						{!isUser && message.references && message.references.length > 0 && (
							<div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 overflow-hidden">
								<div className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-blue-900 dark:text-blue-100">
									<button
										onClick={() => setShowReferences(!showReferences)}
										className="flex items-center gap-2 hover:opacity-80 transition-opacity"
									>
										<BookOpen className="h-4 w-4" />
										<span>查找到 {message.references.length} 个知识片段</span>
									</button>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="h-6 px-2"
											onClick={(e) => {
												e.stopPropagation();
												const refText = message.references!
													.map((ref, i) => `[${i + 1}] ${ref.source ? `文件：${ref.source}\n` : ""}${ref.content}`)
													.join("\n\n");
												copyToClipboard(refText, "references");
											}}
										>
											{copiedSection === "references" ? (
												<CheckCheck className="h-3 w-3" />
											) : (
												<Copy className="h-3 w-3" />
											)}
										</Button>
										<button
											onClick={() => setShowReferences(!showReferences)}
											className="hover:opacity-80 transition-opacity"
										>
											{showReferences ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>
								{showReferences && (
									<div className="px-4 pb-3 space-y-2">
										{/* 显示查找的文件列表 */}
										{(() => {
											const uniqueSources = Array.from(
												new Set(message.references.map(ref => ref.source).filter(Boolean))
											);
											return uniqueSources.length > 0 && (
												<div className="mb-3 p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
													<div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
														📁 查找的文件：
													</div>
													<div className="flex flex-wrap gap-1">
														{uniqueSources.map((source, idx) => (
															<span
																key={idx}
																className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
															>
																{source}
															</span>
														))}
													</div>
												</div>
											);
										})()}
										
										{/* 知识片段列表 */}
										{message.references.map((ref, index) => (
											<div
												key={index}
												className="text-sm text-blue-800 dark:text-blue-200 p-3 rounded bg-white/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
											>
												<div className="flex items-start justify-between gap-2 mb-2">
													<div className="flex items-center gap-2">
														<span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
															{index + 1}
														</span>
														<div className="font-medium text-xs text-blue-600 dark:text-blue-400">
															{ref.source || "知识库"}
														</div>
													</div>
													<Button
														variant="ghost"
														size="sm"
														className="h-5 px-1.5 -mt-1"
														onClick={() => copyToClipboard(ref.content, `ref-${index}`)}
													>
														{copiedSection === `ref-${index}` ? (
															<CheckCheck className="h-3 w-3" />
														) : (
															<Copy className="h-3 w-3" />
														)}
													</Button>
												</div>
												<div className="text-xs prose prose-xs max-w-none dark:prose-invert break-words leading-relaxed">
													<Streamdown>{ref.content}</Streamdown>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						{/* 思考过程 */}
						{!isUser && message.thinking && (
							<div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 overflow-hidden">
								<div className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-amber-900 dark:text-amber-100">
									<button
										onClick={() => setShowThinking(!showThinking)}
										className="flex items-center gap-2 hover:opacity-80 transition-opacity"
									>
										<Lightbulb className="h-4 w-4" />
										<span>思考过程</span>
									</button>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="h-6 px-2"
											onClick={(e) => {
												e.stopPropagation();
												copyToClipboard(message.thinking!, "thinking");
											}}
										>
											{copiedSection === "thinking" ? (
												<CheckCheck className="h-3 w-3" />
											) : (
												<Copy className="h-3 w-3" />
											)}
										</Button>
										<button
											onClick={() => setShowThinking(!showThinking)}
											className="hover:opacity-80 transition-opacity"
										>
											{showThinking ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>
								{showThinking && (
									<div className="px-4 pb-3 text-sm text-amber-800 dark:text-amber-200 prose prose-sm max-w-none dark:prose-invert">
										<Streamdown>{message.thinking}</Streamdown>
									</div>
								)}
							</div>
						)}

						{/* 主要回答内容 */}
						<div className="prose prose-sm max-w-none dark:prose-invert">
							<Streamdown>{message.content}</Streamdown>
							{isStreaming && message.content && (
								<span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
							)}
						</div>

						{/* Token使用统计 */}
						{!isUser && message.usage && message.usage.length > 0 && (
							<div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
								<details className="cursor-pointer">
									<summary className="hover:text-foreground transition-colors">
										Token 使用统计
									</summary>
									<div className="mt-2 space-y-1 pl-4">
										{message.usage.map((usage, index) => (
											<div key={index} className="flex items-center gap-2">
												<span className="font-medium">{usage.nodeName || usage.model}:</span>
												<span>输入 {usage.inputTokenCount}</span>
												<span>·</span>
												<span>输出 {usage.outputTokenCount}</span>
												<span>·</span>
												<span>总计 {usage.totalTokenCount}</span>
											</div>
										))}
									</div>
								</details>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}