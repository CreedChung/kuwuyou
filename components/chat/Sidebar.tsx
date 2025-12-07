"use client";
import { useRouter } from "next/navigation";
import {
	BookOpen,
	ChevronLeft,
	MessageSquarePlus,
	Phone,
	Search,
	Settings,
	Trash2,
	User,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SearchConversationsDialog } from "@/components/ui/search-conversations-dialog";
import {
	Sidebar as ShadcnSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { useAuth } from "@/hooks/useAuth";
import type { Conversation } from "./types";

interface SidebarProps {
	conversations: Conversation[];
	currentConversationId: string | null;
	onSelectConversation: (id: string) => void;
	onNewConversation: () => void;
	onDeleteConversation: (id: string) => void;
	onOpenKnowledgeBase?: () => void;
}

export function Sidebar({
	conversations,
	currentConversationId,
	onSelectConversation,
	onNewConversation,
	onDeleteConversation,
	onOpenKnowledgeBase,
}: SidebarProps) {
	const { state, toggleSidebar } = useSidebar();
	const isCollapsed = state === "collapsed";
	const [searchDialogOpen, setSearchDialogOpen] = React.useState(false);
	const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [conversationToDelete, setConversationToDelete] = React.useState<
		string | null
	>(null);
	const { signOut, user } = useAuth();
	const router = useRouter();

	// 从用户数据中提取信息
	const userName = user?.username || user?.email?.split("@")[0] || "用户";
	const userHandle = user?.email ? `@${user.email.split("@")[0]}` : "@user";
	const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
		userName
	)}&background=3b82f6&color=fff`;

	const handleLogout = async () => {
		setLogoutDialogOpen(false);
		await signOut();
		router.push("/");
	};

	const handleDeleteClick = (conversationId: string) => {
		setConversationToDelete(conversationId);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (conversationToDelete) {
			onDeleteConversation(conversationToDelete);
			setConversationToDelete(null);
		}
		setDeleteDialogOpen(false);
	};

	const handleDeleteCancel = () => {
		setConversationToDelete(null);
		setDeleteDialogOpen(false);
	};

	if (isCollapsed) {
		return (
			<div className="fixed left-0 top-0 z-50 p-2">
				<Button onClick={toggleSidebar} size="icon" variant="ghost">
					<ChevronLeft className="h-4 w-4 rotate-180" />
				</Button>
			</div>
		);
	}

	return (
		<ShadcnSidebar collapsible="icon" data-tutorial="sidebar">
			<SidebarHeader className="flex flex-col gap-2">
				<div className="flex items-center justify-end">
					<Button
						onClick={toggleSidebar}
						size="icon"
						variant="ghost"
						className="shrink-0"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
				</div>
				<Button
					onClick={onNewConversation}
					className="w-full justify-start"
					size="default"
					variant="outline"
					data-tutorial="new-conversation"
				>
					<MessageSquarePlus className="h-4 w-4" />
					<span className="ml-2">新建对话</span>
				</Button>
				<Button
					onClick={() => setSearchDialogOpen(true)}
					className="w-full justify-start"
					size="default"
					variant="outline"
				>
					<Search className="h-4 w-4" />
					<span className="ml-2">搜索对话</span>
				</Button>
				<Button
					onClick={onOpenKnowledgeBase}
					className="w-full justify-start"
					size="default"
					variant="outline"
					data-tutorial="knowledge-base"
				>
					<BookOpen className="h-4 w-4" />
					<span className="ml-2">知识库</span>
				</Button>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{conversations.length === 0 ? (
								<div className="flex h-full items-center justify-center px-4 py-8 text-center text-sm text-muted-foreground">
									暂无对话
								</div>
							) : (
								conversations.map((conversation) => (
									<SidebarMenuItem
										key={conversation.id}
										className="relative group"
									>
										<SidebarMenuButton
											onClick={() => onSelectConversation(conversation.id)}
											isActive={currentConversationId === conversation.id}
										>
											<MessageSquarePlus className="h-4 w-4 shrink-0" />
											<span className="flex-1 truncate">
												{conversation.title}
											</span>
										</SidebarMenuButton>
										<div
											role="button"
											tabIndex={0}
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteClick(conversation.id);
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													e.stopPropagation();
													handleDeleteClick(conversation.id);
												}
											}}
											className="opacity-0 group-hover:opacity-100 rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-opacity absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
											aria-label="删除对话"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</div>
									</SidebarMenuItem>
								))
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<UserProfileDropdown
							user={{
								name: userName,
								handle: userHandle,
							}}
							actions={[
								{
									icon: User,
									label: "资料",
									onClick: () => {
										window.location.href = "/profile";
									},
								},
							]}
							menuItems={[
								{
									icon: Settings,
									label: "设置",
									onClick: () => {
										window.location.href = "/settings";
									},
								},
								{
									icon: Trash2,
									label: "退出账号",
									onClick: () => setLogoutDialogOpen(true),
									isDestructive: true,
								},
							]}
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SearchConversationsDialog
				open={searchDialogOpen}
				onOpenChange={setSearchDialogOpen}
				conversations={conversations}
				onSelectConversation={onSelectConversation}
			/>

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>删除对话</DialogTitle>
						<DialogDescription>
							确定要删除这个对话吗？删除后将无法恢复。
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={handleDeleteCancel}>
							取消
						</Button>
						<Button variant="destructive" onClick={handleDeleteConfirm}>
							确定删除
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>退出登录</DialogTitle>
						<DialogDescription>
							确定要退出登录吗？退出后需要重新登录才能使用。
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setLogoutDialogOpen(false)}
						>
							取消
						</Button>
						<Button variant="destructive" onClick={handleLogout}>
							确定退出
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</ShadcnSidebar>
	);
}
