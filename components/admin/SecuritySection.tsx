"use client";

import { useState, useId } from "react";
import {
	Shield,
	UserCheck,
	UserX,
	AlertTriangle,
	Lock,
	Eye,
	Activity,
	FileWarning
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SecuritySectionProps {
	twoFactorRequired: boolean;
	onTwoFactorRequiredChange: (value: boolean) => void;
}

interface SecurityLog {
	id: string;
	type: 'login' | 'failed_login' | 'permission_change' | 'suspicious';
	user: string;
	ip: string;
	time: string;
	description: string;
}

const mockLogs: SecurityLog[] = [
	{
		id: '1',
		type: 'login',
		user: '管理员',
		ip: '192.168.1.1',
		time: '2分钟前',
		description: '成功登录管理面板',
	},
	{
		id: '2',
		type: 'failed_login',
		user: '未知',
		ip: '203.0.113.1',
		time: '15分钟前',
		description: '登录失败 - 密码错误',
	},
	{
		id: '3',
		type: 'suspicious',
		user: '用户123',
		ip: '198.51.100.1',
		time: '1小时前',
		description: '短时间内多次请求 API',
	},
	{
		id: '4',
		type: 'permission_change',
		user: '管理员',
		ip: '192.168.1.1',
		time: '2小时前',
		description: '修改用户权限设置',
	},
];

export function SecuritySection({
	twoFactorRequired,
	onTwoFactorRequiredChange,
}: SecuritySectionProps) {
	const twoFactorId = useId();
	const ipWhitelistId = useId();
	const loginAlertId = useId();
	const [ipWhitelist, setIpWhitelist] = useState(false);
	const [loginAlert, setLoginAlert] = useState(true);

	const getLogIcon = (type: SecurityLog['type']) => {
		switch (type) {
			case 'login':
				return <UserCheck className="h-4 w-4 text-green-500" />;
			case 'failed_login':
				return <UserX className="h-4 w-4 text-red-500" />;
			case 'suspicious':
				return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
			case 'permission_change':
				return <Lock className="h-4 w-4 text-blue-500" />;
		}
	};

	const getLogBadge = (type: SecurityLog['type']) => {
		switch (type) {
			case 'login':
				return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">正常</Badge>;
			case 'failed_login':
				return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">失败</Badge>;
			case 'suspicious':
				return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">可疑</Badge>;
			case 'permission_change':
				return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">变更</Badge>;
		}
	};

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">安全监控</h2>
				<p className="text-sm text-muted-foreground">
					监控系统安全状态和访问日志
				</p>
			</div>

			{/* 安全概览 */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
								<Shield className="h-5 w-5 text-green-500" />
							</div>
							<div>
								<p className="text-2xl font-bold">安全</p>
								<p className="text-xs text-muted-foreground">系统状态</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
								<AlertTriangle className="h-5 w-5 text-yellow-500" />
							</div>
							<div>
								<p className="text-2xl font-bold">3</p>
								<p className="text-xs text-muted-foreground">可疑活动</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
								<UserX className="h-5 w-5 text-red-500" />
							</div>
							<div>
								<p className="text-2xl font-bold">12</p>
								<p className="text-xs text-muted-foreground">失败登录</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 安全设置 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Shield className="h-5 w-5" />
						安全设置
					</CardTitle>
					<CardDescription>配置安全策略和权限</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label htmlFor={twoFactorId} className="text-sm font-medium">
								强制两步验证
							</Label>
							<p className="text-xs text-muted-foreground">
								要求所有管理员启用两步验证
							</p>
						</div>
						<Switch
							id={twoFactorId}
							checked={twoFactorRequired}
							onCheckedChange={onTwoFactorRequiredChange}
						/>
					</div>

					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label htmlFor={ipWhitelistId} className="text-sm font-medium">
								IP 白名单
							</Label>
							<p className="text-xs text-muted-foreground">
								只允许白名单内的 IP 访问管理面板
							</p>
						</div>
						<Switch
							id={ipWhitelistId}
							checked={ipWhitelist}
							onCheckedChange={setIpWhitelist}
						/>
					</div>

					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label htmlFor={loginAlertId} className="text-sm font-medium">
								登录警报
							</Label>
							<p className="text-xs text-muted-foreground">
								异常登录时发送通知
							</p>
						</div>
						<Switch
							id={loginAlertId}
							checked={loginAlert}
							onCheckedChange={setLoginAlert}
						/>
					</div>
				</CardContent>
			</Card>

			{/* 安全日志 */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg flex items-center gap-2">
								<Activity className="h-5 w-5" />
								安全日志
							</CardTitle>
							<CardDescription>系统安全事件记录</CardDescription>
						</div>
						<Button variant="outline" size="sm">
							<Eye className="h-4 w-4 mr-2" />
							查看全部
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="all" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="all">全部</TabsTrigger>
							<TabsTrigger value="login">登录</TabsTrigger>
							<TabsTrigger value="failed">失败</TabsTrigger>
							<TabsTrigger value="suspicious">可疑</TabsTrigger>
						</TabsList>
						<TabsContent value="all" className="space-y-2 mt-4">
							{mockLogs.map((log) => (
								<div
									key={log.id}
									className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-center gap-3 flex-1">
										{getLogIcon(log.type)}
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<p className="text-sm font-medium">{log.description}</p>
												{getLogBadge(log.type)}
											</div>
											<p className="text-xs text-muted-foreground">
												{log.user} · IP: {log.ip}
											</p>
										</div>
									</div>
									<p className="text-xs text-muted-foreground">{log.time}</p>
								</div>
							))}
						</TabsContent>
						<TabsContent value="login">
							<div className="text-center py-8">
								<FileWarning className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<p className="text-sm text-muted-foreground">仅显示登录记录</p>
							</div>
						</TabsContent>
						<TabsContent value="failed">
							<div className="text-center py-8">
								<FileWarning className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<p className="text-sm text-muted-foreground">仅显示失败记录</p>
							</div>
						</TabsContent>
						<TabsContent value="suspicious">
							<div className="text-center py-8">
								<FileWarning className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<p className="text-sm text-muted-foreground">仅显示可疑活动</p>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
