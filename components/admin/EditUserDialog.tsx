"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/useToast";
import { Loader2 } from "lucide-react";

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	status: string;
}

interface EditUserDialogProps {
	user: User | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function EditUserDialog({
	user,
	open,
	onOpenChange,
	onSuccess,
}: EditUserDialogProps) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		role: "user",
	});
	const { toast } = useToast();

	useEffect(() => {
		if (user) {
			setFormData({
				username: user.name,
				email: user.email,
				role: user.role === "管理员" ? "admin" : "user",
			});
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setLoading(true);
		try {
			const response = await fetch("/api/admin/users", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: user.id,
					...formData,
				}),
			});

			const result = await response.json();

			if (result.success) {
				toast({
					title: "更新成功",
					description: "用户信息已更新",
				});
				onSuccess();
				onOpenChange(false);
			} else {
				toast({
					title: "更新失败",
					description: result.error,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "更新失败",
				description: "网络错误，请稍后重试",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>编辑用户</DialogTitle>
					<DialogDescription>修改用户的基本信息和权限</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="username">用户名</Label>
							<Input
								id="username"
								value={formData.username}
								onChange={(e) =>
									setFormData({ ...formData, username: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">邮箱</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label>角色</Label>
							<Tabs
								value={formData.role}
								onValueChange={(value) =>
									setFormData({ ...formData, role: value })
								}
							>
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="user">普通用户</TabsTrigger>
									<TabsTrigger value="admin">管理员</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={loading}
						>
							取消
						</Button>
						<Button type="submit" disabled={loading}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							保存
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}