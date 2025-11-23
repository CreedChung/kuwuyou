import Link from "next/link";
import {
	Activity,
	ArrowLeft,
	BarChart3,
	FileText,
	Settings,
	Shield,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminSection =
	| "overview"
	| "users"
	| "content"
	| "analytics"
	| "system"
	| "security";

interface SidebarItem {
	id: AdminSection;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
	{ id: "overview", label: "概览", icon: BarChart3 },
	{ id: "users", label: "用户管理", icon: Users },
	{ id: "content", label: "内容审核", icon: FileText },
	{ id: "analytics", label: "数据分析", icon: Activity },
	{ id: "system", label: "系统设置", icon: Settings },
	{ id: "security", label: "安全监控", icon: Shield },
];

interface AdminSidebarProps {
	activeSection: AdminSection;
	onSectionChange: (section: AdminSection) => void;
}

export function AdminSidebar({
	activeSection,
	onSectionChange,
}: AdminSidebarProps) {
	return (
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

			{/* 管理员标题 */}
			<div className="px-4 py-6">
				<div className="flex items-center gap-2 mb-2">
					<Shield className="h-5 w-5 text-primary" />
					<h1 className="text-xl font-semibold">管理员面板</h1>
				</div>
				<p className="text-xs text-muted-foreground">系统管理与监控</p>
			</div>

			{/* 管理分类列表 */}
			<nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
				{sidebarItems.map((item) => {
					const Icon = item.icon;
					const isActive = activeSection === item.id;
					return (
						<button
							type="button"
							key={item.id}
							onClick={() => onSectionChange(item.id)}
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
	);
}
