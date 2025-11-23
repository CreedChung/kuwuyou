import { Lock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function SecuritySettings() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">安全</h2>
				<p className="text-sm text-muted-foreground">保护你的账户安全</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Lock className="h-5 w-5" />
						安全选项
					</CardTitle>
					<CardDescription>管理账户安全设置</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<Button variant="outline" className="w-full justify-start h-12">
						<Lock className="h-4 w-4 mr-3" />
						<span>修改密码</span>
					</Button>
					<Button variant="outline" className="w-full justify-start h-12">
						<Shield className="h-4 w-4 mr-3" />
						<div className="flex items-center justify-between flex-1">
							<span>两步验证</span>
							<Badge variant="secondary" className="text-xs">
								推荐
							</Badge>
						</div>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
