"use client";

import { Link } from "@tanstack/react-router";
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
						<Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-sm">
							<CardContent className="p-5">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
												知识库总数
											</p>
											<p className="text-3xl font-bold text-foreground">
												{total}
											</p>
										</div>
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
											<BookOpen className="h-6 w-6 text-primary" />
										</div>
									</div>
									<div className="pt-3 border-t border-border/50">
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">当前显示</span>
											<span className="font-semibold text-lg text-foreground">{currentCount}</span>
										</div>
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