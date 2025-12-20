"use client";
import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export function NotFoundPage() {
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FileQuestion className="size-6" />
					</EmptyMedia>
					<EmptyTitle>页面未找到</EmptyTitle>
					<EmptyDescription>
						抱歉，您访问的页面不存在或已被移除。
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<div className="flex gap-2">
						<Button asChild>
							<Link href="/">返回首页</Link>
						</Button>
						<Button variant="outline" onClick={() => window.history.back()}>
							返回上一页
						</Button>
					</div>
				</EmptyContent>
			</Empty>
		</div>
	);
}
