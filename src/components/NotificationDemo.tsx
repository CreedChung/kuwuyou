/**
 * 通知功能演示组件
 */

import React, { useState } from 'react';
import useNotification from '../hooks/useNotification';

interface NotificationDemoProps {
  onOperationComplete?: (success: boolean, message: string) => void;
}

const NotificationDemo: React.FC<NotificationDemoProps> = ({ onOperationComplete }) => {
  const {
    permission,
    isSupported,
    canNotify,
    isBlinking,
    originalTitle,
    requestPermission,
    notify,
    blinkTitle,
    stopBlink,
    playSound,
  } = useNotification();

  const [isLoading, setIsLoading] = useState(false);

  // 模拟异步操作
  const simulateAsyncOperation = async (operationName: string, duration: number = 2000): Promise<boolean> => {
    setIsLoading(true);

    // 模拟操作开始的通知
    notify.info(`${operationName}开始执行...`);

    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, duration));

    // 模拟操作结果（随机成功/失败）
    const success = Math.random() > 0.3; // 70%成功率

    setIsLoading(false);

    // 操作完成后的完整提醒
    notify.complete(
      `${operationName}${success ? '成功完成' : '执行失败'}`,
      success ? 'success' : 'error',
      {
        showNotification: true,
        playSound: true,
        blinkTitle: true,
        blinkText: success ? '✅ 完成' : '❌ 失败',
        duration: 8000,
      }
    );

    // 回调通知父组件
    if (onOperationComplete) {
      onOperationComplete(success, `${operationName}${success ? '成功' : '失败'}`);
    }

    return success;
  };

  // 测试各种通知类型
  const testNotifications = () => {
    notify.success('这是一个成功通知！');
    setTimeout(() => notify.warning('这是一个警告通知！'), 1000);
    setTimeout(() => notify.error('这是一个错误通知！'), 2000);
    setTimeout(() => notify.info('这是一个信息通知！'), 3000);
  };

  // 测试标题闪烁
  const testTitleBlink = () => {
    blinkTitle('🔔 有新消息！', {
      duration: 5000,
      onComplete: () => console.log('标题闪烁结束')
    });
  };

  // 测试声音提醒
  const testSounds = () => {
    playSound('success');
    setTimeout(() => playSound('warning'), 1000);
    setTimeout(() => playSound('error'), 2000);
    setTimeout(() => playSound('info'), 3000);
  };

  // 手动请求权限
  const handleRequestPermission = async () => {
    try {
      await requestPermission();
      notify.success('通知权限已开启！');
    } catch (error) {
      notify.error('通知权限请求失败');
    }
  };

  return (
    <div className="notification-demo p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🔔 通知功能演示</h2>

      {/* 权限状态 */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">权限状态</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>浏览器支持:</strong>
            <span className={`ml-2 ${isSupported ? 'text-green-600' : 'text-red-600'}`}>
              {isSupported ? '✅ 支持' : '❌ 不支持'}
            </span>
          </div>
          <div>
            <strong>当前权限:</strong>
            <span className={`ml-2 ${
              permission === 'granted' ? 'text-green-600' :
              permission === 'denied' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {permission === 'granted' ? '✅ 已授权' :
               permission === 'denied' ? '❌ 已拒绝' : '⏳ 未决定'}
            </span>
          </div>
          <div>
            <strong>可发送通知:</strong>
            <span className={`ml-2 ${canNotify ? 'text-green-600' : 'text-red-600'}`}>
              {canNotify ? '✅ 可以' : '❌ 不可以'}
            </span>
          </div>
          <div>
            <strong>标题闪烁状态:</strong>
            <span className={`ml-2 ${isBlinking ? 'text-blue-600' : 'text-gray-600'}`}>
              {isBlinking ? '🔄 闪烁中' : '⏸️ 停止'}
            </span>
          </div>
        </div>

        {permission !== 'granted' && (
          <button
            onClick={handleRequestPermission}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            请求通知权限
          </button>
        )}
      </div>

      {/* 操作演示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 异步操作测试 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">🚀 异步操作测试</h3>
          <p className="text-sm text-gray-600 mb-3">
            模拟真实的异步操作，完成后会发送完整提醒
          </p>
          <div className="space-y-2">
            <button
              onClick={() => simulateAsyncOperation('文件上传', 2000)}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? '处理中...' : '测试文件上传'}
            </button>
            <button
              onClick={() => simulateAsyncOperation('数据处理', 3000)}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? '处理中...' : '测试数据处理'}
            </button>
            <button
              onClick={() => simulateAsyncOperation('模型分析', 4000)}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {isLoading ? '处理中...' : '测试模型分析'}
            </button>
          </div>
        </div>

        {/* 通知类型测试 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">📢 通知类型测试</h3>
          <p className="text-sm text-gray-600 mb-3">
            测试不同类型的桌面通知
          </p>
          <div className="space-y-2">
            <button
              onClick={testNotifications}
              disabled={!canNotify}
              className="w-full px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              测试所有通知类型
            </button>
            <button
              onClick={() => notify.custom({
                title: '🎉 自定义通知',
                body: '这是一个完全自定义的通知消息',
                tag: 'custom-notification',
                requireInteraction: true,
              })}
              disabled={!canNotify}
              className="w-full px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              自定义通知
            </button>
          </div>
        </div>

        {/* 视觉提醒测试 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">👁️ 视觉提醒测试</h3>
          <p className="text-sm text-gray-600 mb-3">
            测试标题闪烁等视觉提醒功能
          </p>
          <div className="space-y-2">
            <button
              onClick={testTitleBlink}
              disabled={isBlinking}
              className="w-full px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              {isBlinking ? '闪烁中...' : '测试标题闪烁'}
            </button>
            <button
              onClick={stopBlink}
              disabled={!isBlinking}
              className="w-full px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              停止闪烁
            </button>
          </div>
        </div>

        {/* 声音提醒测试 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">🔊 声音提醒测试</h3>
          <p className="text-sm text-gray-600 mb-3">
            测试不同类型的提示音
          </p>
          <div className="space-y-2">
            <button
              onClick={testSounds}
              className="w-full px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              测试所有声音
            </button>
            <button
              onClick={() => playSound('success')}
              className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              成功声音
            </button>
            <button
              onClick={() => playSound('error')}
              className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              错误声音
            </button>
          </div>
        </div>
      </div>

      {/* 当前页面标题显示 */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📄 当前页面信息</h3>
        <p><strong>当前标题:</strong> {document.title}</p>
        <p><strong>原始标题:</strong> {originalTitle}</p>
      </div>

      {/* 使用说明 */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📖 使用说明</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 点击"请求通知权限"以启用桌面通知</li>
          <li>• 异步操作会显示进度和完成提醒</li>
          <li>• 支持成功、警告、错误、信息四种通知类型</li>
          <li>• 标题闪烁会在后台运行，即使切换标签页也能看到</li>
          <li>• 声音提醒不依赖通知权限，任何时候都能播放</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationDemo;
