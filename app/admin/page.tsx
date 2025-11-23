"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";
import {
	type AdminSection,
	AdminSidebar,
} from "@/components/admin/AdminSidebar";
import { AnalyticsSection } from "@/components/admin/AnalyticsSection";
import { ContentSection } from "@/components/admin/ContentSection";
import { OverviewSection } from "@/components/admin/OverviewSection";
import { SecuritySection } from "@/components/admin/SecuritySection";
import { SystemSection } from "@/components/admin/SystemSection";
import { UsersSection } from "@/components/admin/UsersSection";

export default function AdminPage() {
	const [activeSection, setActiveSection] = useState<AdminSection>("overview");
	const [searchQuery, setSearchQuery] = useState("");
	const [maintenanceMode, setMaintenanceMode] = useState(false);
	const [autoBackup, setAutoBackup] = useState(true);
	const [twoFactorRequired, setTwoFactorRequired] = useState(false);

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

					{activeSection === "content" && <ContentSection />}

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