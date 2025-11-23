/**
 * 浏览器通知服务
 * 提供浏览器原生通知功能的封装
 */
class NotificationService {
	private permission: NotificationPermission = "default";

	constructor() {
		if ("Notification" in window) {
			this.permission = Notification.permission;
		}
	}

	/**
	 * 请求通知权限
	 */
	async requestPermission(): Promise<boolean> {
		if (!("Notification" in window)) {
			console.warn("此浏览器不支持桌面通知");
			return false;
		}

		if (this.permission === "granted") {
			return true;
		}

		const permission = await Notification.requestPermission();
		this.permission = permission;
		return permission === "granted";
	}

	/**
	 * 显示通知
	 */
	async showNotification(
		title: string,
		options?: NotificationOptions,
	): Promise<Notification | null> {
		if (!("Notification" in window)) {
			console.warn("此浏览器不支持桌面通知");
			return null;
		}

		if (this.permission !== "granted") {
			const granted = await this.requestPermission();
			if (!granted) {
				console.warn("用户拒绝了通知权限");
				return null;
			}
		}

		const notification = new Notification(title, {
			icon: "/logo192.png",
			badge: "/logo192.png",
			...options,
		});

		return notification;
	}

	/**
	 * 检查是否支持通知
	 */
	isSupported(): boolean {
		return "Notification" in window;
	}

	/**
	 * 获取当前权限状态
	 */
	getPermission(): NotificationPermission {
		return this.permission;
	}

	/**
	 * 更新权限状态（用于监听权限变化）
	 */
	updatePermission(): void {
		if ("Notification" in window) {
			this.permission = Notification.permission;
		}
	}
}

export const notificationService = new NotificationService();
