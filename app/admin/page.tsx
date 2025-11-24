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
import { SecuritySection } from "@/components/admin/SecuritySection";
import { SystemSection } from "@/components/admin/SystemSection";
import { UsersSection } from "@/components/admin/UsersSection";
import { useAdminStore } from "@/stores/adminStore";

export default function AdminPage() {
	const router = useRouter();
	const { isAdmin, setAdminUser } = useAdminStore();
	const [loading, setLoading] = useState(true);
	const [activeSection, setActiveSection] = useState<AdminSection>("overview");
	const [searchQuery, setSearchQuery] = useState("");
	const [maintenanceMode, setMaintenanceMode] = useState(false);
	const [autoBackup, setAutoBackup] = useState(true);
	const [twoFactorRequired, setTwoFactorRequired] = useState(false);

	useEffect(() => {
		// 检查管理员权限
		const checkAdminAuth = async () => {
			try {
				// 这里应该调用验证 API
				// 目前使用简化的逻辑
				const hasAuth = localStorage.getItem('admin_auth') === 'true';
				
				if (!hasAuth) {
					// 如果没有权限，重定向到登录页
					router.push('/auth/login?redirect=/admin');
					return;
				}

				// 设置管理员信息
				setAdminUser({
					id: '1',
					name: '管理员',
					email: 'admin@example.com',
					role: 'admin',
				});
			} catch (error) {
				console.error('验证管理员权限失败:', error);
				router.push('/auth/login?redirect=/admin');
			} finally {
				setLoading(false);
			}
		};

		checkAdminAuth();
	}, [router, setAdminUser]);

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

	if (!isAdmin) {
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
							maintenanceMode={maintenanceMode}
							autoBackup={autoBackup}
							onMaintenanceModeChange={setMaintenanceMode}
							onAutoBackupChange={setAutoBackup}
						/>
					)}

					{activeSection === "security" && (
						<SecuritySection
							twoFactorRequired={twoFactorRequired}
							onTwoFactorRequiredChange={setTwoFactorRequired}
						/>
					)}
				</div>
			</div>
		</div>
	);
}