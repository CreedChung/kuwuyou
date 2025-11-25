"use client";

import { useEffect, useState } from "react";
import {
	Activity,
	AlertTriangle,
	CheckCircle,
	MessageSquare,
	TrendingDown,
	TrendingUp,
	UserCheck,
	Users,
	RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAdminStore } from "@/stores/adminStore";

export function OverviewSection() {
	const { systemStats, systemStatus, updateSystemStats, updateSystemStatus } = useAdminStore();
	const [loading, setLoading] = useState(false);

	const fetchStats = async () => {
		setLoading(true);
		try {
			const response = await fetch('/api/admin/stats');
			const result = await response.json();
			if (result.success) {
				updateSystemStats(result.data);
			}
		} catch (error) {
			console.error('获取统计数据失败:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchSystemStatus = async () => {
		try {
			const response = await fetch('/api/admin/system');
			const result = await response.json();
			if (result.success) {
				updateSystemStatus(result.data);
			}
		} catch (error) {
			console.error('获取系统状态失败:', error);
		}
	};

	useEffect(() => {
		fetchStats();
		fetchSystemStatus();
		
		// 每30秒刷新一次
		const interval = setInterval(() => {
			fetchStats();
			fetchSystemStatus();
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	const getStatusBadge = (status: 'normal' | 'warning' | 'error') => {
		switch (status) {
			case 'normal':
				return (
					<Badge className="gap-1.5 bg-green-500/10 text-green-500 border-green-500/20">
						<CheckCircle className="h-3 w-3" />
						正常
					</Badge>
				);
			case 'warning':
				return (
					<Badge className="gap-1.5 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
						<AlertTriangle className="h-3 w-3" />
						警告
					</Badge>
				);
			case 'error':
				return (
					<Badge className="gap-1.5 bg-red-500/10 text-red-500 border-red-500/20">
						<AlertTriangle className="h-3 w-3" />
						错误
					</Badge>
				);
		}
	};

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold mb-2">系统概览</h2>
					<p className="text-sm text-muted-foreground">
						查看系统整体运行状态和关键指标
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={fetchStats}
					disabled={loading}
					className="gap-2"
				>
					<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
					刷新
				</Button>
			</div>

			{/* 统计卡片 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between mb-2">
							<Users className="h-5 w-5 text-muted-foreground" />
							{systemStats.userGrowth >= 0 ? (
								<TrendingUp className="h-4 w-4 text-green-500" />
							) : (
								<TrendingDown className="h-4 w-4 text-red-500" />
							)}
						</div>
						<div className="space-y-1">
							<p className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</p>
							<p className="text-xs text-muted-foreground">总用户数</p>
							<p className={`text-xs font-medium ${systemStats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
								{systemStats.userGrowth >= 0 ? '+' : ''}{systemStats.userGrowth}%
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between mb-2">
							<UserCheck className="h-5 w-5 text-muted-foreground" />
							{systemStats.activeGrowth >= 0 ? (
								<TrendingUp className="h-4 w-4 text-green-500" />
							) : (
								<TrendingDown className="h-4 w-4 text-red-500" />
							)}
						</div>
						<div className="space-y-1">
							<p className="text-2xl font-bold">{systemStats.activeUsers.toLocaleString()}</p>
							<p className="text-xs text-muted-foreground">活跃用户</p>
							<p className={`text-xs font-medium ${systemStats.activeGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
								{systemStats.activeGrowth >= 0 ? '+' : ''}{systemStats.activeGrowth}%
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between mb-2">
							<MessageSquare className="h-5 w-5 text-muted-foreground" />
							{systemStats.messageGrowth >= 0 ? (
								<TrendingUp className="h-4 w-4 text-green-500" />
							) : (
								<TrendingDown className="h-4 w-4 text-red-500" />
							)}
						</div>
						<div className="space-y-1">
							<p className="text-2xl font-bold">{systemStats.totalMessages.toLocaleString()}</p>
							<p className="text-xs text-muted-foreground">消息总数</p>
							<p className={`text-xs font-medium ${systemStats.messageGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
								{systemStats.messageGrowth >= 0 ? '+' : ''}{systemStats.messageGrowth}%
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 系统状态 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Activity className="h-5 w-5" />
						系统状态
					</CardTitle>
					<CardDescription>实时系统运行状态</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-4 rounded-lg bg-muted/50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">
									服务器状态
								</span>
								{getStatusBadge(systemStatus.server)}
							</div>
							<p className="text-xs text-muted-foreground">
								运行时间: {systemStatus.uptime}
							</p>
						</div>
						<div className="p-4 rounded-lg bg-muted/50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">数据库</span>
								{getStatusBadge(systemStatus.database)}
							</div>
							<p className="text-xs text-muted-foreground">
								响应时间: {systemStatus.dbResponseTime}
							</p>
						</div>
						<div className="p-4 rounded-lg bg-muted/50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">API 服务</span>
								{getStatusBadge(systemStatus.api)}
							</div>
							<p className="text-xs text-muted-foreground">
								{systemStatus.api === 'normal' ? '运行正常' : '请求延迟较高'}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
