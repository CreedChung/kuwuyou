"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { ConnectionsSettings } from "@/components/settings/ConnectionsSettings";
import { DataSettings } from "@/components/settings/DataSettings";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import {
	type SettingSection,
	SettingsSidebar,
} from "@/components/settings/SettingsSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useThemeStore } from "@/stores/themeStore";

export default function SettingsPage() {
	return (
		<ProtectedRoute>
			<SettingsPageContent />
		</ProtectedRoute>
	);
}

function SettingsPageContent() {
	const [activeSection, setActiveSection] = useState<SettingSection>("general");
	const { isDark, toggleDarkMode } = useThemeStore();
	const [zhipuApiKey, setZhipuApiKey] = useState("");
	const [showZhipuApiKey, setShowZhipuApiKey] = useState(false);
	const [zhipuApiKeySaved, setZhipuApiKeySaved] = useState(false);

	const [notificationsEnabled, setNotificationsEnabled] = useState(false);
	const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

	useEffect(() => {
		const savedZhipuApiKey = localStorage.getItem("zhipu_api_key");
		if (savedZhipuApiKey) {
			setZhipuApiKey(savedZhipuApiKey);
		}

		if (typeof window !== "undefined" && "Notification" in window) {
			setNotificationPermission(Notification.permission);
			setNotificationsEnabled(Notification.permission === "granted");
		}
	}, []);

	const handleSaveZhipuApiKey = () => {
		if (zhipuApiKey.trim()) {
			localStorage.setItem("zhipu_api_key", zhipuApiKey.trim());
			setZhipuApiKeySaved(true);
			setTimeout(() => setZhipuApiKeySaved(false), 2000);
		}
	};

	const handleClearZhipuApiKey = () => {
		setZhipuApiKey("");
		localStorage.removeItem("zhipu_api_key");
	};

	const handleNotificationToggle = async (checked: boolean) => {
		if (checked) {
			if (typeof window !== "undefined" && "Notification" in window) {
				const permission = await Notification.requestPermission();
				setNotificationPermission(permission);
				setNotificationsEnabled(permission === "granted");
			}
		} else {
			setNotificationsEnabled(false);
		}
	};

	const handleTestNotification = () => {
		if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
			new Notification("测试通知", {
				body: "这是一条来自库无忧助手的测试通知消息 🎉",
			});
		}
	};

	const isNotificationSupported = typeof window !== "undefined" && "Notification" in window;

	return (
		<div className="flex h-screen bg-background">
			<Toaster />

			<SettingsSidebar
				activeSection={activeSection}
				onSectionChange={setActiveSection}
			/>

			<div className="flex-1 overflow-y-auto">
				<div className="max-w-3xl mx-auto p-8">
					{activeSection === "general" && (
						<GeneralSettings
							darkMode={isDark}
							onDarkModeToggle={toggleDarkMode}
						/>
					)}

					{activeSection === "notifications" && (
						<NotificationSettings
							isSupported={isNotificationSupported}
							permission={notificationPermission}
							notificationsEnabled={notificationsEnabled}
							onNotificationToggle={handleNotificationToggle}
							onTestNotification={handleTestNotification}
						/>
					)}

					{activeSection === "connections" && (
						<ConnectionsSettings
							zhipuApiKey={zhipuApiKey}
							showZhipuApiKey={showZhipuApiKey}
							zhipuApiKeySaved={zhipuApiKeySaved}
							onZhipuApiKeyChange={setZhipuApiKey}
							onToggleShowZhipuApiKey={() =>
								setShowZhipuApiKey(!showZhipuApiKey)
							}
							onSaveZhipuApiKey={handleSaveZhipuApiKey}
							onClearZhipuApiKey={handleClearZhipuApiKey}
						/>
					)}

					{activeSection === "data" && <DataSettings />}

					{activeSection === "security" && <SecuritySettings />}

					{activeSection === "account" && <AccountSettings />}
				</div>
			</div>
		</div>
	);
}