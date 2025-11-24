import { AlertCircle, BookOpen, CheckCheck, ChevronDown, ChevronUp, Copy, FileText, Globe, Lightbulb, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Streamdown } from "streamdown";
import type { Message as MessageType } from "./types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AnalysisResult } from "./AnalysisResult";

interface MessageProps {
	message: MessageType;
}

export function Message({ message }: MessageProps) {
	const { user } = useAuth();
	const isUser = message.role === "user";
	const hasError = !!message.error;
	const isStreaming = message.isStreaming;
	const [showThinking, setShowThinking] = useState(true);
	const [showReferences, setShowReferences] = useState(true);
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
								{/* 显示上传的文件名 */}
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

						{/* 知识库引用和联网搜索结果 */}
						{!isUser && message.references && message.references.length > 0 && (
							<div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 overflow-hidden">
								<div className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-blue-900 dark:text-blue-100">
									<button
										onClick={() => setShowReferences(!showReferences)}
										className="flex items-center gap-2 hover:opacity-80 transition-opacity"
									>
										{(() => {
											const knowledgeCount = message.references.filter(ref => ref.type === "knowledge").length;
											const webCount = message.references.filter(ref => ref.type === "web_search").length;
											
											if (knowledgeCount > 0 && webCount > 0) {
												return (
													<>
														<div className="flex items-center gap-1">
															<BookOpen className="h-4 w-4" />
															<Globe className="h-4 w-4" />
														</div>
														<span>查找到 {knowledgeCount} 个知识片段 + {webCount} 个网络结果</span>
													</>
												);
											} else if (webCount > 0) {
												return (
													<>
														<Globe className="h-4 w-4" />
														<span>查找到 {webCount} 个网络结果</span>
													</>
												);
											} else {
												return (
													<>
														<BookOpen className="h-4 w-4" />
														<span>查找到 {knowledgeCount} 个知识片段</span>
													</>
												);
											}
										})()}
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
									<div className="px-4 pb-3 space-y-3">
										{/* 显示查找的文件列表（仅知识库） */}
										{(() => {
											const knowledgeRefs = message.references.filter(ref => ref.type !== "web_search");
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
										
										{/* 引用列表 */}
										{message.references.map((ref, index) => {
											const isWebSearch = ref.type === "web_search";
											return (
												<div
													key={index}
													className={`text-sm p-3 rounded border ${
														isWebSearch
															? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
															: "bg-white/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200"
													}`}
												>
													<div className="flex items-start justify-between gap-2 mb-2">
														<div className="flex items-center gap-2 flex-1 min-w-0">
															<span className={`flex-shrink-0 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-medium ${
																isWebSearch ? "bg-green-500 dark:bg-green-600" : "bg-blue-500 dark:bg-blue-600"
															}`}>
																{isWebSearch ? (
																	<Globe className="h-3 w-3" />
																) : (
																	<span>{index + 1}</span>
																)}
															</span>
															<div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
																{isWebSearch && ref.title && (
																	<div className="font-medium text-xs text-green-700 dark:text-green-300 truncate flex-1 min-w-0">
																		{ref.title}
																	</div>
																)}
																{!isWebSearch && (
																	<div className="font-medium text-xs text-blue-600 dark:text-blue-400 truncate">
																		{ref.source || "知识库"}
																	</div>
																)}
																{ref.score !== undefined && (
																	<span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-mono ${
																		isWebSearch
																			? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300"
																			: "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
																	}`}>
																		{(ref.score * 100).toFixed(1)}%
																	</span>
																)}
																{isWebSearch && ref.refer && (
																	<span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 font-mono">
																		{ref.refer}
																	</span>
																)}
															</div>
														</div>
														<Button
															variant="ghost"
															size="sm"
															className="h-5 px-1.5 -mt-1 flex-shrink-0"
															onClick={() => copyToClipboard(ref.content, `ref-${index}`)}
														>
															{copiedSection === `ref-${index}` ? (
																<CheckCheck className="h-3 w-3" />
															) : (
																<Copy className="h-3 w-3" />
															)}
														</Button>
													</div>
													
													{/* 网络搜索来源信息 */}
													{isWebSearch && (ref.source || ref.link || ref.publishDate) && (
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
																		onClick={(e) => e.stopPropagation()}
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
											);
										})}
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
								
								{/* 显示分析结果 */}
								{message.analysisResults && message.analysisResults.length > 0 && (
									<AnalysisResult results={message.analysisResults} />
								)}
							</div>
						)}

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