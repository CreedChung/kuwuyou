import { BarChart3, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function DataSettings() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">数据管理</h2>
				<p className="text-sm text-muted-foreground">管理你的数据和隐私</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Database className="h-5 w-5" />
						数据控制
					</CardTitle>
					<CardDescription>控制你的数据如何被使用</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<Button variant="outline" className="w-full justify-start h-12">
						<BarChart3 className="h-4 w-4 mr-3" />
						<span>导出数据</span>
					</Button>
					<Button
						variant="outline"
						className="w-full justify-start h-12 text-destructive border-destructive/50 hover:bg-destructive/10"
					>
						<Database className="h-4 w-4 mr-3" />
						<span>清除所有对话历史</span>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
