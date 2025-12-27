import React, { useState } from 'react';
import { notificationService } from '../services/NotificationService';

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);

  // 模拟异步操作完成后的通知
  const simulateAsyncOperation = async (operationName: string, duration: number = 3000) => {
    setIsLoading(true);

    // 开始通知
    notificationService.showInfo(`${operationName} 开始执行...`);

    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, duration));

    // 模拟随机结果（80% 成功率）
    const success = Math.random() > 0.2;

    setIsLoading(false);

    // 操作完成后的完整提醒
    notificationService.completeAlert(
      `${operationName} ${success ? '成功完成' : '执行失败'}`,
      success ? 'success' : 'error',
      {
        showNotification: true,
        playSound: true,
        blinkTitle: true,
        blinkText: success ? '✅ 完成' : '❌ 失败',
        duration: 8000,
      }
    );

    return success;
  };

  // 测试各种通知类型
  const testNotifications = () => {
    notificationService.showSuccess('文件上传成功！');
    setTimeout(() => notificationService.showWarning('磁盘空间不足'), 1000);
    setTimeout(() => notificationService.showError('网络连接失败'), 2000);
    setTimeout(() => notificationService.showInfo('系统将在5分钟后维护'), 3000);
  };

  // 测试标题闪烁
  const testTitleBlink = () => {
    notificationService.startTitleBlink({
      originalTitle: document.title,
      blinkTitle: '🔔 有新消息！',
      duration: 5000,
    });
  };

  // 测试声音提醒
  const testSounds = () => {
    notificationService.playNotificationSound('success');
    setTimeout(() => notificationService.playNotificationSound('warning'), 1000);
    setTimeout(() => notificationService.playNotificationSound('error'), 2000);
    setTimeout(() => notificationService.playNotificationSound('info'), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔔 通知功能演示
          </h1>
          <p className="text-lg text-gray-600">
            操作完成后通过浏览器发送提醒通知
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 异步操作演示 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🚀 异步操作测试
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              模拟真实的异步操作，完成后会自动发送通知
            </p>
            <div className="space-y-3">
              <button
                onClick={() => simulateAsyncOperation('文件上传', 2000)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '处理中...' : '📤 测试文件上传'}
              </button>
              <button
                onClick={() => simulateAsyncOperation('数据处理', 3000)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '处理中...' : '📊 测试数据处理'}
              </button>
              <button
                onClick={() => simulateAsyncOperation('AI模型分析', 4000)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '处理中...' : '🤖 测试AI分析'}
              </button>
            </div>
          </div>

          {/* 通知类型演示 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📢 通知类型测试
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              测试不同类型的桌面通知
            </p>
            <div className="space-y-3">
              <button
                onClick={testNotifications}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                🎨 测试所有通知类型
              </button>
              <button
                onClick={() => notificationService.showCustomNotification({
                  title: '🎉 自定义通知',
                  body: '这是一个完全自定义的通知',
                  tag: 'custom-test',
                })}
                className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                ⚙️ 自定义通知
              </button>
            </div>
          </div>

          {/* 视觉提醒演示 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              👁️ 视觉提醒测试
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              测试标题闪烁等视觉提醒功能
            </p>
            <div className="space-y-3">
              <button
                onClick={testTitleBlink}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                📢 开始标题闪烁
              </button>
              <button
                onClick={() => notificationService.stopTitleBlink()}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                ⏹️ 停止闪烁
              </button>
            </div>
          </div>

          {/* 声音提醒演示 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔊 声音提醒测试
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              测试不同类型的提示音
            </p>
            <div className="space-y-3">
              <button
                onClick={testSounds}
                className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                🔊 测试所有声音
              </button>
              <button
                onClick={() => notificationService.playNotificationSound('success')}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                ✅ 成功声音
              </button>
              <button
                onClick={() => notificationService.playNotificationSound('error')}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                ❌ 错误声音
              </button>
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            💡 功能说明
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                🔔 桌面通知
              </h3>
              <p className="text-sm text-gray-600">
                原生浏览器通知，即使在后台运行也能收到提醒，支持点击交互。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                📢 标题闪烁
              </h3>
              <p className="text-sm text-gray-600">
                浏览器标签页标题闪烁提示，特别适合长时间操作，即使切换标签页也能看到。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                🔊 声音提醒
              </h3>
              <p className="text-sm text-gray-600">
                多种提示音类型，不依赖通知权限即可播放，适用于各种场景。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                🎯 智能组合
              </h3>
              <p className="text-sm text-gray-600">
                可自由组合多种提醒方式，为不同类型的操作提供最佳的用户体验。
              </p>
            </div>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📖 使用提示
          </h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• 首次使用可能需要授权通知权限</li>
            <li>• 异步操作完成后会自动发送完整提醒</li>
            <li>• 支持成功、警告、错误、信息四种通知类型</li>
            <li>• 标题闪烁会在指定时间后自动停止</li>
            <li>• 声音提醒在任何时候都可以播放</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
