"use client";

import { Button } from "@/components/ui/button";

interface KnowledgePaginationProps {
	currentPage: number;
	total: number;
	pageSize?: number;
	onPageChange: (page: number) => void;
}

export function KnowledgePagination({
	currentPage,
	total,
	pageSize = 10,
	onPageChange,
}: KnowledgePaginationProps) {
	const totalPages = Math.ceil(total / pageSize);

	if (total <= pageSize) {
		return null;
	}

	return (
		<div className="border-t border-border/40 p-4">
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					disabled={currentPage === 1}
					onClick={() => onPageChange(currentPage - 1)}
				>
					上一页
				</Button>
				<span className="text-sm text-muted-foreground">
					第 {currentPage} 页 / 共 {totalPages} 页
				</span>
				<Button
					variant="outline"
					disabled={currentPage >= totalPages}
					onClick={() => onPageChange(currentPage + 1)}
				>
					下一页
				</Button>
			</div>
		</div>
	);
}