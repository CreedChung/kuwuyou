/**
 * 浏览器通知服务
 * 提供浏览器原生通知功能的封装
 */
class NotificationService {
	private permission: NotificationPermission = "default";
	private isClient: boolean;

	constructor() {
		this.isClient = typeof window !== "undefined" && "Notification" in window;
		if (this.isClient) {
			this.permission = Notification.permission;
		}
	}

	/**
	 * 请求通知权限
	 */
	async requestPermission(): Promise<boolean> {
		if (!this.isClient) {
			console.warn("浏览器通知仅支持客户端");
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
		if (!this.isClient) {
			console.warn("浏览器通知仅支持客户端");
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
		return this.isClient;
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
		if (this.isClient) {
			this.permission = Notification.permission;
		}
	}
}

export const notificationService = new NotificationService();
