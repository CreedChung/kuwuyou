import { AlertCircle, BookOpen, CheckCheck, ChevronDown, ChevronUp, Copy, FileText, Globe, Lightbulb, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Streamdown } from "streamdown";
import type { Message as MessageType } from "./types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AnalysisResult } from "./AnalysisResult";

interface MessageProps {
	message: MessageType;
	onRegenerate?: () => void;
}

export function Message({ message, onRegenerate }: MessageProps) {
	const { user } = useAuth();
	const isUser = message.role === "user";
	const hasError = !!message.error;
	const isStreaming = message.isStreaming;
	const [showThinking, setShowThinking] = useState(true);
	const [showKnowledge, setShowKnowledge] = useState(true);
	const [showWebSearch, setShowWebSearch] = useState(true);
	const [copiedSection, setCopiedSection] = useState<string | null>(null);

	// 用户头像
	const userName = user?.username || user?.email || '用户';
	const userAvatar = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;

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

	// 分离知识库引用和网络搜索结果
	const knowledgeRefs = message.references?.filter(ref => ref.type === "knowledge") || [];
	const webRefs = message.references?.filter(ref => ref.type === "web_search") || [];

	return (
		<div
			className={`flex gap-4 px-6 py-8 ${
				isUser ? "bg-background" : "bg-muted/20"
			}`}
		>
			<div className="flex-shrink-0">
				{isUser ? (
					<img
						src={userAvatar}
						alt={userName}
						className="h-9 w-9 rounded-lg object-cover"
					/>
				) : (
					<div
						className={`h-9 w-9 rounded-lg flex items-center justify-center overflow-hidden ${
							hasError
								? "bg-gradient-to-br from-red-500 to-orange-500 text-white"
								: "bg-white"
						}`}
					>
						{hasError ? (
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
				)}
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
						{/* 用户消息内容 */}
						{isUser && (
							<div className="space-y-2">
								{message.uploadedFileName && (
									<div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border">
										<FileText className="h-4 w-4" />
										<span>已上传: {message.uploadedFileName}</span>
									</div>
								)}
								<div className="group relative">
									<div className="prose prose-sm max-w-none dark:prose-invert">
										<Streamdown>{message.content}</Streamdown>
									</div>
									<Button
										variant="ghost"
										size="sm"
										className="absolute -top-2 -right-2 h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
										onClick={() => copyToClipboard(message.content, "user-message")}
									>
										{copiedSection === "user-message" ? (
											<CheckCheck className="h-3 w-3" />
										) : (
											<Copy className="h-3 w-3" />
										)}
									</Button>
								</div>
							</div>
						)}

						{/* 知识库引用 - 独立卡片 */}
						{!isUser && knowledgeRefs.length > 0 && (
							<div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 overflow-hidden">
								<div className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-blue-900 dark:text-blue-100">
									<button
										onClick={() => setShowKnowledge(!showKnowledge)}
										className="flex items-center gap-2 hover:opacity-80 transition-opacity"
									>
										<BookOpen className="h-4 w-4" />
										<span>查找到 {knowledgeRefs.length} 个知识片段</span>
									</button>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="h-6 px-2"
											onClick={(e) => {
												e.stopPropagation();
												const refText = knowledgeRefs
													.map((ref, i) => `[${i + 1}] ${ref.source ? `文件：${ref.source}\n` : ""}${ref.content}`)
													.join("\n\n");
												copyToClipboard(refText, "knowledge");
											}}
										>
											{copiedSection === "knowledge" ? (
												<CheckCheck className="h-3 w-3" />
											) : (
												<Copy className="h-3 w-3" />
											)}
										</Button>
										<button
											onClick={() => setShowKnowledge(!showKnowledge)}
											className="hover:opacity-80 transition-opacity"
										>
											{showKnowledge ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>
								{showKnowledge && (
									<div className="px-4 pb-3 space-y-3">
										{(() => {
											const uniqueSources = Array.from(
												new Set(knowledgeRefs.map(ref => ref.source).filter(Boolean))
											);
											return uniqueSources.length > 0 && (
												<div className="p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
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
										
										{knowledgeRefs.map((ref, index) => (
											<div
												key={index}
												className="text-sm p-3 rounded border bg-white/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200"
											>
												<div className="flex items-start justify-between gap-2 mb-2">
													<div className="flex items-center gap-2 flex-1 min-w-0">
														<span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
															{index + 1}
														</span>
														<div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
															<div className="font-medium text-xs text-blue-600 dark:text-blue-400 truncate">
																{ref.source || "知识库"}
															</div>
															{ref.score !== undefined && (
																<span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-mono bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
																	{(ref.score * 100).toFixed(1)}%
																</span>
															)}
														</div>
													</div>
													<Button
														variant="ghost"
														size="sm"
														className="h-5 px-1.5 -mt-1 flex-shrink-0"
														onClick={() => copyToClipboard(ref.content, `k-${index}`)}
													>
														{copiedSection === `k-${index}` ? (
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

						{/* 网络搜索结果 - 独立卡片 */}
						{!isUser && webRefs.length > 0 && (
							<div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 overflow-hidden">
								<div className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-green-900 dark:text-green-100">
									<button
										onClick={() => setShowWebSearch(!showWebSearch)}
										className="flex items-center gap-2 hover:opacity-80 transition-opacity"
									>
										<Globe className="h-4 w-4" />
										<span>{webRefs.length} 个网络结果</span>
									</button>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="h-6 px-2"
											onClick={(e) => {
												e.stopPropagation();
												const refText = webRefs
													.map((ref, i) => `[${i + 1}] ${ref.title || ""}\n${ref.source ? `来源：${ref.source}\n` : ""}${ref.content}${ref.link ? `\n链接：${ref.link}` : ""}`)
													.join("\n\n");
												copyToClipboard(refText, "websearch");
											}}
										>
											{copiedSection === "websearch" ? (
												<CheckCheck className="h-3 w-3" />
											) : (
												<Copy className="h-3 w-3" />
											)}
										</Button>
										<button
											onClick={() => setShowWebSearch(!showWebSearch)}
											className="hover:opacity-80 transition-opacity"
										>
											{showWebSearch ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>
								{showWebSearch && (
									<div className="px-4 pb-3 space-y-3">
										{webRefs.map((ref, index) => (
											<div
												key={index}
												className="text-sm p-3 rounded border bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
											>
												<div className="flex items-start justify-between gap-2 mb-2">
													<div className="flex items-center gap-2 flex-1 min-w-0">
														<span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 dark:bg-green-600 text-white text-xs flex items-center justify-center">
															<Globe className="h-3 w-3" />
														</span>
														<div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
															{ref.title && (
																<div className="font-medium text-xs text-green-700 dark:text-green-300 truncate flex-1 min-w-0">
																	{ref.title}
																</div>
															)}
															{ref.refer && (
																<span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300">
																	搜索引用
																</span>
															)}
														</div>
													</div>
													<Button
														variant="ghost"
														size="sm"
														className="h-5 px-1.5 -mt-1 flex-shrink-0"
														onClick={() => copyToClipboard(ref.content, `w-${index}`)}
													>
														{copiedSection === `w-${index}` ? (
															<CheckCheck className="h-3 w-3" />
														) : (
															<Copy className="h-3 w-3" />
														)}
													</Button>
												</div>
												
												{(ref.source || ref.link || ref.publishDate) && (
													<div className="flex items-center gap-2 mb-2 text-xs text-green-600 dark:text-green-400 flex-wrap">
														{ref.source && (
															<span className="flex items-center gap-1">
																<span className="font-medium">来源:</span>
																<span>{ref.source}</span>
															</span>
														)}
														{ref.publishDate && (
															<>
																<span>·</span>
																<span>{ref.publishDate}</span>
															</>
														)}
														{ref.link && (
															<>
																<span>·</span>
																<a
																	href={ref.link}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="flex items-center gap-1 hover:underline"
																>
																	<span>查看原文</span>
																	<ExternalLink className="h-3 w-3" />
																</a>
															</>
														)}
													</div>
												)}
												
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

						{/* 助手主要回答内容 */}
						{!isUser && (
							<div className="space-y-4">
								<div className="group relative">
									<div className="prose prose-sm max-w-none dark:prose-invert">
										<Streamdown>{message.content}</Streamdown>
										{isStreaming && message.content && (
											<span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
										)}
									</div>
									<Button
										variant="ghost"
										size="sm"
										className="absolute -top-2 -right-2 h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
										onClick={() => copyToClipboard(message.content, "assistant-message")}
									>
										{copiedSection === "assistant-message" ? (
											<CheckCheck className="h-3 w-3" />
										) : (
											<Copy className="h-3 w-3" />
										)}
									</Button>
								</div>
								
								{message.analysisResults && message.analysisResults.length > 0 && (
									<AnalysisResult results={message.analysisResults} />
								)}

								{/* 操作按钮 - 复制和重新生成 */}
								{!isStreaming && message.content && (
									<div className="flex items-center gap-2 pt-2">
										<Button
											variant="outline"
											size="sm"
											className="h-8 gap-2"
											onClick={() => copyToClipboard(message.content, "full-response")}
										>
											{copiedSection === "full-response" ? (
												<>
													<CheckCheck className="h-3.5 w-3.5" />
													<span className="text-xs">已复制</span>
												</>
											) : (
												<>
													<Copy className="h-3.5 w-3.5" />
													<span className="text-xs">复制回答</span>
												</>
											)}
										</Button>
										{onRegenerate && (
											<Button
												variant="outline"
												size="sm"
												className="h-8 gap-2"
												onClick={onRegenerate}
											>
												<RefreshCw className="h-3.5 w-3.5" />
												<span className="text-xs">重新生成</span>
											</Button>
										)}
									</div>
								)}
							</div>
						)}
	
						{!isUser && message.usage && message.usage.length > 0 && (
							<div className="text-xs text-muted-foreground mt-2 space-y-1">
								<div className="font-medium">Token 使用:</div>
								{message.usage.map((usage, index) => (
									<div key={index} className="flex items-center gap-2 pl-2">
										<span className="font-mono">
											{usage.nodeName}: 输入 {usage.inputTokenCount} + 输出 {usage.outputTokenCount} = {usage.totalTokenCount}
										</span>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</div>
		);
	}