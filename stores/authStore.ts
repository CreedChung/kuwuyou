import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 简化的用户类型
interface User {
	id: string;
	email: string;
	username?: string;
	avatarUrl?: string;
	role?: "user" | "admin";
}

interface AuthError {
	message: string;
	code?: string;
}

interface AuthState {
	user: User | null;
	loading: boolean;
	initialized: boolean;
	setUser: (user: User | null) => void;
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
			loading: true,
			initialized: false,

			setUser: (user) => set({ user }),
			setLoading: (loading) => set({ loading }),

			initialize: async () => {
				if (get().initialized) return;

				try {
					// 从 localStorage 恢复用户状态
					const storedUser = localStorage.getItem("auth-storage");
					if (storedUser) {
						const { state } = JSON.parse(storedUser);
						set({
							user: state.user ?? null,
							loading: false,
							initialized: true,
						});
					} else {
						set({ loading: false, initialized: true });
					}
				} catch (error) {
					console.error("Auth initialization error:", error);
					set({ loading: false, initialized: true });
				}
			},

			signUp: async (email, password, username, toast) => {
				try {
					// TODO: 实现实际的注册 API 调用
					// 这里需要调用你的后端 API
					const response = await fetch("/api/auth/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password, username }),
					});

					if (!response.ok) {
						const error = await response.json();
						toast({
							title: "注册失败",
							description: error.error || error.message || "注册失败，请稍后再试",
							variant: "destructive",
						});
						return { error: { message: error.error || error.message } };
					}

					const data = await response.json();
					set({ user: data.user });

					toast({
						title: "注册成功",
						description: "账号创建成功，正在为您登录...",
					});

					return { error: null };
				} catch (error) {
					toast({
						title: "注册失败",
						description: "发生未知错误，请稍后再试",
						variant: "destructive",
					});
					return { error: { message: "Unknown error" } };
				}
			},

			signIn: async (email, password, toast) => {
				console.log("AuthStore signIn 被调用", { email, password: "***" });
				try {
					// TODO: 实现实际的登录 API 调用
					// 这里需要调用你的后端 API
					const response = await fetch("/api/auth/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					});

					if (!response.ok) {
						const error = await response.json();
						let errorMessage = "登录失败，请稍后再试";

						if (error.code === "INVALID_CREDENTIALS") {
							errorMessage = "邮箱或密码错误，请检查后重试";
						}

						toast({
							title: "登录失败",
							description: errorMessage,
							variant: "destructive",
						});
						return { error: { message: error.message } };
					}

					const data = await response.json();
					set({ user: data.user });
	
					// 如果用户是管理员，设置管理员权限标识
					if (data.user?.role === 'admin') {
						localStorage.setItem('admin_auth', 'true');
					} else {
						localStorage.removeItem('admin_auth');
					}
	
					console.log("登录成功!", data);
					toast({
						title: "登录成功",
						description: "欢迎回来！",
					});
	
					return { error: null };
				} catch (error) {
					console.error("signIn catch 块捕获错误:", error);
					toast({
						title: "登录失败",
						description: "发生未知错误，请稍后再试",
						variant: "destructive",
					});
					return { error: { message: "Unknown error" } };
				}
			},

			signInWithProvider: async (provider, toast) => {
				try {
					// TODO: 实现 OAuth 登录
					toast({
						title: "功能开发中",
						description: "OAuth 登录功能即将上线",
						variant: "destructive",
					});
					return { error: { message: "Not implemented" } };
				} catch (error) {
					toast({
						title: "登录失败",
						description: "发生未知错误，请稍后再试",
						variant: "destructive",
					});
					return { error: { message: "Unknown error" } };
				}
			},

			signOut: async (toast) => {
				try {
					// 清除本地状态
					set({ user: null });

					// 清除本地存储中的数据
					localStorage.removeItem("ai_provider");
					localStorage.removeItem("auth-storage");
					localStorage.removeItem("admin_auth");

					toast({
						title: "已登出",
						description: "期待您的下次访问",
					});
				} catch (error) {
					console.error("登出错误:", error);
					set({ user: null });
					toast({
						title: "已登出",
						description: "期待您的下次访问",
					});
				}
			},

			resetPassword: async (email, toast) => {
				try {
					// TODO: 实现密码重置 API 调用
					toast({
						title: "功能开发中",
						description: "密码重置功能即将上线",
						variant: "destructive",
					});
					return { error: { message: "Not implemented" } };
				} catch (error) {
					toast({
						title: "发送失败",
						description: "发生未知错误，请稍后再试",
						variant: "destructive",
					});
					return { error: { message: "Unknown error" } };
				}
			},

			updatePassword: async (newPassword, toast) => {
				try {
					// TODO: 实现密码更新 API 调用
					toast({
						title: "功能开发中",
						description: "密码更新功能即将上线",
						variant: "destructive",
					});
					return { error: { message: "Not implemented" } };
				} catch (error) {
					toast({
						title: "更新失败",
						description: "发生未知错误，请稍后再试",
						variant: "destructive",
					});
					return { error: { message: "Unknown error" } };
				}
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => localStorage),
			// 只持久化用户数据，不持久化 loading 和 initialized 状态
			partialize: (state) => ({
				user: state.user,
			}),
		}
	)
);