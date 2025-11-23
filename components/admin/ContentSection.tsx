import { FileText } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function ContentSection() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">内容审核</h2>
				<p className="text-sm text-muted-foreground">
					审核和管理用户生成的内容
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<FileText className="h-5 w-5" />
						待审核内容
					</CardTitle>
					<CardDescription>需要人工审核的内容列表</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-center py-12">
						<FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<p className="text-sm text-muted-foreground">暂无待审核内容</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
