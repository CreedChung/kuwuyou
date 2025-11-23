"use client";

import {
	ArrowUpRight,
	CircleFadingPlus,
	FileInput,
	FolderPlus,
	Search,
} from "lucide-react";
import * as React from "react";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";

function CommandDemo() {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<button
				className="inline-flex h-9 w-fit rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
				onClick={() => setOpen(true)}
			>
				<span className="flex grow items-center">
					<Search
						className="-ms-1 me-3 text-muted-foreground/80"
						size={16}
						strokeWidth={2}
						aria-hidden="true"
					/>
					<span className="font-normal text-muted-foreground/70">搜索</span>
				</span>
				<kbd className="-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
					⌘K
				</kbd>
			</button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="输入命令或搜索..." />
				<CommandList>
					<CommandEmpty>未找到结果。</CommandEmpty>
					<CommandGroup heading="快速开始">
						<CommandItem>
							<FolderPlus
								size={16}
								strokeWidth={2}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>新建文件夹</span>
							<CommandShortcut className="justify-center">⌘N</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<FileInput
								size={16}
								strokeWidth={2}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>导入文档</span>
							<CommandShortcut className="justify-center">⌘I</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<CircleFadingPlus
								size={16}
								strokeWidth={2}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>添加区块</span>
							<CommandShortcut className="justify-center">⌘B</CommandShortcut>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="导航">
						<CommandItem>
							<ArrowUpRight
								size={16}
								strokeWidth={2}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>前往仪表板</span>
						</CommandItem>
						<CommandItem>
							<ArrowUpRight
								size={16}
								strokeWidth={2}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>前往应用</span>
						</CommandItem>
						<CommandItem>
							<ArrowUpRight
								size={16}
								strokeWidth={2}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>前往连接</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}

export { CommandDemo };
