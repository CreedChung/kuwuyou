"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
	const router = useRouter();
	const emailId = useId();
	const passwordId = useId();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [loginForm, setLoginForm] = useState({ email: "", password: "" });
	const { signIn } = useAuth();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		const email = loginForm.email.trim();
		const password = loginForm.password.trim();

		// 验证表单
		if (!email) {
			alert("请输入邮箱");
			return;
		}

		if (!password) {
			alert("请输入密码");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			alert("邮箱格式错误");
			return;
		}

		setIsLoading(true);

		try {
			const { error } = await signIn(email, password);
			if (!error) {
				router.push("/chat");
			}
		} catch (error) {
			console.error("登录错误:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
			{/* 背景装饰 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-700" />
			</div>

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

				{/* Logo 和标题 */}
				<div className="text-center mb-8 space-y-2">
					<div className="flex items-center justify-center gap-2 mb-4">
						<div className="relative">
							<img
								src="/logo.jpg"
								alt="库无忧助手 Logo"
								className="w-16 h-16 rounded-lg drop-shadow-lg"
							/>
						</div>
					</div>
					<div className="flex items-center justify-center gap-3">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
							库无忧助手
						</h1>
						<p className="text-gray-600 text-base">
							欢迎回来,继续你的智能对话之旅
						</p>
					</div>
				</div>

				<Card className="border-gray-200 shadow-2xl backdrop-blur-xl bg-white/90 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 pointer-events-none" />

					<CardHeader className="relative">
						<CardTitle className="text-2xl text-center text-gray-800">
							登录账号
						</CardTitle>
						<CardDescription className="text-center text-gray-600">
							选择登录方式
						</CardDescription>
					</CardHeader>

					<Tabs defaultValue="email" className="w-full">
						<TabsList className="grid max-w-sm grid-cols-2 mx-auto mb-6">
							<TabsTrigger value="email">邮箱登录</TabsTrigger>
							<TabsTrigger value="dingtalk">钉钉登录</TabsTrigger>
						</TabsList>

						{/* 邮箱登录 */}
						<TabsContent value="email">
							<form onSubmit={handleLogin}>
								<CardContent className="space-y-4 relative">
									{/* 邮箱输入 */}
									<div className="space-y-2">
										<Label htmlFor={emailId} className="text-gray-700">
											邮箱地址
										</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
											<Input
												id={emailId}
												type="email"
												placeholder="your@email.com"
												value={loginForm.email}
												onChange={(e) =>
													setLoginForm({ ...loginForm, email: e.target.value })
												}
												className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
											/>
										</div>
									</div>

									{/* 密码输入 */}
									<div className="space-y-2">
										<Label htmlFor={passwordId} className="text-gray-700">
											密码
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
											<Input
												id={passwordId}
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												value={loginForm.password}
												onChange={(e) =>
													setLoginForm({
														...loginForm,
														password: e.target.value,
													})
												}
												className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
											>
												{showPassword ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</button>
										</div>
									</div>

									{/* 记住我 */}
									<div className="flex items-center justify-between text-sm">
										<label className="flex items-center gap-2 cursor-pointer group">
											<input
												type="checkbox"
												className="rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500/20 transition-all"
											/>
											<span className="text-gray-600 group-hover:text-gray-800 transition-colors">
												记住我
											</span>
										</label>
									</div>
								</CardContent>

								<CardFooter className="flex flex-col gap-4 relative">
									<Button
										type="submit"
										className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
										disabled={isLoading}
									>
										{isLoading ? (
											<>
												<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
												登录中...
											</>
										) : (
											<>
												<LogIn className="w-4 h-4 mr-2" />
												登录
											</>
										)}
									</Button>

									<p className="text-sm text-center text-gray-600">
										还没有账号?{" "}
										<Link
											href="/auth/register"
											className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
										>
											立即注册
										</Link>
									</p>
								</CardFooter>
							</form>
						</TabsContent>

						{/* 钉钉登录 */}
						<TabsContent value="dingtalk">
							<CardContent className="space-y-4 relative py-12">
								<div className="flex flex-col items-center justify-center gap-4">
									<div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
										<p className="text-gray-400 text-sm">钉钉扫码区域</p>
									</div>
									<p className="text-gray-600 text-sm">请使用钉钉扫码登录</p>
								</div>
							</CardContent>

							<CardFooter className="flex flex-col gap-4 relative">
								<p className="text-sm text-center text-gray-600">
									还没有账号?{" "}
									<Link
										href="/auth/register"
										className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
									>
										立即注册
									</Link>
								</p>
							</CardFooter>
						</TabsContent>
					</Tabs>
				</Card>

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