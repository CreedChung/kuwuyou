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
} from "lucide-react";
import { useId, useState } from "react";
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
	{ id: "activity", label: "最近活动", icon: Activity },
];

export default function ProfilePage() {
	const usernameId = useId();
	const emailId = useId();
	const bioId = useId();
	const locationId = useId();
	const [activeSection, setActiveSection] = useState<ProfileSection>("basic");
	const [isEditing, setIsEditing] = useState(false);
	const [profile, setProfile] = useState({
		username: "用户",
		email: "user@example.com",
		bio: "这是一段个人简介，可以介绍一下自己。",
		location: "中国",
		joinDate: "2024-01-01",
		avatar: "",
	});

	const [editedProfile, setEditedProfile] = useState(profile);

	const handleSave = () => {
		setProfile(editedProfile);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedProfile(profile);
		setIsEditing(false);
	};

	const stats = [
		{ label: "对话数", value: "128" },
		{ label: "消息数", value: "1,234" },
		{ label: "使用天数", value: "45" },
	];

	return (
		<div className="flex h-screen bg-background">
			{/* 左侧边栏 */}
			<div className="w-64 border-r border-border/40 bg-muted/30 flex flex-col">
				{/* 返回按钮 */}
				<div className="p-4 border-b border-border/40">
					<Link href="/">
						<Button
							variant="ghost"
							size="sm"
							className="w-full justify-start gap-2 hover:bg-muted"
						>
							<ArrowLeft className="h-4 w-4" />
							<span>返回</span>
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
										<Button onClick={handleCancel} variant="outline" size="sm">
											取消
										</Button>
										<Button onClick={handleSave} size="sm" className="gap-2">
											<Save className="h-4 w-4" />
											保存
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
													src={profile.avatar}
													alt={profile.username}
												/>
												<AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/60">
													{profile.username.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											{isEditing && (
												<button
													type="button"
													className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<Camera className="h-5 w-5 text-white" />
												</button>
											)}
										</div>
										<div className="flex-1">
											{isEditing ? (
												<Button variant="outline" size="sm" className="gap-2">
													<Camera className="h-4 w-4" />
													更换头像
												</Button>
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
													<p className="text-xs text-muted-foreground mb-1">
														个人简介
													</p>
													<p className="text-sm">{profile.bio}</p>
												</div>
												<div className="flex gap-6">
													<div>
														<p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
															<MapPin className="h-3 w-3" />
															位置
														</p>
														<p className="text-sm font-medium">
															{profile.location}
														</p>
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
													onChange={(e) =>
														setEditedProfile({
															...editedProfile,
															email: e.target.value,
														})
													}
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor={bioId} className="text-sm font-medium">
													个人简介
												</Label>
												<Textarea
													id={bioId}
													value={editedProfile.bio}
													onChange={(e) =>
														setEditedProfile({
															...editedProfile,
															bio: e.target.value,
														})
													}
													rows={3}
												/>
											</div>
											<div className="space-y-2">
												<Label
													htmlFor={locationId}
													className="text-sm font-medium"
												>
													位置
												</Label>
												<Input
													id={locationId}
													value={editedProfile.location}
													onChange={(e) =>
														setEditedProfile({
															...editedProfile,
															location: e.target.value,
														})
													}
													className="h-11"
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
										{stats.map((stat) => (
											<div
												key={stat.label}
												className="text-center p-6 rounded-lg bg-primary/5 border border-primary/10"
											>
												<div className="text-3xl font-bold text-primary">
													{stat.value}
												</div>
												<div className="text-sm text-muted-foreground mt-2">
													{stat.label}
												</div>
											</div>
										))}
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
									<CardDescription>已解锁 4 个成就</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<div className="p-4 rounded-lg bg-muted/50 border border-border/50">
											<div className="flex items-center gap-3">
												<div className="text-2xl">🎉</div>
												<div className="flex-1">
													<p className="text-sm font-medium">新手上路</p>
													<p className="text-xs text-muted-foreground">
														完成首次对话
													</p>
												</div>
											</div>
										</div>
										<div className="p-4 rounded-lg bg-muted/50 border border-border/50">
											<div className="flex items-center gap-3">
												<div className="text-2xl">💬</div>
												<div className="flex-1">
													<p className="text-sm font-medium">健谈者</p>
													<p className="text-xs text-muted-foreground">
														发送超过 100 条消息
													</p>
												</div>
											</div>
										</div>
										<div className="p-4 rounded-lg bg-muted/50 border border-border/50">
											<div className="flex items-center gap-3">
												<div className="text-2xl">⭐</div>
												<div className="flex-1">
													<p className="text-sm font-medium">早期用户</p>
													<p className="text-xs text-muted-foreground">
														加入早期体验计划
													</p>
												</div>
											</div>
										</div>
										<div className="p-4 rounded-lg bg-muted/50 border border-border/50">
											<div className="flex items-center gap-3">
												<div className="text-2xl">🔥</div>
												<div className="flex-1">
													<p className="text-sm font-medium">连续使用 7 天</p>
													<p className="text-xs text-muted-foreground">
														保持活跃使用
													</p>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* 最近活动 */}
					{activeSection === "activity" && (
						<div className="space-y-6 animate-in fade-in-50 duration-300">
							<div>
								<h2 className="text-2xl font-bold mb-2">最近活动</h2>
								<p className="text-sm text-muted-foreground">
									你的最近操作记录
								</p>
							</div>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2">
										<Activity className="h-5 w-5" />
										活动记录
									</CardTitle>
									<CardDescription>最近的操作历史</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{[
											{ action: "创建了新对话", time: "2 小时前", icon: "💬" },
											{ action: "修改了个人资料", time: "1 天前", icon: "👤" },
											{ action: "更改了设置", time: "3 天前", icon: "⚙️" },
											{ action: "获得新成就", time: "5 天前", icon: "🏆" },
											{ action: "导出了数据", time: "1 周前", icon: "📊" },
										].map((activity) => (
											<div
												key={`${activity.action}-${activity.time}`}
												className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30"
											>
												<div className="text-xl">{activity.icon}</div>
												<div className="flex-1">
													<p className="text-sm font-medium">
														{activity.action}
													</p>
													<p className="text-xs text-muted-foreground">
														{activity.time}
													</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}