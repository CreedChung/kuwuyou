import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notification";

/**
 * 浏览器通知 Hook
 * 提供通知权限管理和通知显示功能
 */
export function useNotification() {
	const [permission, setPermission] = useState<NotificationPermission>(
		notificationService.getPermission(),
	);
	const [isSupported] = useState(notificationService.isSupported());

	useEffect(() => {
		// 组件挂载时更新权限状态
		notificationService.updatePermission();
		setPermission(notificationService.getPermission());

		// 监听可见性变化，更新权限状态
		const handleVisibilityChange = () => {
			notificationService.updatePermission();
			setPermission(notificationService.getPermission());
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	/**
	 * 请求通知权限
	 */
	const requestPermission = useCallback(async () => {
		const granted = await notificationService.requestPermission();
		setPermission(notificationService.getPermission());

		if (granted) {
			toast({
				title: "通知权限已授予",
				description: "您将收到重要的消息提醒",
			});
		} else {
			toast({
				title: "通知权限被拒绝",
				description: "您将无法收到桌面通知",
				variant: "destructive",
			});
		}

		return granted;
	}, []);

	/**
	 * 显示通知
	 */
	const showNotification = useCallback(
		async (title: string, options?: NotificationOptions) => {
			try {
				const notification = await notificationService.showNotification(
					title,
					options,
				);
				if (notification) {
					// 添加点击事件处理
					notification.onclick = () => {
						window.focus();
						notification.close();
					};
				}
				return notification;
			} catch (error) {
				console.error("显示通知失败:", error);
				toast({
					title: "显示通知失败",
					description: "请检查浏览器通知权限设置",
					variant: "destructive",
				});
				return null;
			}
		},
		[],
	);

	return {
		permission,
		isSupported,
		requestPermission,
		showNotification,
	};
}
