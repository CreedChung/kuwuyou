"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">

			<div className="w-full max-w-md relative z-10">
				{/* 标题 */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent">
						库无忧助手
					</h1>
				</div>

				<RegisterForm />

				{/* 底部说明 */}
				<p className="text-center text-xs text-gray-500 mt-6">
					继续即表示您同意我们的{" "}
					<Link
						href="/terms"
						className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
					>
						服务条款
					</Link>{" "}
					和{" "}
					<Link
						href="/privacy"
						className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
					>
						隐私政策
					</Link>
				</p>
			</div>
		</div>
	);
}