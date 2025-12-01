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
		if (!initialized || loading) {
			return;
		}

		if (!user) {
			router.push(redirectTo);
		}
	}, [user, loading, initialized, router, redirectTo]);

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

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">正在跳转...</p>
				</div>
			</div>
		);
	}

	// 用户已登录，渲染子组件
	return <>{children}</>;
}
