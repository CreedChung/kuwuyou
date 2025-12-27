import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { HeroDemo } from "@/components/ui/hero-demo";
import { notificationService } from "../services/NotificationService";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  // 模拟异步操作完成后的通知
  const simulateAsyncOperation = async (
    operationName: string,
    duration: number = 3000,
  ) => {
    setIsLoading(true);

    // 开始通知
    notificationService.showInfo(`${operationName} 开始执行...`);

    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, duration));

    // 模拟随机结果（80% 成功率）
    const success = Math.random() > 0.2;

    setIsLoading(false);

    // 操作完成后的完整提醒
    notificationService.completeAlert(
      `${operationName} ${success ? "成功完成" : "执行失败"}`,
      success ? "success" : "error",
      {
        showNotification: true,
        playSound: true,
        blinkTitle: true,
        blinkText: success ? "✅ 完成" : "❌ 失败",
        duration: 8000,
      },
    );

    return success;
  };

  // 测试各种通知类型
  const testNotifications = () => {
    notificationService.showSuccess("文件上传成功！");
    setTimeout(() => notificationService.showWarning("磁盘空间不足"), 1000);
    setTimeout(() => notificationService.showError("网络连接失败"), 2000);
    setTimeout(() => notificationService.showInfo("系统将在5分钟后维护"), 3000);
  };

  // 测试标题闪烁
  const testTitleBlink = () => {
    notificationService.startTitleBlink({
      originalTitle: document.title,
      blinkTitle: "🔔 有新消息！",
      duration: 5000,
    });
  };

  // 测试声音提醒
  const testSounds = () => {
    notificationService.playNotificationSound("success");
    setTimeout(
      () => notificationService.playNotificationSound("warning"),
      1000,
    );
    setTimeout(() => notificationService.playNotificationSound("error"), 2000);
    setTimeout(() => notificationService.playNotificationSound("info"), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1">
        <HeroDemo />

        {/* 通知功能演示区域 */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🔔 智能通知系统
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              体验完整的浏览器通知功能，操作完成后自动发送桌面通知、标题闪烁和声音提醒
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 异步操作演示 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🚀 异步操作测试
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                模拟真实的异步操作，完成后会自动发送通知
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => simulateAsyncOperation("文件上传", 2000)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isLoading ? "处理中..." : "📤 文件上传"}
                </button>
                <button
                  onClick={() => simulateAsyncOperation("数据处理", 3000)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isLoading ? "处理中..." : "📊 数据处理"}
                </button>
                <button
                  onClick={() => simulateAsyncOperation("AI分析", 4000)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isLoading ? "处理中..." : "🤖 AI分析"}
                </button>
              </div>
            </div>

            {/* 通知类型演示 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📢 通知类型测试
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                测试不同类型的桌面通知
              </p>
              <div className="space-y-3">
                <button
                  onClick={testNotifications}
                  className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  🎨 所有通知类型
                </button>
                <button
                  onClick={() =>
                    notificationService.showCustomNotification({
                      title: "🎉 自定义通知",
                      body: "这是一个完全自定义的通知",
                      tag: "custom-test",
                    })
                  }
                  className="w-full px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                >
                  ⚙️ 自定义通知
                </button>
              </div>
            </div>

            {/* 视觉提醒演示 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                👁️ 视觉提醒测试
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                测试标题闪烁等视觉提醒功能
              </p>
              <div className="space-y-3">
                <button
                  onClick={testTitleBlink}
                  className="w-full px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                >
                  📢 开始标题闪烁
                </button>
                <button
                  onClick={() => notificationService.stopTitleBlink()}
                  className="w-full px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  ⏹️ 停止闪烁
                </button>
              </div>
            </div>

            {/* 声音提醒演示 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔊 声音提醒测试
              </h3>
              <p className="text-sm text-gray-600 mb-4">测试不同类型的提示音</p>
              <div className="space-y-3">
                <button
                  onClick={testSounds}
                  className="w-full px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                >
                  🔊 所有声音
                </button>
                <button
                  onClick={() =>
                    notificationService.playNotificationSound("success")
                  }
                  className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  ✅ 成功声音
                </button>
                <button
                  onClick={() =>
                    notificationService.playNotificationSound("error")
                  }
                  className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  ❌ 错误声音
                </button>
              </div>
            </div>
          </div>

          {/* 功能特性介绍 */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ✨ 功能特性
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔔</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  桌面通知
                </h4>
                <p className="text-sm text-gray-600">
                  原生浏览器通知，即使在后台运行也能收到提醒
                </p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📢</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  标题闪烁
                </h4>
                <p className="text-sm text-gray-600">
                  浏览器标签页标题闪烁提示，特别适合长时间操作
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔊</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  声音提醒
                </h4>
                <p className="text-sm text-gray-600">
                  多种提示音类型，不依赖通知权限即可播放
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  智能组合
                </h4>
                <p className="text-sm text-gray-600">
                  可自由组合多种提醒方式，提供最佳用户体验
                </p>
              </div>
            </div>
          </div>

          {/* 使用提示 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              📖 使用提示
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  适用场景
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 文件上传完成通知</li>
                  <li>• 数据处理进度提醒</li>
                  <li>• AI模型分析结果通知</li>
                  <li>• 系统维护时间提醒</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  技术特点
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 支持权限自动管理</li>
                  <li>• 跨标签页标题闪烁</li>
                  <li>• 多类型声音提醒</li>
                  <li>• 完全可定制化配置</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer
        logo={
          <img
            src="/logo.jpg"
            alt="库无忧助手"
            className="h-10 w-10 object-contain"
          />
        }
        brandName="库无忧助手"
        socialLinks={[]}
        mainLinks={[]}
        legalLinks={[]}
        copyright={{
          text: "© 2025 库无忧助手",
          license: "保留所有权利",
        }}
      />
    </div>
  );
}
