"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export function ProtectedRoute({
	children,
	redirectTo = "/auth/login",
}: ProtectedRouteProps) {
	const router = useRouter();
	const { user, loading, initialized } = useAuthStore();

	useEffect(() => {
		// 等待认证状态初始化完成
		if (!initialized || loading) {
			return;
		}

		// 如果用户未登录，重定向到登录页
		if (!user) {
			router.push(redirectTo);
		}
	}, [user, loading, initialized, router, redirectTo]);

	// 在加载或未初始化时显示加载状态
	if (!initialized || loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">加载中...</p>
				</div>
			</div>
		);
	}

	// 如果用户未登录，不渲染内容（即将重定向）
	if (!user) {
		return null;
	}

	// 用户已登录，渲染子组件
	return <>{children}</>;
}
