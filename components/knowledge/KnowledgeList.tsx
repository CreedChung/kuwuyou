"use client";

import { BookOpen, Loader2 } from "lucide-react";
import { Knowledge } from "./types";
import { KnowledgeCard } from "./KnowledgeCard";

interface KnowledgeListProps {
	loading: boolean;
	knowledgeList: Knowledge[];
	searchQuery: string;
	onKnowledgeClick: (knowledge: Knowledge) => void;
}

export function KnowledgeList({
	loading,
	knowledgeList,
	searchQuery,
	onKnowledgeClick,
}: KnowledgeListProps) {
	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
				<p className="text-sm text-muted-foreground">加载中...</p>
			</div>
		);
	}

	if (knowledgeList.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-center">
				<BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
				<h3 className="text-lg font-medium mb-2">暂无知识库</h3>
				<p className="text-sm text-muted-foreground mb-4">
					{searchQuery ? "未找到匹配的知识库" : "您还没有创建知识库"}
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
			{knowledgeList.map((knowledge) => (
				<KnowledgeCard
					key={knowledge.id}
					knowledge={knowledge}
					onClick={() => onKnowledgeClick(knowledge)}
				/>
			))}
		</div>
	);
}