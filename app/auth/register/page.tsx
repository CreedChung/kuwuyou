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
				{/* 标题 */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
						库无忧助手
					</h1>
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