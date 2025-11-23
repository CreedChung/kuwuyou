import {
	Activity,
	AlertTriangle,
	CheckCircle,
	DollarSign,
	MessageSquare,
	TrendingDown,
	TrendingUp,
	UserCheck,
	Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const _iconMap = {
	Users,
	UserCheck,
	DollarSign,
	MessageSquare,
};

export function OverviewSection() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">系统概览</h2>
				<p className="text-sm text-muted-foreground">
					查看系统整体运行状态和关键指标
				</p>
			</div>

			{/* 统计卡片 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between mb-2">
							<Users className="h-5 w-5 text-muted-foreground" />
							<TrendingUp className="h-4 w-4 text-green-500" />
						</div>
						<div className="space-y-1">
							<p className="text-2xl font-bold">1,234</p>
							<p className="text-xs text-muted-foreground">总用户数</p>
							<p className="text-xs font-medium text-green-500">+12.5%</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between mb-2">
							<UserCheck className="h-5 w-5 text-muted-foreground" />
							<TrendingUp className="h-4 w-4 text-green-500" />
						</div>
						<div className="space-y-1">
							<p className="text-2xl font-bold">856</p>
							<p className="text-xs text-muted-foreground">活跃用户</p>
							<p className="text-xs font-medium text-green-500">+8.2%</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between mb-2">
							<DollarSign className="h-5 w-5 text-muted-foreground" />
							<TrendingDown className="h-4 w-4 text-red-500" />
						</div>
						<div className="space-y-1">
							<p className="text-2xl font-bold">¥45,678</p>
							<p className="text-xs text-muted-foreground">本月收入</p>
							<p className="text-xs font-medium text-red-500">-3.1%</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between mb-2">
							<MessageSquare className="h-5 w-5 text-muted-foreground" />
							<TrendingUp className="h-4 w-4 text-green-500" />
						</div>
						<div className="space-y-1">
							<p className="text-2xl font-bold">2,890</p>
							<p className="text-xs text-muted-foreground">消息总数</p>
							<p className="text-xs font-medium text-green-500">+15.7%</p>
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
								<Badge className="gap-1.5 bg-green-500/10 text-green-500 border-green-500/20">
									<CheckCircle className="h-3 w-3" />
									正常
								</Badge>
							</div>
							<p className="text-xs text-muted-foreground">
								运行时间: 15天 8小时
							</p>
						</div>
						<div className="p-4 rounded-lg bg-muted/50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">数据库</span>
								<Badge className="gap-1.5 bg-green-500/10 text-green-500 border-green-500/20">
									<CheckCircle className="h-3 w-3" />
									正常
								</Badge>
							</div>
							<p className="text-xs text-muted-foreground">响应时间: 12ms</p>
						</div>
						<div className="p-4 rounded-lg bg-muted/50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">API 服务</span>
								<Badge className="gap-1.5 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
									<AlertTriangle className="h-3 w-3" />
									警告
								</Badge>
							</div>
							<p className="text-xs text-muted-foreground">请求延迟较高</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
