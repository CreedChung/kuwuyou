"use client";

import { FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
	KnowledgeDocument,
	embeddingStatusMap,
	knowledgeTypeMap
} from "./DocumentTypes";
import { formatNumber } from "./types";

interface DocumentCardProps {
	document: KnowledgeDocument;
	onClick?: () => void;
}

// 移除文件扩展名
const removeFileExtension = (filename: string): string => {
	const lastDotIndex = filename.lastIndexOf('.');
	if (lastDotIndex === -1 || lastDotIndex === 0) {
		return filename;
	}
	return filename.substring(0, lastDotIndex);
};

export function DocumentCard({ document, onClick }: DocumentCardProps) {
	const statusInfo = embeddingStatusMap[document.embedding_stat] || embeddingStatusMap[0];
	const hasError = document.embedding_stat === 3 && document.failInfo;
	const displayName = removeFileExtension(document.name || "未命名文档");
	
	// 只显示已完成(2)和失败(3)状态，不显示待处理(0)和处理中(1)
	const shouldShowStatus = document.embedding_stat === 2 || document.embedding_stat === 3;

	return (
		<TooltipProvider>
			<Card
				className={cn(
					"group hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer h-full flex flex-col",
					hasError && "border-red-200 bg-red-50/30"
				)}
				onClick={onClick}
			>
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between gap-2">
						<div className="flex items-start gap-3 flex-1 min-w-0">
							<div className="shrink-0">
								<FileText className="h-8 w-8 text-primary" />
							</div>
							<div className="flex-1 min-w-0">
								<Tooltip>
									<TooltipTrigger asChild>
										<CardTitle className="text-base font-semibold mb-1 line-clamp-2 break-all">
											{displayName}
										</CardTitle>
									</TooltipTrigger>
									<TooltipContent side="top" className="max-w-md">
										<p className="break-all">{displayName}</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<CardDescription className="text-xs line-clamp-1 break-all">
											{document.url || "无URL"}
										</CardDescription>
									</TooltipTrigger>
									<TooltipContent side="bottom" className="max-w-md">
										<p className="break-all text-xs">{document.url || "无URL"}</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
						{shouldShowStatus && (
							<Badge
								className={cn(
									"shrink-0",
									statusInfo.color,
									"text-white"
								)}
							>
								{statusInfo.label}
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent className="pt-0 flex-1 flex flex-col">
					{hasError && document.failInfo && (
						<div className="mb-3 p-2 bg-red-100 border border-red-200 rounded-lg flex items-start gap-2">
							<AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
							<div className="flex-1 min-w-0">
								<p className="text-xs font-medium text-red-900 break-all">
									向量化失败 (代码: {document.failInfo.embedding_code})
								</p>
								<p className="text-xs text-red-700 mt-1 break-all">
									{document.failInfo.embedding_msg}
								</p>
							</div>
						</div>
					)}
					
					<div className="grid grid-cols-3 gap-2 text-center">
						<div className="bg-background/50 rounded-lg p-2">
							<div className="text-xs text-muted-foreground mb-1">字数</div>
							<div className="font-semibold text-sm">{formatNumber(document.word_num)}</div>
						</div>
						<div className="bg-background/50 rounded-lg p-2">
							<div className="text-xs text-muted-foreground mb-1">长度</div>
							<div className="font-semibold text-sm">{formatNumber(document.length)}</div>
						</div>
						<div className="bg-background/50 rounded-lg p-2">
							<div className="text-xs text-muted-foreground mb-1">切片字数</div>
							<div className="font-semibold text-sm">{document.sentence_size}</div>
						</div>
					</div>
					
					<div className="mt-3 flex items-center justify-between gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Badge variant="outline" className="text-xs truncate max-w-[120px]">
									ID: {document.id.slice(0, 8)}...
								</Badge>
							</TooltipTrigger>
							<TooltipContent>
								<p className="text-xs">完整ID: {document.id}</p>
							</TooltipContent>
						</Tooltip>
						<Badge variant="secondary" className="text-xs shrink-0">
							{knowledgeTypeMap[document.knowledge_type] || "未知类型"}
						</Badge>
					</div>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}