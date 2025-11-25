
"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import {
	Activity,
	ArrowLeft,
	BarChart3,
	Calendar,
	Camera,
	Mail,
	MapPin,
	Save,
	Trophy,
	User,
	Loader2,
} from "lucide-react";
import { useId, useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getProfile, updateProfile, updateAvatar, type ProfileData, type StatsData, type AchievementData } from "@/services/profile";
import { useAuthStore } from "@/stores/authStore";

type ProfileSection = "basic" | "stats" | "achievements" | "activity";

interface SidebarItem {
	id: ProfileSection;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
	{ id: "basic", label: "基本信息", icon: User },
	{ id: "stats", label: "使用统计", icon: BarChart3 },
	{ id: "achievements", label: "成就徽章", icon: Trophy },
];

export default function ProfilePage() {
	return (
		<ProtectedRoute>
			<ProfilePageContent />
		</ProtectedRoute>
	);
}

function ProfilePageContent() {
	const usernameId = useId();
	const emailId = useId();
	const bioId = useId();
	const locationId = useId();
	const { toast } = useToast();
	const { user, initialized, initialize } = useAuthStore();
	
	const [activeSection, setActiveSection] = useState<ProfileSection>("basic");
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	
	const [profile, setProfile] = useState<ProfileData>({
		id: "",
		username: "用户",
		email: "user@example.com",
		avatarUrl: "",
		joinDate: "2024-01-01",
	});

	const [stats, setStats] = useState<StatsData>({
		conversationCount: 0,
		messageCount: 0,
		activeDays: 0,
	});

	const [achievements, setAchievements] = useState<AchievementData[]>([]);

	const [editedProfile, setEditedProfile] = useState(profile);

	// 初始化认证状态
	useEffect(() => {
		if (!initialized) {
			initialize();
		}
	}, [initialized, initialize]);

	// 加载用户数据
	useEffect(() => {
		const loadProfile = async () => {
			// 等待认证状态初始化完成
			if (!initialized) {
				return;
			}

			setLoading(true);
			const data = await getProfile();
			
			if (data) {
				setProfile(data.profile);
				setEditedProfile(data.profile);
				setStats(data.stats);
				setAchievements(data.achievements);
			} else {
				toast({
					title: "加载失败",
					description: "无法加载用户资料",
					variant: "destructive",
				});
			}
			
			setLoading(false);
		};

		loadProfile();
	}, [user, initialized, toast]);

	const handleSave = async () => {
		setSaving(true);
		
		const result = await updateProfile({
			username: editedProfile.username,
		});

		if (result.success) {
			setProfile(editedProfile);
			setIsEditing(false);
			toast({
				title: "保存成功",
				description: "您的资料已更新",
			});
		} else {
			toast({
				title: "保存失败",
				description: result.error || "更新资料失败",
				variant: "destructive",
			});
		}
		
		setSaving(false);
	};

	const handleCancel = () => {
		setEditedProfile(profile);
		setIsEditing(false);
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 检查文件类型
		if (!file.type.startsWith("image/")) {
			toast({
				title: "文件类型错误",
				description: "请选择图片文件",
				variant: "destructive",
			});
			return;
		}

		// 检查文件大小 (最大 2MB)
		if (file.size > 2 * 1024 * 1024) {
			toast({
				title: "文件过大",
				description: "图片大小不能超过 2MB",
				variant: "destructive",
			});
			return;
		}

		const result = await updateAvatar(file);

		if (result.success && result.url) {
			setProfile({ ...profile, avatarUrl: result.url });
			setEditedProfile({ ...editedProfile, avatarUrl: result.url });
			toast({
				title: "上传成功",
				description: "头像已更新",
			});
		} else {
			toast({
				title: "上传失败",
				description: result.error || "更新头像失败",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-background">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground">加载中...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-background">
			{/* 左侧边栏 */}
			<div className="w-64 border-r border-border/40 bg-muted/30 flex flex-col">
				{/* 返回按钮 */}
				<div className="p-4 border-b border-border/40">
					<Link href="/chat">
						<Button
							variant="ghost"
							size="sm"
							className="w-full justify-start gap-2 hover:bg-muted"
						>
							<ArrowLeft className="h-4 w-4" />
							<span>返回聊天</span>
						</Button>
					</Link>
				</div>

				{/* 个人资料标题 */}
				<div className="px-4 py-6">
					<h1 className="text-xl font-semibold">个人资料</h1>
				</div>

				{/* 分类列表 */}
				<nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
					{sidebarItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeSection === item.id;
						return (
							<button
								key={item.id}
								type="button"
								onClick={() => setActiveSection(item.id)}
								className={cn(
									"w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
									isActive
										? "bg-muted text-foreground"
										: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
								)}
							>
								<Icon className="h-4 w-4 shrink-0" />
								<span>{item.label}</span>
							</button>
						);
					})}
				</nav>
			</div>

			{/* 右侧内容区域 */}
			<div className="flex-1 overflow-y-auto">
				<div className="max-w-3xl mx-auto p-8">
					{/* 基本信息 */}
					{activeSection === "basic" && (
						<div className="space-y-6 animate-in fade-in-50 duration-300">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-2xl font-bold mb-2">基本信息</h2>
									<p className="text-sm text-muted-foreground">
										管理你的个人资料和公开信息
									</p>
								</div>
								{!isEditing ? (
									<Button onClick={() => setIsEditing(true)} variant="outline">
										编辑资料
									</Button>
								) : (
									<div className="flex gap-2">
										<Button onClick={handleCancel} variant="outline" size="sm" disabled={saving}>
											取消
										</Button>
										<Button onClick={handleSave} size="sm" className="gap-2" disabled={saving}>
											{saving ? (
												<>
													<Loader2 className="h-4 w-4 animate-spin" />
													保存中...
												</>
											) : (
												<>
													<Save className="h-4 w-4" />
													保存
												</>
											)}
										</Button>
									</div>
								)}
							</div>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2">
										<User className="h-5 w-5" />
										个人资料
									</CardTitle>
									<CardDescription>你的公开个人信息</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* 头像部分 */}
									<div className="flex items-center gap-6">
										<div className="relative group">
											<Avatar className="h-20 w-20 border-4 border-primary/20">
												<AvatarImage
													src={profile.avatarUrl || ""}
													alt={profile.username}
												/>
												<AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/60">
													{profile.username.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											{isEditing && (
												<label
													htmlFor="avatar-upload"
													className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
												>
													<Camera className="h-5 w-5 text-white" />
													<input
														id="avatar-upload"
														type="file"
														accept="image/*"
														className="hidden"
														onChange={handleAvatarChange}
													/>
												</label>
											)}
										</div>
										<div className="flex-1">
											{isEditing ? (
												<label htmlFor="avatar-upload-btn">
													<Button variant="outline" size="sm" className="gap-2" type="button" asChild>
														<span className="cursor-pointer">
															<Camera className="h-4 w-4" />
															更换头像
														</span>
													</Button>
													<input
														id="avatar-upload-btn"
														type="file"
														accept="image/*"
														className="hidden"
														onChange={handleAvatarChange}
													/>
												</label>
											) : (
												<div>
													<p className="text-sm font-medium">头像</p>
													<p className="text-xs text-muted-foreground">
														点击编辑资料后可更换头像
													</p>
												</div>
											)}
										</div>
									</div>

									{/* 表单部分 */}
									{!isEditing ? (
										<div className="space-y-4">
											<div className="p-4 rounded-lg bg-muted/50 space-y-3">
												<div>
													<p className="text-xs text-muted-foreground mb-1">
														用户名
													</p>
													<p className="text-sm font-medium">
														{profile.username}
													</p>
												</div>
												<div>
													<p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
														<Mail className="h-3 w-3" />
														邮箱
													</p>
													<p className="text-sm font-medium">{profile.email}</p>
												</div>
												<div>
													<p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
														<Calendar className="h-3 w-3" />
														加入日期
													</p>
													<p className="text-sm font-medium">
														{profile.joinDate}
													</p>
												</div>
											</div>
										</div>
									) : (
										<div className="space-y-4">
											<div className="space-y-2">
												<Label
													htmlFor={usernameId}
													className="text-sm font-medium"
												>
													用户名
												</Label>
												<Input
													id={usernameId}
													value={editedProfile.username}
													onChange={(e) =>
														setEditedProfile({
															...editedProfile,
															username: e.target.value,
														})
													}
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor={emailId} className="text-sm font-medium">
													邮箱
												</Label>
												<Input
													id={emailId}
													type="email"
													value={editedProfile.email}
													disabled
													className="h-11 bg-muted"
													title="邮箱不可修改"
												/>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					)}

					{/* 使用统计 */}
					{activeSection === "stats" && (
						<div className="space-y-6 animate-in fade-in-50 duration-300">
							<div>
								<h2 className="text-2xl font-bold mb-2">使用统计</h2>
								<p className="text-sm text-muted-foreground">
									你的使用数据概览
								</p>
							</div>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2">
										<BarChart3 className="h-5 w-5" />
										统计数据
									</CardTitle>
									<CardDescription>查看你的使用情况</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/10">
											<div className="text-3xl font-bold text-primary">
												{stats.conversationCount.toLocaleString()}
											</div>
											<div className="text-sm text-muted-foreground mt-2">
												对话数
											</div>
										</div>
										<div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/10">
											<div className="text-3xl font-bold text-primary">
												{stats.messageCount.toLocaleString()}
											</div>
											<div className="text-sm text-muted-foreground mt-2">
												消息数
											</div>
										</div>
										<div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/10">
											<div className="text-3xl font-bold text-primary">
												{stats.activeDays}
											</div>
											<div className="text-sm text-muted-foreground mt-2">
												使用天数
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* 成就徽章 */}
					{activeSection === "achievements" && (
						<div className="space-y-6 animate-in fade-in-50 duration-300">
							<div>
								<h2 className="text-2xl font-bold mb-2">成就徽章</h2>
								<p className="text-sm text-muted-foreground">你获得的成就</p>
							</div>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2">
										<Trophy className="h-5 w-5" />
										我的成就
									</CardTitle>
									<CardDescription>已解锁 {achievements.length} 个成就</CardDescription>
								</CardHeader>
								<CardContent>
									{achievements.length > 0 ? (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{achievements.map((achievement) => (
												<div key={achievement.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
													<div className="flex items-center gap-3">
														<div className="text-2xl">{achievement.icon}</div>
														<div className="flex-1">
															<p className="text-sm font-medium">{achievement.name}</p>
															<p className="text-xs text-muted-foreground">
																{achievement.description}
															</p>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-12">
											<Trophy className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
											<p className="text-sm text-muted-foreground">暂无成就</p>
											<p className="text-xs text-muted-foreground mt-1">
												继续使用来解锁更多成就
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					)}

				</div>
			</div>
		</div>
	);
}
						