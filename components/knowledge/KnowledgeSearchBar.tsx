"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface KnowledgeSearchBarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	total: number;
}

export function KnowledgeSearchBar({ 
	searchQuery, 
	onSearchChange, 
	total 
}: KnowledgeSearchBarProps) {
	return (
		<div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="p-4 flex items-center gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="搜索知识库..."
						className="pl-10 h-10"
					/>
				</div>
				<Badge variant="secondary" className="h-10 px-4">
					共 {total} 个知识库
				</Badge>
			</div>
		</div>
	);
}