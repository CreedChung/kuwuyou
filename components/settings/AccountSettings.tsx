import { CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AccountSettings() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">账户</h2>
				<p className="text-sm text-muted-foreground">管理你的账户信息</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<User className="h-5 w-5" />
						账户管理
					</CardTitle>
					<CardDescription>管理你的个人信息</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<Button variant="outline" className="w-full justify-start h-12">
						<User className="h-4 w-4 mr-3" />
						<span>编辑个人资料</span>
					</Button>
					<Button variant="outline" className="w-full justify-start h-12">
						<CreditCard className="h-4 w-4 mr-3" />
						<span>订阅计划</span>
					</Button>
					<Separator className="my-4" />
					<Button
						variant="outline"
						className="w-full justify-start h-12 text-destructive border-destructive/50 hover:bg-destructive/10"
					>
						<User className="h-4 w-4 mr-3" />
						<span>删除账户</span>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
