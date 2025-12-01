"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, MessageSquare, User } from "lucide-react";

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	status: string;
	joinDate: string;
	conversationCount: number;
	messageCount: number;
	lastActiveAt: string | null;
}

interface UserDetailDialogProps {
	user: User | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({
	user,
	open,
	onOpenChange,
}: UserDetailDialogProps) {
	if (!user) return null;

	const formatDateTime = (dateStr: string | null) => {
		if (!dateStr) return "从未活跃";
		try {
			const date = new Date(dateStr);
			return date.toLocaleString("zh-CN");
		} catch {
			return "无效日期";
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>用户详情</DialogTitle>
					<DialogDescription>查看用户的详细信息</DialogDescription>
				</DialogHeader>
				<div className="space-y-6">
					<div className="flex items-start gap-4">
						<div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
							<User className="h-8 w-8 text-primary" />
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<h3 className="text-xl font-semibold">{user.name}</h3>
								<Badge variant={user.role === "管理员" ? "default" : "secondary"}>
									{user.role}
								</Badge>
								{user.status === "banned" && (
									<Badge className="bg-red-500/10 text-red-500 border-red-500/20">
										已封禁
									</Badge>
								)}
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Mail className="h-4 w-4" />
								{user.email}
							</div>
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-6">
						<div className="space-y-4">
							<h4 className="text-sm font-medium">账户信息</h4>
							<div className="space-y-3">
								<div className="flex items-center gap-2 text-sm">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="text-muted-foreground">注册时间：</span>
									<span>{user.joinDate}</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<User className="h-4 w-4 text-muted-foreground" />
									<span className="text-muted-foreground">用户ID：</span>
									<span className="font-mono text-xs">{user.id}</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="text-muted-foreground">最后活跃：</span>
									<span>{formatDateTime(user.lastActiveAt)}</span>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h4 className="text-sm font-medium">使用统计</h4>
							<div className="space-y-3">
								<div className="p-3 rounded-lg bg-muted/50">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">对话数</span>
										<span className="text-lg font-semibold">
											{user.conversationCount}
										</span>
									</div>
								</div>
								<div className="p-3 rounded-lg bg-muted/50">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">消息数</span>
										<span className="text-lg font-semibold">
											{user.messageCount}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}