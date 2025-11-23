import {
	Globe,
	Lightbulb,
	Mic,
	MicOff,
	Paperclip,
	Send,
	Square,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSpeechInput } from "../../hooks/useSpeechInput";

interface InputAreaProps {
	onSendMessage: (content: string, options?: { showThinking?: boolean; showReferences?: boolean }) => void;
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
	const [thinkActive, setThinkActive] = useState(false);
	const [deepSearchActive, setDeepSearchActive] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const wrapperRef = useRef<HTMLDivElement>(null);

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
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				if (!inputValue) setIsActive(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [inputValue]);

	const handleActivate = () => setIsActive(true);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim() && !isGenerating) {
			// 传递显示选项（API 始终调用知识库和思维链）
			onSendMessage(inputValue.trim(), {
				showThinking: thinkActive,      // 控制是否显示思考过程
				showReferences: deepSearchActive, // 控制是否显示知识库引用
			});
			setInputValue("");
			resetTranscript();
		}
	};

	// 处理语音输入
	const handleVoiceInput = () => {
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
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const containerVariants = {
		collapsed: {
			height: 68,
			boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
			transition: { type: "spring" as const, stiffness: 120, damping: 18 },
		},
		expanded: {
			height: 128,
			boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
			transition: { type: "spring" as const, stiffness: 120, damping: 18 },
		},
	};

	const placeholderContainerVariants = {
		initial: {},
		animate: { transition: { staggerChildren: 0.025 } },
		exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
	};

	const letterVariants = {
		initial: {
			opacity: 0,
			filter: "blur(12px)",
			y: 10,
		},
		animate: {
			opacity: 1,
			filter: "blur(0px)",
			y: 0,
			transition: {
				opacity: { duration: 0.25 },
				filter: { duration: 0.4 },
				y: { type: "spring" as const, stiffness: 80, damping: 20 },
			},
		},
		exit: {
			opacity: 0,
			filter: "blur(12px)",
			y: -10,
			transition: {
				opacity: { duration: 0.2 },
				filter: { duration: 0.3 },
				y: { type: "spring" as const, stiffness: 80, damping: 20 },
			},
		},
	};

	return (
		<div className="border-t border-border bg-background">
			<div className="mx-auto max-w-4xl px-4 py-6">
				<motion.div
					ref={wrapperRef}
					className="w-full"
					variants={containerVariants}
					animate={isActive || inputValue ? "expanded" : "collapsed"}
					initial="collapsed"
					style={{
						overflow: "hidden",
						borderRadius: 32,
						background: "hsl(var(--background))",
					}}
					onClick={handleActivate}
				>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col items-stretch w-full h-full">
							{/* Input Row */}
							<div className="flex items-center gap-2 p-3 rounded-full bg-background w-full">
								<button
									className="p-3 rounded-full hover:bg-accent transition"
									title="附加文件"
									type="button"
									tabIndex={-1}
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
													variants={placeholderContainerVariants}
													initial="initial"
													animate="animate"
													exit="exit"
												>
													{PLACEHOLDERS[placeholderIndex]
														.split("")
														.map((char, i) => (
														        <motion.span
														                key={`placeholder-${placeholderIndex}-char-${i}`}
																variants={letterVariants}
																style={{ display: "inline-block" }}
															>
																{char === " " ? "\u00A0" : char}
															</motion.span>
														))}
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
								>
									{listening ? <MicOff size={20} /> : <Mic size={20} />}
								</button>

								{isGenerating ? (
									<button
										type="button"
										onClick={onStopGenerating}
										className="flex items-center gap-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground p-3 rounded-full font-medium justify-center"
										title="停止生成"
									>
										<Square size={18} />
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

							{/* Expanded Controls */}
							<motion.div
								className="w-full flex justify-start px-4 items-center text-sm"
								variants={{
									hidden: {
										opacity: 0,
										y: 20,
										pointerEvents: "none" as const,
										transition: { duration: 0.25 },
									},
									visible: {
										opacity: 1,
										y: 0,
										pointerEvents: "auto" as const,
										transition: { duration: 0.35, delay: 0.08 },
									},
								}}
								initial="hidden"
								animate={isActive || inputValue ? "visible" : "hidden"}
								style={{ marginTop: 8 }}
							>
								<div className="flex gap-3 items-center">
									{/* Think Toggle */}
									<motion.button
										className={`flex items-center py-2 rounded-full font-medium group whitespace-nowrap overflow-hidden justify-start ${
											thinkActive
												? "bg-blue-600/10 outline outline-blue-600/60 text-blue-950 dark:text-blue-100"
												: "bg-accent text-foreground hover:bg-accent/80"
										}`}
										title="无忧思考模式"
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											setThinkActive((a) => !a);
										}}
										initial={false}
										animate={{
											width: thinkActive ? 110 : 36,
											paddingLeft: thinkActive ? 16 : 9,
											paddingRight: thinkActive ? 16 : 9,
										}}
										transition={{
											type: "spring",
											stiffness: 400,
											damping: 30,
										}}
									>
										<Lightbulb
											className="group-hover:fill-yellow-300 transition-all flex-shrink-0"
											size={18}
										/>
										<motion.span
											className="ml-1"
											initial={false}
											animate={{
												opacity: thinkActive ? 1 : 0,
												width: thinkActive ? "auto" : 0,
											}}
											transition={{
												opacity: { duration: 0.2 },
												width: { type: "spring", stiffness: 400, damping: 30 },
											}}
										>
											无忧思考
										</motion.span>
									</motion.button>

									{/* Knowledge Base Toggle */}
									<motion.button
										className={`flex items-center py-2 rounded-full font-medium whitespace-nowrap overflow-hidden justify-start ${
											deepSearchActive
												? "bg-blue-600/10 outline outline-blue-600/60 text-blue-950 dark:text-blue-100"
												: "bg-accent text-foreground hover:bg-accent/80"
										}`}
										title="显示知识库引用"
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											setDeepSearchActive((a) => !a);
										}}
										initial={false}
										animate={{
											width: deepSearchActive ? 150 : 36,
											paddingLeft: deepSearchActive ? 16 : 9,
											paddingRight: deepSearchActive ? 16 : 9,
										}}
										transition={{
											type: "spring",
											stiffness: 400,
											damping: 30,
										}}
									>
										<Globe size={18} className="flex-shrink-0" />
										<motion.span
											className="ml-1"
											initial={false}
											animate={{
												opacity: deepSearchActive ? 1 : 0,
												width: deepSearchActive ? "auto" : 0,
											}}
											transition={{
												opacity: { duration: 0.2 },
												width: { type: "spring", stiffness: 400, damping: 30 },
											}}
										>
											显示知识库引用
										</motion.span>
									</motion.button>
								</div>
							</motion.div>
						</div>
					</form>
				</motion.div>
				<div className="mt-3 text-center text-xs text-muted-foreground">
					库无忧助手可能会出错。请核查重要信息。
				</div>
			</div>
		</div>
	);
}
