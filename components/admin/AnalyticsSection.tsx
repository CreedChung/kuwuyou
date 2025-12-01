"use client";

import { useEffect, useState } from "react";
import { BarChart3, Clock, Globe, MessageSquare, TrendingUp, Users, Calendar, RefreshCw } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/adminStore";

interface AnalyticsData {
	totalMessages: number;
	totalConversations: number;
	activeUsers: number;
	recentActivity: number;
	avgResponseTime: string;
	apiCalls: number;
	dailyStats: Array<{
		date: string;
		messages: number;
		users: number;
	}>;
}

export function AnalyticsSection() {
	const { systemStats } = useAdminStore();
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchAnalytics = async () => {
		setLoading(true);
		try {
			const response = await fetch('/api/admin/analytics');
			const result = await response.json();
			if (result.success) {
				setAnalyticsData(result.data);
			}
		} catch (error) {
			console.error('获取分析数据失败:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAnalytics();
	}, []);

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold mb-2">数据分析</h2>
					<p className="text-sm text-muted-foreground">
						查看详细的数据统计和分析报告
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={fetchAnalytics}
					disabled={loading}
					className="gap-2"
				>
					<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
					刷新
				</Button>
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
									<p className="font-medium">总消息数</p>
									<p className="text-sm text-muted-foreground">
										所有用户消息
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="text-2xl font-bold">
									{analyticsData?.totalMessages.toLocaleString() || systemStats.totalMessages.toLocaleString()}
								</p>
								<p className="text-xs text-green-500 flex items-center gap-1 justify-end">
									<TrendingUp className="h-3 w-3" />
									+{systemStats.messageGrowth}%
								</p>
							</div>
						</div>
						<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
							<div className="flex items-center gap-3">
								<Users className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">活跃用户</p>
									<p className="text-sm text-muted-foreground">30天内活跃</p>
								</div>
							</div>
							<p className="text-2xl font-bold">
								{analyticsData?.activeUsers.toLocaleString() || systemStats.activeUsers.toLocaleString()}
							</p>
						</div>
						<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
							<div className="flex items-center gap-3">
								<Clock className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">平均响应时间</p>
									<p className="text-sm text-muted-foreground">AI 响应速度</p>
								</div>
							</div>
							<p className="text-2xl font-bold">{analyticsData?.avgResponseTime || '1.2'}s</p>
						</div>
						<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
							<div className="flex items-center gap-3">
								<Globe className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">API 调用次数</p>
									<p className="text-sm text-muted-foreground">总请求数</p>
								</div>
							</div>
							<p className="text-2xl font-bold">{analyticsData?.apiCalls.toLocaleString() || '0'}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 最近活动 */}
			{analyticsData?.dailyStats && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							每日统计
						</CardTitle>
						<CardDescription>最近7天的活动趋势</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{analyticsData.dailyStats.slice(-7).map((stat) => (
								<div key={stat.date} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
									<span className="text-sm font-medium">{stat.date}</span>
									<div className="flex items-center gap-4 text-sm">
										<span className="text-muted-foreground">
											消息: <span className="font-medium text-foreground">{stat.messages}</span>
										</span>
										<span className="text-muted-foreground">
											用户: <span className="font-medium text-foreground">{stat.users}</span>
										</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
