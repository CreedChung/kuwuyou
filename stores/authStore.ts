import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 简化的用户类型
interface User {
	id: string;
	email: string;
	username?: string;
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
					console.log("正在初始化认证状态...");

					// 从 localStorage 恢复用户状态
					const storedUser = localStorage.getItem("auth-storage");
					if (storedUser) {
						try {
							const { state } = JSON.parse(storedUser);
							console.log("从localStorage恢复的用户状态:", state);

							if (state?.user) {
								// 验证用户数据完整性
								const user = state.user;
								if (user.id && user.email) {
									set({
										user: user,
										loading: false,
										initialized: true,
									});
									console.log("认证状态恢复成功");
								} else {
									console.warn("用户数据不完整，清除存储");
									localStorage.removeItem("auth-storage");
									set({ user: null, loading: false, initialized: true });
								}
							} else {
								set({ user: null, loading: false, initialized: true });
							}
						} catch (parseError) {
							console.error("解析localStorage数据失败:", parseError);
							localStorage.removeItem("auth-storage");
							set({ user: null, loading: false, initialized: true });
						}
					} else {
						console.log("没有找到存储的用户数据");
						set({ user: null, loading: false, initialized: true });
					}
				} catch (error) {
					console.error("Auth initialization error:", error);
					set({ user: null, loading: false, initialized: true });
				}
			},

			signUp: async (email, password, username, toast) => {
				try {
					console.log("正在调用注册API...", { email, username });

					const response = await fetch("/api/auth/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password, username }),
					});

					console.log("注册API响应状态:", response.status);

					if (!response.ok) {
						const error = await response.json();
						console.error("注册API错误响应:", error);

						let errorMessage = "注册失败，请稍后再试";
						if (response.status === 409) {
							errorMessage = error.error || "邮箱或用户名已被使用";
						} else if (response.status === 400) {
							errorMessage = error.error || "请求数据格式不正确";
						}

						toast({
							title: "注册失败",
							description: errorMessage,
							variant: "destructive",
						});
						return { error: { message: errorMessage } };
					}

					const data = await response.json();
					console.log("注册API成功响应:", data);

					// 检查返回数据结构
					if (!data.user) {
						console.error("注册API返回数据缺少user字段:", data);
						toast({
							title: "注册失败",
							description: "服务器返回数据异常",
							variant: "destructive",
						});
						return { error: { message: "Invalid response data" } };
					}

					// 设置用户状态
					set({ user: data.user });

					toast({
						title: "注册成功",
						description: "账号创建成功，正在为您登录...",
					});

					return { error: null };
				} catch (error) {
					console.error("注册过程捕获错误:", error);

					let errorMessage = "发生未知错误，请稍后再试";
					if (error instanceof TypeError && error.message.includes('fetch')) {
						errorMessage = "网络连接失败，请检查网络后重试";
					}

					toast({
						title: "注册失败",
						description: errorMessage,
						variant: "destructive",
					});
					return { error: { message: errorMessage } };
				}
			},

			signIn: async (email, password, toast) => {
				console.log("AuthStore signIn 被调用", { email, password: "***" });
				try {
					console.log("正在调用登录API...");

					const response = await fetch("/api/auth/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					});

					console.log("登录API响应状态:", response.status);

					if (!response.ok) {
						const error = await response.json();
						console.error("登录API错误响应:", error);

						let errorMessage = "登录失败，请稍后再试";

						if (response.status === 401) {
							errorMessage = "邮箱或密码错误，请检查后重试";
						} else if (response.status === 400) {
							errorMessage = error.error || "请求数据格式不正确";
						} else if (response.status >= 500) {
							errorMessage = "服务器错误，请稍后再试";
						}

						toast({
							title: "登录失败",
							description: errorMessage,
							variant: "destructive",
						});
						return { error: { message: errorMessage, code: response.status.toString() } };
					}

					const data = await response.json();
					console.log("登录API成功响应:", data);

					// 检查返回数据结构
					if (!data.user) {
						console.error("API返回数据缺少user字段:", data);
						toast({
							title: "登录失败",
							description: "服务器返回数据异常",
							variant: "destructive",
						});
						return { error: { message: "Invalid response data" } };
					}

					// 设置用户状态
					set({ user: data.user });

					// 如果用户是管理员，设置管理员权限标识
					if (data.user?.role === 'admin') {
						localStorage.setItem('admin_auth', 'true');
					} else {
						localStorage.removeItem('admin_auth');
					}

					console.log("登录成功! 用户数据:", data.user);
					toast({
						title: "登录成功",
						description: "欢迎回来！",
					});

					return { error: null };
				} catch (error) {
					console.error("signIn catch 块捕获错误:", error);

					let errorMessage = "发生未知错误，请稍后再试";
					if (error instanceof TypeError && error.message.includes('fetch')) {
						errorMessage = "网络连接失败，请检查网络后重试";
					}

					toast({
						title: "登录失败",
						description: errorMessage,
						variant: "destructive",
					});
					return { error: { message: errorMessage } };
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