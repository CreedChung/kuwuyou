import type { AuthError, Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "../lib/supabase";

interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	initialized: boolean;
	setUser: (user: User | null) => void;
	setSession: (session: Session | null) => void;
	setLoading: (loading: boolean) => void;
	initialize: () => Promise<void>;
	signUp: (
		email: string,
		password: string,
		username: string,
		toast: (options: {
			title: string;
			description: string;
			variant?: "destructive";
		}) => void,
	) => Promise<{ error: AuthError | null }>;
	signIn: (
		email: string,
		password: string,
		toast: (options: {
			title: string;
			description: string;
			variant?: "destructive";
		}) => void,
	) => Promise<{ error: AuthError | null }>;
	signInWithProvider: (
		provider: "google" | "github",
		toast: (options: {
			title: string;
			description: string;
			variant?: "destructive";
		}) => void,
	) => Promise<{ error: AuthError | null }>;
	signOut: (
		toast: (options: {
			title: string;
			description: string;
			variant?: "destructive";
		}) => void,
	) => Promise<void>;
	resetPassword: (
		email: string,
		toast: (options: {
			title: string;
			description: string;
			variant?: "destructive";
		}) => void,
	) => Promise<{ error: AuthError | null }>;
	updatePassword: (
		newPassword: string,
		toast: (options: {
			title: string;
			description: string;
			variant?: "destructive";
		}) => void,
	) => Promise<{ error: AuthError | null }>;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			session: null,
			loading: true,
			initialized: false,

			setUser: (user) => set({ user }),
			setSession: (session) => set({ session }),
			setLoading: (loading) => set({ loading }),

			initialize: async () => {
				if (get().initialized) return;

				try {
					// 获取初始会话
					const { data: { session } } = await supabase.auth.getSession();
					set({
						session,
						user: session?.user ?? null,
						loading: false,
						initialized: true,
					});

					// 监听认证状态变化
					supabase.auth.onAuthStateChange((_event, session) => {
						set({
							session,
							user: session?.user ?? null,
							loading: false,
						});
					});
				} catch (error) {
					console.error("Auth initialization error:", error);
					set({ loading: false, initialized: true });
				}
			},

	signUp: async (email, password, username, toast) => {
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						username,
					},
				},
			});

			if (error) {
				let errorMessage = "注册失败，请稍后再试";

				if (error.message.includes("User already registered")) {
					errorMessage = "该邮箱已被注册，请直接登录或使用其他邮箱";
				} else if (error.message.includes("Password should be at least")) {
					errorMessage = "密码强度不足,请使用至少6个字符";
				} else if (error.message.includes("Invalid email")) {
					errorMessage = "邮箱格式不正确，请检查后重试";
				} else if (error.message.includes("Network")) {
					errorMessage = "网络连接失败，请检查您的网络";
				} else if (error.message.includes("Database error")) {
					errorMessage = "数据库配置错误，请联系管理员检查 Supabase 设置";
				}

				toast({
					title: "注册失败",
					description: errorMessage,
					variant: "destructive",
				});
				return { error };
			}

			if (data.user) {
				toast({
					title: "注册成功",
					description: "账号创建成功，正在为您登录...",
				});
			}

			return { error: null };
		} catch (error) {
			const authError = error as AuthError;
			toast({
				title: "注册失败",
				description: "发生未知错误，请稍后再试",
				variant: "destructive",
			});
			return { error: authError };
		}
	},

	signIn: async (email, password, toast) => {
		console.log("AuthStore signIn 被调用", { email, password: "***" });
		try {
			console.log("调用 supabase.auth.signInWithPassword");
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			console.log("Supabase 登录响应:", { data, error });

			if (error) {
				console.error("Supabase 登录错误:", error);
				let errorMessage = "登录失败，请稍后再试";

				if (error.message.includes("Invalid login credentials")) {
					errorMessage = "邮箱或密码错误，请检查后重试";
				} else if (error.message.includes("Email not confirmed")) {
					errorMessage = "邮箱未验证，请先验证您的邮箱";
				} else if (error.message.includes("Too many requests")) {
					errorMessage = "登录尝试次数过多，请稍后再试";
				} else if (error.message.includes("Network")) {
					errorMessage = "网络连接失败，请检查您的网络";
				}

				toast({
					title: "登录失败",
					description: errorMessage,
					variant: "destructive",
				});
				return { error };
			}

			console.log("登录成功!", data);
			toast({
				title: "登录成功",
				description: "欢迎回来！",
			});

			return { error: null };
		} catch (error) {
			console.error("signIn catch 块捕获错误:", error);
			const authError = error as AuthError;
			toast({
				title: "登录失败",
				description: "发生未知错误，请稍后再试",
				variant: "destructive",
			});
			return { error: authError };
		}
	},

	signInWithProvider: async (provider, toast) => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${window.location.origin}/`,
				},
			});

			if (error) {
				let errorMessage = "社交登录失败，请稍后再试";

				if (error.message.includes("popup")) {
					errorMessage = "请允许浏览器弹出窗口以完成登录";
				} else if (error.message.includes("Network")) {
					errorMessage = "网络连接失败，请检查您的网络";
				}

				toast({
					title: "登录失败",
					description: errorMessage,
					variant: "destructive",
				});
				return { error };
			}

			return { error: null };
		} catch (error) {
			const authError = error as AuthError;
			toast({
				title: "登录失败",
				description: "发生未知错误，请稍后再试",
				variant: "destructive",
			});
			return { error: authError };
		}
	},

			signOut: async (toast) => {
				try {
					// 先清除本地状态
					set({ user: null, session: null });

					// 清除本地存储中的数据
					localStorage.removeItem("ai_provider");
					localStorage.removeItem("supabase.auth.token");
					localStorage.removeItem("auth-storage");

					// 调用 Supabase 登出 API
					const { error } = await supabase.auth.signOut();

					if (error) {
						console.error("Supabase 登出错误:", error);
					}

					toast({
						title: "已登出",
						description: "期待您的下次访问",
					});
				} catch (error) {
					console.error("登出错误:", error);
					set({ user: null, session: null });
					toast({
						title: "已登出",
						description: "期待您的下次访问",
					});
				}
			},

	resetPassword: async (email, toast) => {
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`,
			});

			if (error) {
				toast({
					title: "发送失败",
					description: error.message,
					variant: "destructive",
				});
				return { error };
			}

			toast({
				title: "邮件已发送",
				description: "请查看您的邮箱以重置密码",
			});

			return { error: null };
		} catch (error) {
			const authError = error as AuthError;
			toast({
				title: "发送失败",
				description: "发生未知错误，请稍后再试",
				variant: "destructive",
			});
			return { error: authError };
		}
	},

			updatePassword: async (newPassword, toast) => {
				try {
					const { error } = await supabase.auth.updateUser({
						password: newPassword,
					});

					if (error) {
						toast({
							title: "更新失败",
							description: error.message,
							variant: "destructive",
						});
						return { error };
					}

					toast({
						title: "密码已更新",
						description: "您的密码已成功更新",
					});

					return { error: null };
				} catch (error) {
					const authError = error as AuthError;
					toast({
						title: "更新失败",
						description: "发生未知错误，请稍后再试",
						variant: "destructive",
					});
					return { error: authError };
				}
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => localStorage),
			// 只持久化用户和会话数据，不持久化 loading 和 initialized 状态
			partialize: (state) => ({
				user: state.user,
				session: state.session,
			}),
		}
	)
);