"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingStep {
	id: string;
	title: string;
	description: string;
	targetId?: string;
	position?: "top" | "bottom" | "left" | "right" | "center";
}

const ONBOARDING_STEPS: OnboardingStep[] = [
	{
		id: "welcome",
		title: "欢迎使用库无忧助手! 👋",
		description: "让我用30秒带您快速了解主要功能",
		position: "center",
	},
	{
		id: "new-chat",
		title: "开始新对话",
		description: "点击这里可以创建一个全新的对话",
		targetId: "tutorial-new-chat",
		position: "right",
	},
	{
		id: "search",
		title: "搜索历史",
		description: "在这里快速找到之前的对话记录",
		targetId: "tutorial-search",
		position: "right",
	},
	{
		id: "knowledge",
		title: "知识库检索",
		description: "开启后,我会从您的文档资料中寻找答案",
		targetId: "tutorial-knowledge-retrieval",
		position: "bottom",
	},
	{
		id: "input",
		title: "输入问题",
		description: "在这里输入您的问题,支持联网搜索、深度思考等功能",
		targetId: "tutorial-input-field",
		position: "top",
	},
	{
		id: "done",
		title: "准备就绪! 🚀",
		description: "现在您可以开始使用了。祝您使用愉快!",
		position: "center",
	},
];

export function Onboarding() {
	const [isActive, setIsActive] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [targetPosition, setTargetPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

	useEffect(() => {
		// 检查是否已经看过引导
		const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
		if (!hasSeenOnboarding) {
			// 延迟显示,确保页面元素已加载
			setTimeout(() => {
				setIsActive(true);
			}, 1000);
		}
	}, []);

	useEffect(() => {
		if (!isActive) return;

		const step = ONBOARDING_STEPS[currentStep];
		if (step.targetId) {
			const element = document.getElementById(step.targetId);
			if (element) {
				const rect = element.getBoundingClientRect();
				setTargetPosition({
					top: rect.top,
					left: rect.left,
					width: rect.width,
					height: rect.height,
				});
				// 滚动到目标元素
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			} else {
				setTargetPosition(null);
			}
		} else {
			setTargetPosition(null);
		}
	}, [currentStep, isActive]);

	const handleNext = () => {
		if (currentStep < ONBOARDING_STEPS.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			handleClose();
		}
	};

	const handlePrev = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSkip = () => {
		handleClose();
	};

	const handleClose = () => {
		setIsActive(false);
		localStorage.setItem("hasSeenOnboarding", "true");
	};

	if (!isActive) return null;

	const step = ONBOARDING_STEPS[currentStep];
	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
	const isCenterPosition = step.position === "center" || !step.targetId;

	return (
		<AnimatePresence>
			{isActive && (
				<>
					{/* 遮罩层 */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
						onClick={handleSkip}
					/>

					{/* 高亮区域 */}
					{targetPosition && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed z-[9999] pointer-events-none"
							style={{
								top: targetPosition.top - 4,
								left: targetPosition.left - 4,
								width: targetPosition.width + 8,
								height: targetPosition.height + 8,
								boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.6)",
								borderRadius: "8px",
							}}
						/>
					)}

					{/* 提示卡片 */}
					<motion.div
						key={currentStep}
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ type: "spring", damping: 20, stiffness: 300 }}
						className={`fixed z-[10000] bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl p-6 max-w-sm ${
							isCenterPosition ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : ""
						}`}
						style={
							!isCenterPosition && targetPosition && step.position && step.position !== "center"
								? getTooltipPosition(step.position, targetPosition)
								: {}
						}
					>
						{/* 关闭按钮 */}
						<button
							onClick={handleSkip}
							className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
						>
							<X className="w-4 h-4" />
						</button>

						{/* 内容 */}
						<div className="mb-6">
							<h3 className="text-xl font-bold mb-2">{step.title}</h3>
							<p className="text-white/90 leading-relaxed">{step.description}</p>
						</div>

						{/* 进度指示器 */}
						<div className="flex gap-1.5 mb-4">
							{ONBOARDING_STEPS.map((_, index) => (
								<div
									key={index}
									className={`h-1.5 rounded-full flex-1 transition-all ${
										index === currentStep
											? "bg-white"
											: index < currentStep
											? "bg-white/60"
											: "bg-white/20"
									}`}
								/>
							))}
						</div>

						{/* 按钮组 */}
						<div className="flex justify-between items-center gap-3">
							<button
								onClick={handleSkip}
								className="text-sm text-white/80 hover:text-white transition-colors"
							>
								跳过引导
							</button>

							<div className="flex gap-2">
								{!isFirstStep && (
									<button
										onClick={handlePrev}
										className="px-4 py-2 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
									>
										上一步
									</button>
								)}
								<button
									onClick={handleNext}
									className="px-4 py-2 text-sm font-medium bg-white text-blue-600 hover:bg-white/90 rounded-lg transition-colors"
								>
									{isLastStep ? "开始使用" : "下一步"}
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

// 计算提示框位置
function getTooltipPosition(
	position: "top" | "bottom" | "left" | "right",
	targetPosition: { top: number; left: number; width: number; height: number }
): React.CSSProperties {
	const offset = 16;
	const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
	const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768;
	const tooltipHeight = 300; // 预估提示框高度
	const tooltipWidth = 384; // max-w-sm 约为 384px

	let finalPosition = position;

	// 智能调整位置
	switch (position) {
		case "bottom":
			// 如果底部空间不足，且顶部空间充足，则显示在顶部
			if (
				viewportHeight - (targetPosition.top + targetPosition.height) < tooltipHeight &&
				targetPosition.top > tooltipHeight
			) {
				finalPosition = "top";
			}
			break;
		case "top":
			// 如果顶部空间不足，且底部空间充足，则显示在底部
			if (targetPosition.top < tooltipHeight && viewportHeight - (targetPosition.top + targetPosition.height) > tooltipHeight) {
				finalPosition = "bottom";
			}
			break;
		case "right":
			// 如果右侧空间不足，且左侧空间充足，则显示在左侧
			if (
				viewportWidth - (targetPosition.left + targetPosition.width) < tooltipWidth &&
				targetPosition.left > tooltipWidth
			) {
				finalPosition = "left";
			}
			break;
		case "left":
			// 如果左侧空间不足，且右侧空间充足，则显示在右侧
			if (targetPosition.left < tooltipWidth && viewportWidth - (targetPosition.left + targetPosition.width) > tooltipWidth) {
				finalPosition = "right";
			}
			break;
	}

	switch (finalPosition) {
		case "top":
			return {
				left: targetPosition.left + targetPosition.width / 2,
				top: targetPosition.top - offset,
				transform: "translate(-50%, -100%)",
			};
		case "bottom":
			return {
				left: targetPosition.left + targetPosition.width / 2,
				top: targetPosition.top + targetPosition.height + offset,
				transform: "translateX(-50%)",
			};
		case "left":
			return {
				left: targetPosition.left - offset,
				top: targetPosition.top + targetPosition.height / 2,
				transform: "translate(-100%, -50%)",
			};
		case "right":
			return {
				left: targetPosition.left + targetPosition.width + offset,
				top: targetPosition.top + targetPosition.height / 2,
				transform: "translateY(-50%)",
			};
		default:
			return {};
	}
}
