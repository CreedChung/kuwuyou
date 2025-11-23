"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import {
	Archive,
	ArrowLeft,
	BookOpen,
	Calendar,
	Download,
	Edit,
	Eye,
	File,
	FileCode,
	FileText,
	Filter,
	FolderOpen,
	Image as ImageIcon,
	MoreVertical,
	Plus,
	Search,
	Tag,
	Trash2,
	Upload,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type KnowledgeSection = "all" | "documents" | "images" | "code" | "archives";

interface SidebarItem {
	id: KnowledgeSection;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	count?: number;
}

interface KnowledgeItem {
	id: string;
	name: string;
	type: "document" | "image" | "code" | "archive";
	size: string;
	updatedAt: string;
	tags: string[];
}

const sidebarItems: SidebarItem[] = [
	{ id: "all", label: "全部文件", icon: FolderOpen, count: 12 },
	{ id: "documents", label: "文档", icon: FileText, count: 8 },
	{ id: "images", label: "图片", icon: ImageIcon, count: 2 },
	{ id: "code", label: "代码", icon: FileCode, count: 1 },
	{ id: "archives", label: "归档", icon: Archive, count: 1 },
];

const mockKnowledgeItems: KnowledgeItem[] = [
	{
		id: "1",
		name: "产品需求文档.pdf",
		type: "document",
		size: "2.4 MB",
		updatedAt: "2024-01-20",
		tags: ["需求", "产品"],
	},
	{
		id: "2",
		name: "API 接口文档.md",
		type: "document",
		size: "156 KB",
		updatedAt: "2024-01-19",
		tags: ["技术", "API"],
	},
	{
		id: "3",
		name: "系统架构图.png",
		type: "image",
		size: "890 KB",
		updatedAt: "2024-01-18",
		tags: ["架构", "设计"],
	},
	{
		id: "4",
		name: "数据库设计.sql",
		type: "code",
		size: "45 KB",
		updatedAt: "2024-01-17",
		tags: ["数据库", "SQL"],
	},
	{
		id: "5",
		name: "用户手册.docx",
		type: "document",
		size: "3.2 MB",
		updatedAt: "2024-01-16",
		tags: ["文档", "手册"],
	},
	{
		id: "6",
		name: "UI设计稿.fig",
		type: "image",
		size: "1.5 MB",
		updatedAt: "2024-01-15",
		tags: ["设计", "UI"],
	},
];

export default function KnowledgePage() {
	const [activeSection, setActiveSection] = useState<KnowledgeSection>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [knowledgeItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);

	const getFileIcon = (type: KnowledgeItem["type"]) => {
		switch (type) {
			case "document":
				return FileText;
			case "image":
				return ImageIcon;
			case "code":
				return FileCode;
			case "archive":
				return Archive;
			default:
				return File;
		}
	};

	const filteredItems = knowledgeItems.filter((item) => {
		const matchesSearch = item.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesSection =
			activeSection === "all" || item.type === activeSection.slice(0, -1);
		return matchesSearch && matchesSection;
	});

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
							<span>返回</span>
						</Button>
					</Link>
				</div>

				{/* 知识库标题 */}
				<div className="px-4 py-6">
					<h1 className="text-xl font-semibold flex items-center gap-2">
						<BookOpen className="h-5 w-5" />
						知识库
					</h1>
				</div>

				{/* 上传按钮 */}
				<div className="px-4 pb-4">
					<Button className="w-full gap-2 h-10">
						<Upload className="h-4 w-4" />
						上传文件
					</Button>
				</div>

				{/* 分类列表 */}
				<nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
					{sidebarItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeSection === item.id;
						return (
							<button
								key={item.id}
								onClick={() => setActiveSection(item.id)}
								className={cn(
									"w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
									isActive
										? "bg-muted text-foreground"
										: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
								)}
							>
								<div className="flex items-center gap-3">
									<Icon className="h-4 w-4 shrink-0" />
									<span>{item.label}</span>
								</div>
								{item.count !== undefined && (
									<Badge
										variant="secondary"
										className="h-5 px-1.5 text-xs font-medium"
									>
										{item.count}
									</Badge>
								)}
							</button>
						);
					})}
				</nav>

				{/* 存储空间信息 */}
				<div className="p-4 border-t border-border/40">
					<Card className="bg-muted/50">
						<CardContent className="p-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">存储空间</span>
									<span className="font-medium">8.1 GB / 15 GB</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div
										className="bg-primary rounded-full h-2 transition-all"
										style={{ width: "54%" }}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* 右侧内容区域 */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* 顶部搜索栏 */}
				<div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="p-4 flex items-center gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="搜索知识库..."
								className="pl-10 h-10"
							/>
						</div>
						<Button variant="outline" size="icon" className="h-10 w-10">
							<Filter className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* 文件列表 */}
				<div className="flex-1 overflow-y-auto p-6">
					{filteredItems.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center">
							<FolderOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
							<h3 className="text-lg font-medium mb-2">暂无文件</h3>
							<p className="text-sm text-muted-foreground mb-4">
								{searchQuery ? "未找到匹配的文件" : "开始上传您的第一个文件"}
							</p>
							<Button className="gap-2">
								<Plus className="h-4 w-4" />
								上传文件
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
							{filteredItems.map((item) => {
								const Icon = getFileIcon(item.type);
								return (
									<Card
										key={item.id}
										className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
									>
										<CardHeader className="pb-3">
											<div className="flex items-start justify-between gap-2">
												<div className="flex items-start gap-3 flex-1 min-w-0">
													<div className="p-2 rounded-lg bg-primary/10 shrink-0">
														<Icon className="h-5 w-5 text-primary" />
													</div>
													<div className="flex-1 min-w-0">
														<CardTitle className="text-sm font-medium truncate">
															{item.name}
														</CardTitle>
														<CardDescription className="text-xs mt-1">
															{item.size}
														</CardDescription>
													</div>
												</div>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
														>
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem className="gap-2">
															<Eye className="h-4 w-4" />
															查看
														</DropdownMenuItem>
														<DropdownMenuItem className="gap-2">
															<Edit className="h-4 w-4" />
															编辑
														</DropdownMenuItem>
														<DropdownMenuItem className="gap-2">
															<Download className="h-4 w-4" />
															下载
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem className="gap-2 text-destructive">
															<Trash2 className="h-4 w-4" />
															删除
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</CardHeader>
										<CardContent className="pt-0">
											<div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
												<Calendar className="h-3 w-3" />
												<span>{item.updatedAt}</span>
											</div>
											<div className="flex flex-wrap gap-1.5">
												{item.tags.map((tag) => (
													<Badge
														key={tag}
														variant="secondary"
														className="text-xs h-5 gap-1"
													>
														<Tag className="h-2.5 w-2.5" />
														{tag}
													</Badge>
												))}
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}