"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface KnowledgeSearchBarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
}

export function KnowledgeSearchBar({
	searchQuery,
	onSearchChange
}: KnowledgeSearchBarProps) {
	return (
		<div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="p-6">
				<div className="relative max-w-2xl">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="搜索知识库名称或描述..."
						className="pl-10 h-11 text-base"
					/>
				</div>
			</div>
		</div>
	);
}