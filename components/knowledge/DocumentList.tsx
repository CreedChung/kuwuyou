"use client";

import { FileText, Loader2 } from "lucide-react";
import { KnowledgeDocument } from "./DocumentTypes";
import { DocumentCard } from "./DocumentCard";

interface DocumentListProps {
	loading: boolean;
	documents: KnowledgeDocument[];
	searchQuery: string;
	onDocumentClick?: (document: KnowledgeDocument) => void;
}

export function DocumentList({
	loading,
	documents,
	searchQuery,
	onDocumentClick,
}: DocumentListProps) {
	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
				<p className="text-sm text-muted-foreground">加载中...</p>
			</div>
		);
	}

	if (documents.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-center">
				<FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
				<h3 className="text-lg font-medium mb-2">暂无文档</h3>
				<p className="text-sm text-muted-foreground mb-4">
					{searchQuery ? "未找到匹配的文档" : "该知识库还没有文档"}
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
			{documents.map((document) => (
				<DocumentCard
					key={document.id}
					document={document}
					onClick={() => onDocumentClick?.(document)}
				/>
			))}
		</div>
	);
}