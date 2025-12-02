"use client";

import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step, TooltipRenderProps } from "react-joyride";

function CustomTooltip({
	continuous,
	index,
	step,
	backProps,
	closeProps,
	primaryProps,
	tooltipProps,
	isLastStep,
}: TooltipRenderProps) {
	return (
		<div
			{...tooltipProps}
			className="bg-popover text-popover-foreground p-4 rounded-xl shadow-lg max-w-sm border border-border"
		>
			{step.title && (
				<div className="mb-2 font-semibold text-lg">{step.title}</div>
			)}
			<div className="mb-4 leading-relaxed">{step.content}</div>
			<div className="flex justify-between items-center mt-4 gap-4">
				<button
					{...closeProps}
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					{isLastStep ? "关闭" : "跳过"}
				</button>
				<div className="flex gap-2 ml-auto">
					{index > 0 && (
						<button
							{...backProps}
							className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
						>
							上一步
						</button>
					)}
					<button
						{...primaryProps}
						className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
					>
						{isLastStep ? "完成" : "下一步"}
					</button>
				</div>
			</div>
		</div>
	);
}

export function Tutorial() {
	const [run, setRun] = useState(false);

	useEffect(() => {
		// Check if user has seen tutorial
		const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
		if (!hasSeenTutorial) {
			setRun(true);
		}
	}, []);

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status } = data;
		if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
			setRun(false);
			localStorage.setItem("hasSeenTutorial", "true");
		}
	};

	const steps: Step[] = [
		{
			content: (
				<div className="text-center">
					<h2 className="text-xl font-bold mb-2">欢迎使用库无忧助手! 👋</h2>
					<p>我是您的智能助手，让我带您了解一下如何使用吧。</p>
				</div>
			),
			placement: "center",
			target: "body",
			disableBeacon: true,
		},
		{
			target: "#tutorial-new-chat",
			content: "点击这里开始一个新的对话。",
			placement: "right",
		},
		{
			target: "#tutorial-search",
			content: "在这里搜索您之前的对话记录。",
			placement: "right",
		},
		{
			target: "#tutorial-knowledge",
			content: "访问知识库，管理您的文档资料。",
			placement: "right",
		},
		{
			target: "#tutorial-user-profile",
			content: "在这里管理您的个人资料和设置，或者退出登录。",
			placement: "top",
		},
		{
			target: "#tutorial-theme-toggle",
			content: "切换明亮/暗黑模式，保护您的视力。",
			placement: "bottom",
		},
		{
			target: "#tutorial-input-field",
			content: "在这里输入您的问题。输入后还可以看到联网搜索、深度思考等更多选项。",
			placement: "top",
		},
		{
			target: "#tutorial-file-upload",
			content: "上传文档（PDF, Word, TXT等），我会帮您分析其中的内容。",
			placement: "top",
		},
		{
			target: "#tutorial-voice-input",
			content: "不想打字？点击这里使用语音输入。",
			placement: "top",
		},
		{
			target: "body",
			content: (
				<div className="text-center">
					<h2 className="text-xl font-bold mb-2">准备就绪! 🚀</h2>
					<p>您已经了解了所有基本功能。开始使用吧！</p>
				</div>
			),
			placement: "center",
		},
	];

	return (
		<Joyride
			steps={steps}
			run={run}
			continuous
			showProgress
			showSkipButton
			callback={handleJoyrideCallback}
			tooltipComponent={CustomTooltip}
			styles={{
				options: {
					primaryColor: "var(--primary)",
					textColor: "var(--popover-foreground)",
					backgroundColor: "var(--popover)",
					arrowColor: "var(--popover)",
					overlayColor: "rgba(0, 0, 0, 0.5)",
					zIndex: 1000,
				},
			}}
			locale={{
				back: "上一步",
				close: "关闭",
				last: "完成",
				next: "下一步",
				skip: "跳过",
			}}
		/>
	);
}
