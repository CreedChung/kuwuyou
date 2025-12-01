"use client";

import { useEffect, useState } from "react";
import {
	Edit,
	Eye,
	Filter,
	Search,
	Trash2,
	Upload,
	Users,
	ChevronLeft,
	ChevronRight,
	Loader2,
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
import { useToast } from "@/hooks/useToast";
import { EditUserDialog } from "./EditUserDialog";
import { UserDetailDialog } from "./UserDetailDialog";

interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role: string;
	status: string;
	joinDate: string;
	conversationCount: number;
	messageCount: number;
	lastActiveAt: string | null;
}

interface UsersSectionProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
}

export function UsersSection({
	searchQuery,
	onSearchChange,
}: UsersSectionProps) {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);
	const { toast } = useToast();

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				search: searchQuery,
				status: statusFilter,
				page: page.toString(),
				pageSize: '10',
			});

			const response = await fetch(`/api/admin/users?${params}`);
			const result = await response.json();

			if (result.success) {
				setUsers(result.data.users);
				setTotal(result.data.total);
				setTotalPages(result.data.totalPages);
			} else {
				toast({
					title: "获取失败",
					description: result.error || "无法加载用户列表",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error('获取用户列表失败:', error);
			toast({
				title: "获取失败",
				description: "网络错误，请稍后重试",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [searchQuery, statusFilter, page]);

	const handleViewUser = (user: User) => {
		setSelectedUser(user);
		setDetailDialogOpen(true);
	};

	const handleEditUser = (user: User) => {
		setSelectedUser(user);
		setEditDialogOpen(true);
	};

	const handleDeleteUser = async (userId: string) => {
		if (!confirm('确定要删除此用户吗？此操作无法撤销。')) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/users?userId=${userId}`, {
				method: 'DELETE',
			});

			const result = await response.json();

			if (result.success) {
				toast({
					title: "删除成功",
					description: result.message,
				});
				fetchUsers();
			} else {
				toast({
					title: "删除失败",
					description: result.error,
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error('删除用户失败:', error);
			toast({
				title: "删除失败",
				description: "网络错误，请稍后重试",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold mb-2">用户管理</h2>
					<p className="text-sm text-muted-foreground">
						管理和监控所有用户账户 (共 {total} 人)
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
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="筛选角色" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">全部用户</SelectItem>
								<SelectItem value="user">普通用户</SelectItem>
								<SelectItem value="admin">管理员</SelectItem>
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
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : users.length === 0 ? (
						<div className="text-center py-12">
							<Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<p className="text-sm text-muted-foreground">暂无用户数据</p>
						</div>
					) : (
						<>
							<div className="space-y-3">
								{users.map((user) => (
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
														variant={user.role === "管理员" ? "default" : "secondary"}
														className="text-xs"
													>
														{user.role}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground">
													{user.email}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													加入: {user.joinDate} | 对话: {user.conversationCount} | 消息: {user.messageCount}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="icon"
												title="查看详情"
												onClick={() => handleViewUser(user)}
											>
												<Eye className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												title="编辑"
												onClick={() => handleEditUser(user)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												title="删除"
												className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
												onClick={() => handleDeleteUser(user.id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>

							{/* 分页 */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between mt-6 pt-6 border-t">
									<p className="text-sm text-muted-foreground">
										第 {page} 页，共 {totalPages} 页
									</p>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setPage(p => Math.max(1, p - 1))}
											disabled={page === 1}
										>
											<ChevronLeft className="h-4 w-4" />
											上一页
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setPage(p => Math.min(totalPages, p + 1))}
											disabled={page === totalPages}
										>
											下一页
											<ChevronRight className="h-4 w-4" />
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			<EditUserDialog
				user={selectedUser}
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				onSuccess={fetchUsers}
			/>

			<UserDetailDialog
				user={selectedUser}
				open={detailDialogOpen}
				onOpenChange={setDetailDialogOpen}
			/>
		</div>
	);
}
