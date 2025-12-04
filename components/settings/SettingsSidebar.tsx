import Link from "next/link";
import {
	ArrowLeft,
	Bell,
	Database,
	Key,
	Settings,
	Shield,
	UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SettingSection =
	| "general"
	| "notifications"
	| "data"
	| "security"
	| "account";

interface SidebarItem {
	id: SettingSection;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
	{ id: "general", label: "常规", icon: Settings },
	{ id: "notifications", label: "通知", icon: Bell },
	{ id: "data", label: "数据管理", icon: Database },
	{ id: "security", label: "安全", icon: Shield },
	{ id: "account", label: "账户", icon: UserCircle },
];

interface SettingsSidebarProps {
	activeSection: SettingSection;
	onSectionChange: (section: SettingSection) => void;
}

export function SettingsSidebar({
	activeSection,
	onSectionChange,
}: SettingsSidebarProps) {
	return (
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

			{/* 设置标题 */}
			<div className="px-4 py-6">
				<h1 className="text-xl font-semibold">设置</h1>
			</div>

			{/* 设置分类列表 */}
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
