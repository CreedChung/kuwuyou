"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: "url('/bg1.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
			{/* 背景遮罩 */}
			<div className="absolute inset-0 bg-black/20 pointer-events-none" />

			<div className="w-full max-w-md relative z-10">
				{/* 返回主页按钮 */}
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors group"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-5 h-5 transition-transform group-hover:-translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<title>返回箭头</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					<span className="font-medium">返回主页</span>
				</Link>
	
				{/* 标题 */}
				<div className="text-center mb-8 space-y-2">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
						库无忧助手
					</h1>
					<p className="text-gray-600 text-base">
						创建账号,开启你的智能对话之旅
					</p>
				</div>

				<RegisterForm />

				{/* 底部说明 */}
				<p className="text-center text-xs text-gray-500 mt-6">
					继续即表示您同意我们的{" "}
					<Link
						href="/terms"
						className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
					>
						服务条款
					</Link>{" "}
					和{" "}
					<Link
						href="/privacy"
						className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
					>
						隐私政策
					</Link>
				</p>
			</div>
		</div>
	);
}