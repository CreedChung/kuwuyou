import {
	Globe,
	Lightbulb,
	Mic,
	MicOff,
	Paperclip,
	Send,
	Square,
	X,
	Search,
	BookOpen,
	Brain,
	ChevronUp,
	ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSpeechInput } from "../../hooks/useSpeechInput";
import { truncateText, formatFileSize } from "@/utils/fileProcessor";

interface InputAreaProps {
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

const PLACEHOLDERS = [
	"储罐保温涂层施工要求...",
	"如何选择合适的防腐材料...",
	"储罐维修检测项目有哪些...",
	"保温层破损如何修复...",
	"防腐涂层的使用寿命...",
	"储罐底板防腐处理方案...",
];

export function InputArea({
	onSendMessage,
	isGenerating = false,
	onStopGenerating,
}: InputAreaProps) {
	const [placeholderIndex, setPlaceholderIndex] = useState(0);
	const [showPlaceholder, setShowPlaceholder] = useState(true);
	const [isActive, setIsActive] = useState(false);
	const [thinkActive, setThinkActive] = useState(true);
	const [deepSearchActive, setDeepSearchActive] = useState(true);
	const [webSearchActive, setWebSearchActive] = useState(true);
	const [inputValue, setInputValue] = useState("");
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [fileContent, setFileContent] = useState<string>("");
	const [isProcessingFile, setIsProcessingFile] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// 语音识别 hook
	const {
		listening,
		resetTranscript,
		toggleListening,
		browserSupportsSpeechRecognition,
		isMicrophoneAvailable,
	} = useSpeechInput({
		onTranscriptChange: (text) => {
			setInputValue(text);
			setIsActive(true);
		},
		language: "zh-CN",
		continuous: true,
	});

	// Cycle placeholder text when input is inactive
	useEffect(() => {
		if (isActive || inputValue) return;

		const interval = setInterval(() => {
			setShowPlaceholder(false);
			setTimeout(() => {
				setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
				setShowPlaceholder(true);
			}, 400);
		}, 3000);

		return () => clearInterval(interval);
	}, [isActive, inputValue]);

	// Close input when clicking outside
	// Memoize handleClickOutside to avoid recreating the function
	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (
			wrapperRef.current &&
			!wrapperRef.current.contains(event.target as Node)
		) {
			if (!inputValue) setIsActive(false);
		}
	}, [inputValue]);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [handleClickOutside]);

	const handleActivate = useCallback(() => setIsActive(true), []);

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim() && !isGenerating) {
			// 根据按钮状态决定启用哪些功能
			onSendMessage(inputValue.trim(), {
				showThinking: thinkActive,      // 思考按钮控制
				showReferences: deepSearchActive,    // 知识库按钮控制
				useWebSearch: webSearchActive,      // 联网搜索按钮控制
				uploadedFile: uploadedFile || undefined,
				fileContent: fileContent || undefined,
			});
			setInputValue("");
			setUploadedFile(null);
			setFileContent("");
			resetTranscript();
		}
	}, [inputValue, isGenerating, thinkActive, deepSearchActive, webSearchActive, uploadedFile, fileContent, onSendMessage, resetTranscript]);

	// 处理文件上传 - memoized to prevent recreation
	const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 100 * 1024 * 1024) {
			alert("文件大小不能超过100MB");
			return;
		}

		setIsProcessingFile(true);
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/file-parser', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || '文件解析失败');
			}

			const result = await response.json();
			
			const truncatedText = truncateText(result.content, 5000);
			
			setUploadedFile(file);
			setFileContent(truncatedText);
			setIsActive(true);
		} catch (error) {
			console.error("文件处理失败:", error);
			alert(error instanceof Error ? error.message : "文件处理失败");
		} finally {
			setIsProcessingFile(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	}, []);

	// 移除已上传的文件 - memoized
	const handleRemoveFile = useCallback(() => {
		setUploadedFile(null);
		setFileContent("");
	}, []);

	// 触发文件选择 - memoized
	const handleFileButtonClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	// 处理语音输入 - memoized
	const handleVoiceInput = useCallback(() => {
		if (!browserSupportsSpeechRecognition) {
			alert(
				"您的浏览器不支持语音识别功能。请使用 Chrome、Edge 或 Safari 浏览器。",
			);
			return;
		}

		if (!isMicrophoneAvailable) {
			alert("无法访问麦克风。请检查浏览器权限设置。");
			return;
		}

		try {
			if (!listening) {
				setInputValue("");
			}
			toggleListening();
		} catch (error) {
			alert(error instanceof Error ? error.message : "启动语音识别失败");
		}
	}, [browserSupportsSpeechRecognition, isMicrophoneAvailable, listening, toggleListening]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	}, [handleSubmit]);

	const containerVariants = {
		default: {
			height: 68,
			boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
			transition: { type: "spring" as const, stiffness: 120, damping: 18 },
		},
		focused: {
			height: 68,
			boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
			transition: { type: "spring" as const, stiffness: 120, damping: 18 },
		},
	};


	return (
		<div className="border-t border-border bg-background" data-tutorial="input-area">
			<div className="mx-auto max-w-4xl px-4 py-6">
				{/* 文件上传显示 - 移到输入框外部 */}
				<AnimatePresence>
					{uploadedFile && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="mb-3"
						>
							<div className="flex items-center gap-2 bg-muted/50 px-4 py-3 rounded-2xl border border-border shadow-sm">
								<Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">{uploadedFile.name}</p>
									<p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
								</div>
								<button
									type="button"
									onClick={handleRemoveFile}
									className="p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
									title="移除文件"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.div
					ref={wrapperRef}
					className="w-full"
					variants={containerVariants}
					animate={isActive || inputValue ? "focused" : "default"}
					initial="default"
					style={{
						overflow: "hidden",
						borderRadius: 32,
						background: "hsl(var(--background))",
					}}
					onClick={handleActivate}
				>
					<form onSubmit={handleSubmit}>
						<div className="flex items-center gap-2 p-3 rounded-full bg-background w-full">
							<input
								ref={fileInputRef}
								type="file"
								accept=".txt,.md,.doc,.docx,.pdf"
								onChange={handleFileUpload}
								className="hidden"
								disabled={isGenerating || isProcessingFile}
							/>
							<button
								className={`p-3 rounded-full hover:bg-accent transition ${
									isProcessingFile ? "opacity-50 cursor-not-allowed" : ""
								} ${uploadedFile ? "text-primary" : ""}`}
								title="附加文件"
								type="button"
								tabIndex={-1}
								onClick={handleFileButtonClick}
								disabled={isGenerating || isProcessingFile}
								data-tutorial="file-upload"
							>
								<Paperclip size={20} />
							</button>

							{/* Text Input & Placeholder */}
							<div className="relative flex-1">
								<input
									type="text"
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									onKeyDown={handleKeyDown}
									className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal text-foreground"
									style={{ position: "relative", zIndex: 1 }}
									onFocus={handleActivate}
									disabled={isGenerating}
								/>
								<div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
					<AnimatePresence mode="wait">
						{showPlaceholder && !isActive && !inputValue && (
							<motion.span
								key={placeholderIndex}
								className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none"
								style={{
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									zIndex: 0,
								}}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								transition={{ duration: 0.3 }}
							>
								{PLACEHOLDERS[placeholderIndex]}
							</motion.span>
						)}
					</AnimatePresence>
				</div>
							</div>

							<button
								className={`p-3 rounded-full transition ${
									listening
										? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
										: "hover:bg-accent"
								}`}
								title={listening ? "停止录音" : "语音输入"}
								type="button"
								tabIndex={-1}
								onClick={handleVoiceInput}
								disabled={isGenerating}
								data-tutorial="voice-input"
							>
								{listening ? <MicOff size={20} /> : <Mic size={20} />}
							</button>

							{isGenerating ? (
								<button
									type="button"
									onClick={onStopGenerating}
									className="flex items-center gap-1 bg-destructive hover:bg-destructive/90 text-white p-3 rounded-full font-medium justify-center"
									title="停止生成"
								>
									<Square size={18} className="text-white" />
								</button>
							) : (
								<button
									type="submit"
									disabled={!inputValue.trim()}
									className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full font-medium justify-center disabled:opacity-40 disabled:cursor-not-allowed"
									title="发送"
								>
									<Send size={18} />
								</button>
							)}
						</div>
					</form>
				</motion.div>

				{/* 功能按钮区域 - 默认显示在搜索框外部 */}
				<div className="mt-3">
					<div className="flex items-center gap-2 flex-wrap">
						{/* 联网搜索按钮 */}
						<button
							type="button"
							onClick={() => setWebSearchActive(!webSearchActive)}
							className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
								webSearchActive
									? "bg-primary text-primary-foreground shadow-sm"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
							title={webSearchActive ? "关闭联网搜索" : "开启联网搜索"}
							data-tutorial="web-search"
						>
							<Globe size={14} />
							<span>联网搜索</span>
						</button>

						{/* 知识库按钮 */}
						<button
							type="button"
							onClick={() => setDeepSearchActive(!deepSearchActive)}
							className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
								deepSearchActive
									? "bg-primary text-primary-foreground shadow-sm"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
							title={deepSearchActive ? "关闭知识库检索" : "开启知识库检索"}
							data-tutorial="knowledge-search"
						>
							<BookOpen size={14} />
							<span>知识库</span>
						</button>

						{/* 思考按钮 */}
						<button
							type="button"
							onClick={() => setThinkActive(!thinkActive)}
							className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
								thinkActive
									? "bg-primary text-primary-foreground shadow-sm"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
							title={thinkActive ? "关闭深度思考" : "开启深度思考"}
							data-tutorial="deep-thinking"
						>
							<Brain size={14} />
							<span>深度思考</span>
						</button>
					</div>
				</div>
				
				{/* 底部提示信息 */}
				<div className="mt-3 flex items-center justify-center gap-2">
					<span className="text-xs text-muted-foreground">
						库无忧助手可能会出错。请核查重要信息。
					</span>
				</div>
			</div>
		</div>
	);
}
