"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";
import {
	type AdminSection,
	AdminSidebar,
} from "@/components/admin/AdminSidebar";
import { AnalyticsSection } from "@/components/admin/AnalyticsSection";
import { OverviewSection } from "@/components/admin/OverviewSection";
import { SystemSection } from "@/components/admin/SystemSection";
import { UsersSection } from "@/components/admin/UsersSection";
import { useAuthStore } from "@/stores/authStore";

export default function AdminPage() {
	const router = useRouter();
	const { user, initialized } = useAuthStore();
	const [loading, setLoading] = useState(true);
	const [activeSection, setActiveSection] = useState<AdminSection>("overview");
	const [searchQuery, setSearchQuery] = useState("");
	const [autoBackup, setAutoBackup] = useState(true);

	useEffect(() => {
		// 检查管理员权限
		const checkAdminAuth = async () => {
			try {
				// 等待认证初始化完成
				if (!initialized) {
					return;
				}

				// 检查用户是否登录
				if (!user) {
					router.push("/auth/login");
					return;
				}

				// 检查用户角色，只有 admin 可以访问
				if (user.role !== "admin") {
					// 不是管理员，重定向到首页
					router.push("/");
					return;
				}
				// 是管理员，放行
			} catch (error) {
				console.error("验证管理员权限失败:", error);
			} finally {
				setLoading(false);
			}
		};

		checkAdminAuth();
	}, [router, user, initialized]);

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-background">
				<div className="text-center">
					<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
					<p className="text-sm text-muted-foreground">验证管理员权限...</p>
				</div>
			</div>
		);
	}

	// 检查用户是否是管理员
	if (!user || user.role !== "admin") {
		return (
			<div className="flex h-screen items-center justify-center bg-background">
				<div className="text-center">
					<Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<h1 className="text-2xl font-bold mb-2">访问被拒绝</h1>
					<p className="text-sm text-muted-foreground">您没有权限访问此页面</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-background">
			<AdminSidebar
				activeSection={activeSection}
				onSectionChange={setActiveSection}
			/>

			<div className="flex-1 overflow-y-auto">
				<div className="max-w-6xl mx-auto p-8">
					{activeSection === "overview" && <OverviewSection />}

					{activeSection === "users" && (
						<UsersSection
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
						/>
					)}

					{activeSection === "analytics" && <AnalyticsSection />}

					{activeSection === "system" && (
						<SystemSection
							autoBackup={autoBackup}
							onAutoBackupChange={setAutoBackup}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
