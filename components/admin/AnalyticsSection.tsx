"use client";

import { useEffect, useState } from "react";
import { BarChart3, Clock, Globe, MessageSquare, TrendingUp, Users, Calendar } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAdminStore } from "@/stores/adminStore";

export function AnalyticsSection() {
	const { systemStats } = useAdminStore();
	const [apiCalls, setApiCalls] = useState(123456);
	const [avgResponseTime, setAvgResponseTime] = useState(1.2);

	useEffect(() => {
		// 这里可以添加额外的分析数据获取
		// 目前使用模拟数据
	}, []);

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">数据分析</h2>
				<p className="text-sm text-muted-foreground">
					查看详细的数据统计和分析报告
				</p>
			</div>

			{/* 使用统计 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						使用统计
					</CardTitle>
					<CardDescription>过去30天的使用数据</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
							<div className="flex items-center gap-3">
								<MessageSquare className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">总对话数</p>
									<p className="text-sm text-muted-foreground">
										用户发起的对话
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="text-2xl font-bold">{systemStats.totalMessages.toLocaleString()}</p>
								<p className="text-xs text-green-500 flex items-center gap-1 justify-end">
									<TrendingUp className="h-3 w-3" />
									+{systemStats.messageGrowth}%
								</p>
							</div>
						</div>
						<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
							<div className="flex items-center gap-3">
								<Clock className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">平均响应时间</p>
									<p className="text-sm text-muted-foreground">AI 响应速度</p>
								</div>
							</div>
							<p className="text-2xl font-bold">{avgResponseTime}s</p>
						</div>
						<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
							<div className="flex items-center gap-3">
								<Globe className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">API 调用次数</p>
									<p className="text-sm text-muted-foreground">总请求数</p>
								</div>
							</div>
							<p className="text-2xl font-bold">{apiCalls.toLocaleString()}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 用户活跃度 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Users className="h-5 w-5" />
						用户活跃度
					</CardTitle>
					<CardDescription>用户参与度指标</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">日活跃用户</span>
							<span className="font-medium">
								{Math.floor(systemStats.activeUsers * 0.3).toLocaleString()} / {systemStats.totalUsers.toLocaleString()}
							</span>
						</div>
						<Progress value={(systemStats.activeUsers / systemStats.totalUsers) * 30} className="h-2" />
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">周活跃用户</span>
							<span className="font-medium">
								{Math.floor(systemStats.activeUsers * 0.6).toLocaleString()} / {systemStats.totalUsers.toLocaleString()}
							</span>
						</div>
						<Progress value={(systemStats.activeUsers / systemStats.totalUsers) * 60} className="h-2" />
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">月活跃用户</span>
							<span className="font-medium">
								{systemStats.activeUsers.toLocaleString()} / {systemStats.totalUsers.toLocaleString()}
							</span>
						</div>
						<Progress value={(systemStats.activeUsers / systemStats.totalUsers) * 100} className="h-2" />
					</div>
				</CardContent>
			</Card>

			{/* 增长趋势 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						增长趋势
					</CardTitle>
					<CardDescription>本月对比上月增长情况</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 rounded-lg bg-muted/50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">用户增长</span>
								<span className={`text-sm font-medium ${systemStats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
									{systemStats.userGrowth >= 0 ? '+' : ''}{systemStats.userGrowth}%
								</span>
							</div>
							<Progress
								value={Math.abs(systemStats.userGrowth)}
								className="h-2"
							/>
						</div>

						<div className="p-4 rounded-lg bg-muted/50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">活跃度增长</span>
								<span className={`text-sm font-medium ${systemStats.activeGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
									{systemStats.activeGrowth >= 0 ? '+' : ''}{systemStats.activeGrowth}%
								</span>
							</div>
							<Progress
								value={Math.abs(systemStats.activeGrowth)}
								className="h-2"
							/>
						</div>

						<div className="p-4 rounded-lg bg-muted/50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">消息增长</span>
								<span className={`text-sm font-medium ${systemStats.messageGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
									{systemStats.messageGrowth >= 0 ? '+' : ''}{systemStats.messageGrowth}%
								</span>
							</div>
							<Progress
								value={Math.abs(systemStats.messageGrowth)}
								className="h-2"
							/>
						</div>

						<div className="p-4 rounded-lg bg-muted/50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">收入增长</span>
								<span className={`text-sm font-medium ${systemStats.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
									{systemStats.revenueGrowth >= 0 ? '+' : ''}{systemStats.revenueGrowth}%
								</span>
							</div>
							<Progress
								value={Math.abs(systemStats.revenueGrowth)}
								className="h-2"
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
