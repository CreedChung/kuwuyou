"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Shield, Loader2 } from "lucide-react";
import {
	type AdminSection,
	AdminSidebar,
} from "@/components/admin/AdminSidebar";
import { AnalyticsSection } from "@/components/admin/AnalyticsSection";
import { OverviewSection } from "@/components/admin/OverviewSection";
import { SystemSection } from "@/components/admin/SystemSection";
import { UsersSection } from "@/components/admin/UsersSection";
import { useAuthStore } from "@/stores/authStore";

export function AdminPageContent() {
	const navigate = useNavigate();
	const { user, initialized } = useAuthStore();
	const [loading, setLoading] = useState(true);
	const [activeSection, setActiveSection] = useState<AdminSection>("overview");

	useEffect(() => {
		const checkAdminAuth = async () => {
			if (!initialized) {
				return;
			}

			try {
				// 检查用户是否登录
				if (!user) {
					navigate({ to: "/auth/login" });
					return;
				}

				// 检查用户角色
				if (user.role !== "admin") {
					// 不是管理员，重定向到首页
					navigate({ to: "/" });
					return;
				}

				setLoading(false);
			} catch (error) {
				console.error("管理员权限检查失败:", error);
				navigate({ to: "/" });
			}
		};

		checkAdminAuth();
	}, [navigate, user, initialized]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
					<p className="text-gray-600">验证管理员权限中...</p>
				</div>
			</div>
		);
	}

	const renderSection = () => {
		switch (activeSection) {
			case "overview":
				return <OverviewSection />;
			case "users":
				return <UsersSection />;
			case "analytics":
				return <AnalyticsSection />;
			case "system":
				return <SystemSection />;
			default:
				return <OverviewSection />;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="flex">
				<AdminSidebar
					activeSection={activeSection}
					onSectionChange={setActiveSection}
				/>
				<main className="flex-1 p-8">
					<div className="max-w-7xl mx-auto">
						<div className="flex items-center gap-3 mb-8">
							<Shield className="h-8 w-8 text-blue-600" />
							<h1 className="text-3xl font-bold text-gray-900">管理后台</h1>
						</div>
						{renderSection()}
					</div>
				</main>
			</div>
		</div>
	);
}
