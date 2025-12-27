/**
 * 通知功能的React Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/NotificationService';

export interface UseNotificationOptions {
  autoRequestPermission?: boolean;
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export const useNotification = (options: UseNotificationOptions = {}) => {
  const { autoRequestPermission = true, onPermissionGranted, onPermissionDenied } = options;

  const [permission, setPermission] = useState<NotificationPermission>(
    notificationService.getPermissionStatus()
  );
  const [isSupported] = useState(notificationService.isSupported());

  // 请求权限
  const requestPermission = useCallback(async () => {
    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);

      if (newPermission === 'granted' && onPermissionGranted) {
        onPermissionGranted();
      } else if (newPermission === 'denied' && onPermissionDenied) {
        onPermissionDenied();
      }

      return newPermission;
    } catch (error) {
      console.error('请求通知权限失败:', error);
      if (onPermissionDenied) {
        onPermissionDenied();
      }
      throw error;
    }
  }, [onPermissionGranted, onPermissionDenied]);

  // 自动请求权限
  useEffect(() => {
    if (autoRequestPermission && permission === 'default') {
      requestPermission().catch(() => {
        // 静默失败，不影响用户体验
      });
    }
  }, [autoRequestPermission, permission, requestPermission]);

  // 通知方法
  const notify = useCallback({
    success: (message: string, options = {}) => {
      return notificationService.showSuccess(message, options);
    },
    error: (message: string, options = {}) => {
      return notificationService.showError(message, options);
    },
    warning: (message: string, options = {}) => {
      return notificationService.showWarning(message, options);
    },
    info: (message: string, options = {}) => {
      return notificationService.showInfo(message, options);
    },
    custom: (options: any) => {
      return notificationService.showNotification(options);
    },
    complete: (
      message: string,
      type: 'success' | 'error' | 'warning' | 'info' = 'info',
      alertOptions = {}
    ) => {
      return notificationService.completeAlert(message, type, alertOptions);
    }
  }, []);

  // 标题闪烁
  const blinkTitle = useCallback((
    blinkTitle: string,
    options: {
      interval?: number;
      duration?: number;
      onComplete?: () => void;
    } = {}
  ) => {
    const { interval = 1000, duration = 10000, onComplete } = options;
    return notificationService.startTitleBlink({
      originalTitle: document.title,
      blinkTitle,
      interval,
      duration,
      onComplete
    });
  }, []);

  const stopBlink = useCallback(() => {
    notificationService.stopTitleBlink();
  }, []);

  // 播放声音
  const playSound = useCallback((
    type: 'success' | 'error' | 'warning' | 'info' | 'custom' = 'info',
    customUrl?: string
  ) => {
    notificationService.playNotificationSound(type, customUrl);
  }, []);

  // 检查状态
  const canNotify = isSupported && permission === 'granted';
  const isBlinking = notificationService.getIsBlinking();
  const originalTitle = notificationService.getOriginalTitle();

  return {
    // 状态
    permission,
    isSupported,
    canNotify,
    isBlinking,
    originalTitle,

    // 方法
    requestPermission,
    notify,
    blinkTitle,
    stopBlink,
    playSound,
  };
};

// 默认导出hook
export default useNotification;
