"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Check,
	Eye,
	EyeOff,
	Lock,
	Mail,
	User,
	UserPlus,
	X,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { calculatePasswordStrength } from "@/utils/passwordValidation";
import { savePendingLogin } from "@/utils/storage";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export function RegisterForm() {
	const router = useRouter();
	const { signUp } = useAuth();
	const { toast } = useToast();
	const usernameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [registerForm, setRegisterForm] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	// 密码强度计算
	const passwordStrength = useMemo(() => {
		return calculatePasswordStrength(registerForm.password);
	}, [registerForm.password]);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		const username = registerForm.username.trim();
		const email = registerForm.email.trim();
		const password = registerForm.password.trim();
		const confirmPassword = registerForm.confirmPassword.trim();

		// 验证用户名
		if (!username) {
			toast({
				title: "请输入用户名",
				description: "用户名不能为空",
				variant: "destructive",
			});
			return;
		}

		if (username.length < 2) {
			toast({
				title: "用户名太短",
				description: "用户名至少需要2个字符",
				variant: "destructive",
			});
			return;
		}

		// 验证邮箱
		if (!email) {
			toast({
				title: "请输入邮箱",
				description: "邮箱地址不能为空",
				variant: "destructive",
			});
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast({
				title: "邮箱格式错误",
				description: "请输入有效的邮箱地址",
				variant: "destructive",
			});
			return;
		}

		// 验证密码
		if (!password) {
			toast({
				title: "请输入密码",
				description: "密码不能为空",
				variant: "destructive",
			});
			return;
		}

		if (password.length < 6) {
			toast({
				title: "密码太短",
				description: "密码至少需要6个字符",
				variant: "destructive",
			});
			return;
		}

		if (passwordStrength.score < 40) {
			toast({
				title: "密码强度不足",
				description: "请使用更强的密码(建议包含大小写字母、数字和特殊字符)",
				variant: "destructive",
			});
			return;
		}

		if (password !== confirmPassword) {
			toast({
				title: "密码不匹配",
				description: "请确保两次输入的密码相同",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);

		try {
			const { error } = await signUp(email, password, username);

			if (!error) {
				// 将注册信息存储到 localStorage,供登录页面使用
				savePendingLogin(email, password);

				router.push("/auth/login");
			}
		} catch (error) {
			console.error("注册错误:", error);
			toast({
				title: "注册失败",
				description: "发生未知错误,请稍后再试",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="border-white/40 shadow-2xl backdrop-blur-xl bg-white/95 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-white/30 to-gray-50/30 pointer-events-none" />

			<CardHeader className="relative">
				{/* 返回主页按钮 */}
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors group"
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
				<CardTitle className="text-2xl text-center text-gray-800">
					注册账号
				</CardTitle>
			</CardHeader>

			<form onSubmit={handleRegister}>
				<CardContent className="space-y-4 relative">
					{/* 用户名输入 */}
					<div className="space-y-2">
						<Label htmlFor="register-username" className="text-gray-700">
							用户名
						</Label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
							<Input
								id={usernameId}
								type="text"
								placeholder="选择一个用户名"
								value={registerForm.username}
								onChange={(e) =>
									setRegisterForm({
										...registerForm,
										username: e.target.value,
									})
								}
								className="pl-10 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
							/>
						</div>
					</div>

					{/* 邮箱输入 */}
					<div className="space-y-2">
						<Label htmlFor="register-email" className="text-gray-700">
							邮箱地址
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
							<Input
								id={emailId}
								type="email"
								placeholder="your@email.com"
								value={registerForm.email}
								onChange={(e) =>
									setRegisterForm({
										...registerForm,
										email: e.target.value,
									})
								}
								className="pl-10 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
							/>
						</div>
					</div>

					{/* 密码输入 */}
					<div className="space-y-2">
						<Label htmlFor="register-password" className="text-gray-700">
							密码
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
							<Input
								id={passwordId}
								type={showPassword ? "text" : "password"}
								placeholder="至少6个字符"
								value={registerForm.password}
								onChange={(e) =>
									setRegisterForm({
										...registerForm,
										password: e.target.value,
									})
								}
								className="pl-10 pr-10 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
							>
								{showPassword ? (
									<EyeOff className="w-4 h-4" />
								) : (
									<Eye className="w-4 h-4" />
								)}
							</button>
						</div>

						{/* 密码强度指示器 */}
						<PasswordStrengthIndicator
							password={registerForm.password}
							score={passwordStrength.score}
							label={passwordStrength.label}
							checks={passwordStrength.checks}
						/>
					</div>

					{/* 确认密码输入 */}
					<div className="space-y-2">
						<Label
							htmlFor="register-confirm-password"
							className="text-gray-700"
						>
							确认密码
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
							<Input
								id={confirmPasswordId}
								type={showConfirmPassword ? "text" : "password"}
								placeholder="再次输入密码"
								value={registerForm.confirmPassword}
								onChange={(e) =>
									setRegisterForm({
										...registerForm,
										confirmPassword: e.target.value,
									})
								}
								className="pl-10 pr-10 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
							>
								{showConfirmPassword ? (
									<EyeOff className="w-4 h-4" />
								) : (
									<Eye className="w-4 h-4" />
								)}
							</button>
						</div>
						{registerForm.confirmPassword &&
							registerForm.password !== registerForm.confirmPassword && (
								<p className="text-xs text-red-500 flex items-center gap-1">
									<X className="w-3 h-3" />
									密码不匹配
								</p>
							)}
						{registerForm.confirmPassword &&
							registerForm.password === registerForm.confirmPassword && (
								<p className="text-xs text-green-500 flex items-center gap-1">
									<Check className="w-3 h-3" />
									密码匹配
								</p>
							)}
					</div>
				</CardContent>

				<CardFooter className="flex flex-col gap-4 relative">
					<Button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
								注册中...
							</>
						) : (
							<>
								<UserPlus className="w-4 h-4 mr-2" />
								注册
							</>
						)}
					</Button>

					<p className="text-sm text-center text-gray-600">
						已有账号?{" "}
						<Link
							href="/auth/login"
							className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
						>
							立即登录
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
