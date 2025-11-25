"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useAdminStore } from "@/stores/adminStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DebugAuthPage() {
	const { user, initialized } = useAuthStore();
	const { isAdmin, adminUser } = useAdminStore();
	const [localStorageData, setLocalStorageData] = useState<any>({});

	useEffect(() => {
		// 读取 localStorage 数据
		const authStorage = localStorage.getItem("auth-storage");
		const adminStorage = localStorage.getItem("admin-storage");
		const adminAuth = localStorage.getItem("admin_auth");

		setLocalStorageData({
			authStorage: authStorage ? JSON.parse(authStorage) : null,
			adminStorage: adminStorage ? JSON.parse(adminStorage) : null,
			adminAuth,
		});
	}, []);

	const clearAllAuth = () => {
		localStorage.removeItem("auth-storage");
		localStorage.removeItem("admin-storage");
		localStorage.removeItem("admin_auth");
		window.location.reload();
	};

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold mb-6">认证状态调试页面</h1>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>认证 Store 状态 (useAuthStore)</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p>
								<strong>已初始化:</strong> {initialized ? "✅ 是" : "❌ 否"}
							</p>
							<p>
								<strong>用户对象:</strong>{" "}
								{user ? "✅ 存在" : "❌ 不存在"}
							</p>
							{user && (
								<div className="ml-4 space-y-1">
									<p>ID: {user.id}</p>
									<p>邮箱: {user.email}</p>
									<p>用户名: {user.username}</p>
									<p className="text-lg font-bold text-blue-600">
										角色: {user.role || "未设置"}
									</p>
									<p>头像: {user.avatarUrl || "无"}</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>管理员 Store 状态 (useAdminStore)</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p>
								<strong>是管理员:</strong> {isAdmin ? "✅ 是" : "❌ 否"}
							</p>
							<p>
								<strong>管理员用户对象:</strong>{" "}
								{adminUser ? "✅ 存在" : "❌ 不存在"}
							</p>
							{adminUser && (
								<div className="ml-4 space-y-1">
									<p>ID: {adminUser.id}</p>
									<p>名称: {adminUser.name}</p>
									<p>邮箱: {adminUser.email}</p>
									<p>角色: {adminUser.role}</p>
									<p>头像: {adminUser.avatar || "无"}</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>LocalStorage 数据</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<p className="font-bold mb-2">auth-storage:</p>
								<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
									{JSON.stringify(localStorageData.authStorage, null, 2)}
								</pre>
							</div>
							<div>
								<p className="font-bold mb-2">admin-storage:</p>
								<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
									{JSON.stringify(localStorageData.adminStorage, null, 2)}
								</pre>
							</div>
							<div>
								<p className="font-bold mb-2">admin_auth:</p>
								<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
									{localStorageData.adminAuth || "null"}
								</pre>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>诊断建议</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{!initialized && (
								<p className="text-yellow-600">
									⚠️ 认证未初始化，等待初始化完成...
								</p>
							)}
							{initialized && !user && (
								<p className="text-red-600">
									❌ 用户未登录，请先登录
								</p>
							)}
							{user && user.role !== "admin" && (
								<p className="text-red-600">
									❌ 用户角色不是 admin，当前角色: {user.role || "未设置"}
									<br />
									请运行: bun run scripts/set-admin.ts {user.email}
								</p>
							)}
							{user && user.role === "admin" && !isAdmin && (
								<p className="text-yellow-600">
									⚠️ 用户是管理员但 adminStore 未设置
									<br />
									可能需要重新登录或刷新页面
								</p>
							)}
							{user && user.role === "admin" && isAdmin && (
								<p className="text-green-600">
									✅ 一切正常！你应该可以访问 /admin 页面
								</p>
							)}

							<div className="pt-4">
								<Button onClick={clearAllAuth} variant="destructive">
									清除所有认证数据并重新加载
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}