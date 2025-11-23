"use client";
import Link from "next/link";
import {
	BarChart,
	Brain,
	Calculator,
	CodeIcon,
	FileText,
	Handshake,
	HelpCircle,
	Leaf,
	type LucideIcon,
	MessageCircle,
	RotateCcw,
	Search,
	Shield,
	Star,
	Users,
} from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type LinkItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
};

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	// 使用静态 ID 避免 hydration mismatch
	const mobileMenuId = "mobile-menu";

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-b border-transparent", {
				"bg-background/95 supports-backdrop-filter:bg-background/50 border-border backdrop-blur-lg":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex items-center gap-5">
					<img
						src="/logo.jpg"
						alt="库无忧助手"
						className="h-8 object-contain"
					/>

					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent">
									产品
								</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-background p-1 pr-1.5">
									<ul className="bg-popover grid w-lg grid-cols-2 gap-2 rounded-md border p-2 shadow">
										{productLinks.map((item) => (
											<li key={item.title}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent">
									关于
								</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
									<div className="grid w-lg grid-cols-2 gap-2">
										<ul className="bg-popover space-y-2 rounded-md border p-2 shadow">
											{companyLinks.map((item) => (
												<li key={item.title}>
													<ListItem {...item} />
												</li>
											))}
										</ul>
										<ul className="space-y-2 p-3">
											{companyLinks2.map((item) => (
												<li key={item.title}>
													<NavigationMenuLink
														href={item.href}
														className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2"
													>
														<item.icon className="text-foreground size-4" />
														<span className="font-medium">{item.title}</span>
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button>开始使用</Button>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls={mobileMenuId}
					aria-label="切换菜单"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
			<MobileMenu
				id={mobileMenuId}
				open={open}
				className="flex flex-col justify-between gap-2 overflow-y-auto"
			>
				<NavigationMenu className="max-w-full">
					<div className="flex w-full flex-col gap-y-2">
						<span className="text-sm">产品</span>
						{productLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						<span className="text-sm">关于</span>
						{companyLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						{companyLinks2.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
					</div>
				</NavigationMenu>
				<div className="flex flex-col gap-2">
					<Button className="w-full">开始使用</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<"div"> & {
	id: string;
	open: boolean;
};

function MobileMenu({ id, open, children, className, ...props }: MobileMenuProps) {
	// 避免在服务器端渲染移动端菜单，防止 hydration mismatch
	const [isClient, setIsClient] = React.useState(false);
	
	React.useEffect(() => {
		setIsClient(true);
	}, []);

	if (!open || !isClient) return null;

	return createPortal(
		<div
			id={id}
			className={cn(
				"bg-background/95 supports-backdrop-filter:bg-background/50 backdrop-blur-lg",
				"fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden",
			)}
		>
			<div
				data-slot={open ? "open" : "closed"}
				className={cn(
					"data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
					"size-full p-4",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function ListItem({
	title,
	description,
	icon: Icon,
	className,
	href,
	...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
	return (
		<NavigationMenuLink
			className={cn(
				"w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm p-2",
				className,
			)}
			{...props}
			asChild
		>
			<Link href={href}>
				<div className="bg-background/40 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm">
					<Icon className="text-foreground size-5" />
				</div>
				<div className="flex flex-col items-start justify-center">
					<span className="font-medium">{title}</span>
					<span className="text-muted-foreground text-xs">{description}</span>
				</div>
			</Link>
		</NavigationMenuLink>
	);
}

const productLinks: LinkItem[] = [
	{
		title: "无忧问答",
		href: "#",
		description: "智能问答系统",
		icon: MessageCircle,
	},
	{
		title: "无忧计算",
		href: "#",
		description: "强大的计算能力",
		icon: Calculator,
	},
	{
		title: "无忧分析",
		href: "#",
		description: "深度数据分析",
		icon: BarChart,
	},
	{
		title: "无忧思考",
		href: "#",
		description: "智能思维辅助",
		icon: Brain,
	},
	{
		title: "无忧搜索",
		href: "#",
		description: "精准信息检索",
		icon: Search,
	},
	{
		title: "API",
		href: "#",
		description: "使用我们的 API 构建自定义集成",
		icon: CodeIcon,
	},
];

const companyLinks: LinkItem[] = [
	{
		title: "关于我们",
		href: "#",
		description: "了解更多关于我们的故事和团队",
		icon: Users,
	},
];

const companyLinks2: LinkItem[] = [
	{
		title: "服务条款",
		href: "#",
		icon: FileText,
	},
	{
		title: "隐私政策",
		href: "#",
		icon: Shield,
	},
];

function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);
	const [isClient, setIsClient] = React.useState(false);

	React.useEffect(() => {
		setIsClient(true);
	}, []);

	const onScroll = React.useCallback(() => {
		if (isClient) {
			setScrolled(window.scrollY > threshold);
		}
	}, [threshold, isClient]);

	React.useEffect(() => {
		if (!isClient) return;
		
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, [onScroll, isClient]);

	// also check on first load
	React.useEffect(() => {
		if (isClient) {
			onScroll();
		}
	}, [onScroll, isClient]);

	return scrolled;
}