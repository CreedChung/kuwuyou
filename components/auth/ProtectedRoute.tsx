"use client";

import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
	requireAdmin?: boolean;
}

export function ProtectedRoute({
	children,
	redirectTo = "/auth/login",
	requireAdmin = false,
}: ProtectedRouteProps) {
	const router = useRouter();
	const { user, loading, initialized } = useAuthStore();

	useEffect(() => {
		if (!initialized || loading) {
			return;
		}

		if (!user) {
			router.navigate({ to: redirectTo });
			return;
		}

		if (requireAdmin && user.role !== 'admin') {
			router.navigate({ to: '/chat' });
		}
	}, [user, loading, initialized, router, redirectTo, requireAdmin]);

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

	if (requireAdmin && user.role !== 'admin') {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p className="text-muted-foreground">无权限访问</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
