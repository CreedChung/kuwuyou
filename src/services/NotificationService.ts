/**
 * 浏览器通知服务
 * 支持桌面通知、标题闪烁、声音提醒等功能
 */

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  onClick?: () => void;
  onClose?: () => void;
  onError?: () => void;
}

export interface TitleBlinkOptions {
  originalTitle: string;
  blinkTitle: string;
  interval?: number;
  duration?: number;
  onComplete?: () => void;
}

class NotificationService {
  private originalTitle: string =
    typeof document !== "undefined" ? document.title : "";
  private titleBlinkInterval: NodeJS.Timeout | null = null;
  private titleBlinkCount: number = 0;
  private isBlinking: boolean = false;

  /**
   * 检查是否支持通知
   */
  isSupported(): boolean {
    return "Notification" in window;
  }

  /**
   * 获取通知权限状态
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return "denied";
    }
    return Notification.permission;
  }

  /**
   * 请求通知权限
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error("浏览器不支持通知功能");
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission === "denied") {
      throw new Error("通知权限被拒绝，请在浏览器设置中手动启用");
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * 发送桌面通知
   */
  showNotification(options: NotificationOptions): Notification | null {
    if (!this.isSupported()) {
      console.warn("浏览器不支持通知功能");
      return null;
    }

    if (Notification.permission !== "granted") {
      console.warn("没有通知权限");
      return null;
    }

    const notification = new Notification(options.title, {
      body: options.body || "",
      icon: options.icon || "/favicon.ico",
      requireInteraction: options.requireInteraction ?? false,
      silent: options.silent ?? false,
      tag: options.tag,
    });

    // 设置事件监听器
    if (options.onClick) {
      notification.onclick = options.onClick;
    }
    if (options.onClose) {
      notification.onclose = options.onClose;
    }
    if (options.onError) {
      notification.onerror = options.onError;
    }

    // 自动关闭通知（非交互式）
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    return notification;
  }

  /**
   * 成功通知
   */
  showSuccess(
    message: string,
    options: Partial<NotificationOptions> = {},
  ): Notification | null {
    return this.showNotification({
      title: "✅ 操作成功",
      body: message,
      icon: "/favicon.ico",
      tag: "success",
      ...options,
    });
  }

  /**
   * 错误通知
   */
  showError(
    message: string,
    options: Partial<NotificationOptions> = {},
  ): Notification | null {
    return this.showNotification({
      title: "❌ 操作失败",
      body: message,
      icon: "/favicon.ico",
      tag: "error",
      requireInteraction: true,
      ...options,
    });
  }

  /**
   * 警告通知
   */
  showWarning(
    message: string,
    options: Partial<NotificationOptions> = {},
  ): Notification | null {
    return this.showNotification({
      title: "⚠️ 注意",
      body: message,
      icon: "/favicon.ico",
      tag: "warning",
      ...options,
    });
  }

  /**
   * 信息通知
   */
  showInfo(
    message: string,
    options: Partial<NotificationOptions> = {},
  ): Notification | null {
    return this.showNotification({
      title: "ℹ️ 信息",
      body: message,
      icon: "/favicon.ico",
      tag: "info",
      ...options,
    });
  }

  /**
   * 标题闪烁提醒
   */
  startTitleBlink(options: TitleBlinkOptions): void {
    // 如果正在闪烁，先停止
    this.stopTitleBlink();

    const {
      originalTitle,
      blinkTitle,
      interval = 1000,
      duration = 10000,
      onComplete,
    } = options;

    this.originalTitle = originalTitle || this.originalTitle;
    this.isBlinking = true;
    this.titleBlinkCount = 0;

    this.titleBlinkInterval = setInterval(() => {
      document.title =
        document.title === this.originalTitle ? blinkTitle : this.originalTitle;
      this.titleBlinkCount++;

      // 达到持续时间后停止
      if (this.titleBlinkCount * interval >= duration) {
        this.stopTitleBlink();
        if (onComplete) onComplete();
      }
    }, interval);
  }

  /**
   * 停止标题闪烁
   */
  stopTitleBlink(): void {
    if (this.titleBlinkInterval) {
      clearInterval(this.titleBlinkInterval);
      this.titleBlinkInterval = null;
    }
    document.title = this.originalTitle;
    this.isBlinking = false;
    this.titleBlinkCount = 0;
  }

  /**
   * 播放提示音
   */
  playNotificationSound(
    type: "success" | "error" | "warning" | "info" | "custom" = "info",
    customUrl?: string,
  ): void {
    try {
      const audio = new Audio();

      switch (type) {
        case "success":
          audio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAUG";
          break;
        case "error":
          audio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAUG";
          break;
        case "warning":
          audio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAUG";
          break;
        case "info":
          audio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAUG";
          break;
        case "custom":
          if (customUrl) {
            audio.src = customUrl;
          }
          break;
      }

      audio.volume = 0.5;
      audio.play().catch((err) => console.log("音频播放失败:", err));
    } catch (error) {
      console.log("音频播放出错:", error);
    }
  }

  /**
   * 自定义通知
   */
  showCustomNotification(options: NotificationOptions): Notification | null {
    return this.showNotification(options);
  }

  /**
   * 完整提醒（通知 + 标题闪烁 + 声音）
   */
  completeAlert(
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    options: {
      duration?: number;
      showNotification?: boolean;
      playSound?: boolean;
      blinkTitle?: boolean;
      blinkText?: string;
    } = {},
  ): void {
    const {
      duration = 10000,
      showNotification = true,
      playSound = true,
      blinkTitle = true,
      blinkText = "🔔 新消息",
    } = options;

    // 发送桌面通知
    if (showNotification) {
      this.showNotification({
        title: `${type === "success" ? "✅" : type === "error" ? "❌" : type === "warning" ? "⚠️" : "ℹ️"} 操作完成`,
        body: message,
        tag: `complete-${type}`,
      });
    }

    // 播放提示音
    if (playSound) {
      this.playNotificationSound(type);
    }

    // 标题闪烁
    if (blinkTitle) {
      this.startTitleBlink({
        originalTitle: this.originalTitle,
        blinkTitle: blinkText,
        duration: duration,
      });
    }
  }

  /**
   * 检查当前是否正在闪烁
   */
  getIsBlinking(): boolean {
    return this.isBlinking;
  }

  /**
   * 获取原始标题
   */
  getOriginalTitle(): string {
    return this.originalTitle;
  }
}

// 导出单例
export const notificationService = new NotificationService();

// 导出类以便测试
export { NotificationService };
