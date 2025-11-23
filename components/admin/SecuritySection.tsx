import { Shield, UserCheck, UserX } from "lucide-react";
import { useId } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface SecuritySectionProps {
	twoFactorRequired: boolean;
	onTwoFactorRequiredChange: (value: boolean) => void;
}

export function SecuritySection({
	twoFactorRequired,
	onTwoFactorRequiredChange,
}: SecuritySectionProps) {
	const twoFactorId = useId();
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">安全监控</h2>
				<p className="text-sm text-muted-foreground">
					监控系统安全状态和访问日志
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Shield className="h-5 w-5" />
						安全设置
					</CardTitle>
					<CardDescription>配置安全策略和权限</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label htmlFor={twoFactorId} className="text-sm font-medium">
								强制两步验证
							</Label>
							<p className="text-xs text-muted-foreground">
								要求所有管理员启用两步验证
							</p>
						</div>
						<Switch
							id={twoFactorId}
							checked={twoFactorRequired}
							onCheckedChange={onTwoFactorRequiredChange}
						/>
					</div>

					<Separator />

					<div className="space-y-3">
						<Label className="text-sm font-medium">最近登录</Label>
						<div className="space-y-2">
							<div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
								<div className="flex items-center gap-3">
									<UserCheck className="h-4 w-4 text-green-500" />
									<div>
										<p className="text-sm font-medium">管理员登录</p>
										<p className="text-xs text-muted-foreground">
											IP: 192.168.1.1
										</p>
									</div>
								</div>
								<p className="text-xs text-muted-foreground">2分钟前</p>
							</div>
							<div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
								<div className="flex items-center gap-3">
									<UserX className="h-4 w-4 text-red-500" />
									<div>
										<p className="text-sm font-medium">登录失败</p>
										<p className="text-xs text-muted-foreground">
											IP: 203.0.113.1
										</p>
									</div>
								</div>
								<p className="text-xs text-muted-foreground">15分钟前</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
