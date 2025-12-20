"use client";

import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Knowledge, backgroundColors, iconMap, formatNumber } from "./types";

interface KnowledgeCardProps {
	knowledge: Knowledge;
	onClick?: () => void;
}

export function KnowledgeCard({ knowledge, onClick }: KnowledgeCardProps) {
	const cardContent = (
		<>
		<CardHeader className="pb-3">
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-start gap-3 flex-1 min-w-0">
					<div className="text-4xl shrink-0">
						{iconMap[knowledge.icon] || "📚"}
					</div>
					<div className="flex-1 min-w-0">
						<CardTitle className="text-base font-semibold mb-1 line-clamp-2">
							{knowledge.name}
						</CardTitle>
						<CardDescription className="text-xs line-clamp-2">
							{knowledge.description || "暂无描述"}
						</CardDescription>
					</div>
				</div>
			</div>
		</CardHeader>
		<CardContent className="pt-0">
			<div className="grid grid-cols-3 gap-2 text-center">
				<div className="bg-background/50 rounded-lg p-2">
					<div className="text-xs text-muted-foreground mb-1">文档数</div>
					<div className="font-semibold text-sm">{knowledge.document_size}</div>
				</div>
				<div className="bg-background/50 rounded-lg p-2">
					<div className="text-xs text-muted-foreground mb-1">总字数</div>
					<div className="font-semibold text-sm">{formatNumber(knowledge.word_num)}</div>
				</div>
				<div className="bg-background/50 rounded-lg p-2">
					<div className="text-xs text-muted-foreground mb-1">分词数</div>
					<div className="font-semibold text-sm">{formatNumber(knowledge.length)}</div>
				</div>
			</div>
			<div className="mt-3 flex items-center justify-between">
				<Badge variant="outline" className="text-xs">
					ID: {knowledge.id.slice(0, 8)}...
				</Badge>
				<Badge variant="secondary" className="text-xs">
					向量模型 #{knowledge.embedding_id}
				</Badge>
			</div>
		</CardContent>
		</>
	);

	return (
		<Link to={`/knowledge/${knowledge.id}`}>
			<Card
				className={cn(
					"group hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer border-2",
					backgroundColors[knowledge.background] || "bg-muted/30"
				)}
				onClick={onClick}
			>
				{cardContent}
			</Card>
		</Link>
	);
}