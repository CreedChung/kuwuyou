import { BarChart3, Clock, Globe, MessageSquare } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function AnalyticsSection() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">数据分析</h2>
				<p className="text-sm text-muted-foreground">
					查看详细的数据统计和分析报告
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						使用统计
					</CardTitle>
					<CardDescription>过去30天的使用数据</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
							<div className="flex items-center gap-3">
								<MessageSquare className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">总对话数</p>
									<p className="text-sm text-muted-foreground">
										用户发起的对话
									</p>
								</div>
							</div>
							<p className="text-2xl font-bold">45,678</p>
						</div>
						<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
							<div className="flex items-center gap-3">
								<Clock className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">平均响应时间</p>
									<p className="text-sm text-muted-foreground">AI 响应速度</p>
								</div>
							</div>
							<p className="text-2xl font-bold">1.2s</p>
						</div>
						<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
							<div className="flex items-center gap-3">
								<Globe className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">API 调用次数</p>
									<p className="text-sm text-muted-foreground">总请求数</p>
								</div>
							</div>
							<p className="text-2xl font-bold">123,456</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
