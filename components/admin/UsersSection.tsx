import {
	Ban,
	CheckCircle,
	Edit,
	Eye,
	Filter,
	Search,
	Trash2,
	Upload,
	Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const mockUsers = [
	{
		id: "1",
		name: "张三",
		email: "zhangsan@example.com",
		role: "VIP",
		status: "active",
		joinDate: "2024-01-15",
	},
	{
		id: "2",
		name: "李四",
		email: "lisi@example.com",
		role: "普通用户",
		status: "active",
		joinDate: "2024-02-20",
	},
	{
		id: "3",
		name: "王五",
		email: "wangwu@example.com",
		role: "普通用户",
		status: "banned",
		joinDate: "2024-03-10",
	},
];

interface UsersSectionProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
}

export function UsersSection({
	searchQuery,
	onSearchChange,
}: UsersSectionProps) {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold mb-2">用户管理</h2>
					<p className="text-sm text-muted-foreground">
						管理和监控所有用户账户
					</p>
				</div>
				<Button className="gap-2">
					<Upload className="h-4 w-4" />
					导出用户
				</Button>
			</div>

			{/* 搜索和筛选 */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="搜索用户名、邮箱..."
								value={searchQuery}
								onChange={(e) => onSearchChange(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select defaultValue="all">
							<SelectTrigger className="w-[180px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="筛选状态" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">全部用户</SelectItem>
								<SelectItem value="active">活跃用户</SelectItem>
								<SelectItem value="banned">已封禁</SelectItem>
								<SelectItem value="vip">VIP用户</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* 用户列表 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Users className="h-5 w-5" />
						用户列表
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{mockUsers.map((user) => (
							<div
								key={user.id}
								className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
										<Users className="h-5 w-5 text-primary" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<p className="font-medium">{user.name}</p>
											<Badge
												variant={user.role === "VIP" ? "default" : "secondary"}
												className="text-xs"
											>
												{user.role}
											</Badge>
											{user.status === "banned" && (
												<Badge className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
													已封禁
												</Badge>
											)}
										</div>
										<p className="text-sm text-muted-foreground">
											{user.email}
										</p>
										<p className="text-xs text-muted-foreground mt-1">
											加入时间: {user.joinDate}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Button variant="ghost" size="icon">
										<Eye className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon">
										<Edit className="h-4 w-4" />
									</Button>
									{user.status === "active" ? (
										<Button
											variant="ghost"
											size="icon"
											className="text-red-500 hover:text-red-600"
										>
											<Ban className="h-4 w-4" />
										</Button>
									) : (
										<Button
											variant="ghost"
											size="icon"
											className="text-green-500 hover:text-green-600"
										>
											<CheckCircle className="h-4 w-4" />
										</Button>
									)}
									<Button
										variant="ghost"
										size="icon"
										className="text-red-500 hover:text-red-600"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
