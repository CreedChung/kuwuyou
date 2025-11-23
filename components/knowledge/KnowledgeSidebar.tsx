"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface KnowledgeSidebarProps {
	total: number;
	currentCount: number;
}

export function KnowledgeSidebar({ total, currentCount }: KnowledgeSidebarProps) {
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
						<span>返回</span>
					</Button>
				</Link>
			</div>

			{/* 知识库标题 */}
			<div className="px-4 py-6">
				<h1 className="text-xl font-semibold flex items-center gap-2">
					<BookOpen className="h-5 w-5" />
					知识库
				</h1>
			</div>

			{/* 统计信息 */}
			<div className="px-4 pb-4">
				<Card className="bg-muted/50">
					<CardContent className="p-4">
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">知识库总数</span>
								<span className="font-bold text-lg">{total}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">当前显示</span>
								<span className="font-medium">{currentCount}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 快捷操作 */}
			<div className="flex-1 px-4 pb-4">
				{/* 预留其他操作按钮位置 */}
			</div>
		</div>
	);
}