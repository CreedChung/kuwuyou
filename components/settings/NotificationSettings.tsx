import { AlertCircle, Bell, Check, HelpCircle, Send } from "lucide-react";
import { useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
	isSupported: boolean;
	permission: NotificationPermission;
	notificationsEnabled: boolean;
	onNotificationToggle: (checked: boolean) => void;
	onTestNotification: () => void;
}

export function NotificationSettings({
	isSupported,
	permission,
	notificationsEnabled,
	onNotificationToggle,
	onTestNotification,
}: NotificationSettingsProps) {
	const notificationsId = useId();
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">通知</h2>
				<p className="text-sm text-muted-foreground">
					管理浏览器通知权限和偏好设置
				</p>
			</div>

			{!isSupported && (
				<Card className="border-yellow-500/50 bg-yellow-500/10">
					<CardContent className="pt-6">
						<div className="flex items-start gap-3">
							<AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
							<div>
								<p className="text-sm font-medium text-yellow-500">
									浏览器不支持通知
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									您的浏览器不支持桌面通知功能,请使用现代浏览器如
									Chrome、Firefox 或 Edge。
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg flex items-center gap-2">
								<Bell className="h-5 w-5" />
								浏览器通知
							</CardTitle>
							<CardDescription>接收重要更新和消息提醒</CardDescription>
						</div>
						{permission === "granted" && (
							<Badge className="gap-1.5 bg-green-500/10 text-green-500 border-green-500/20">
								<Check className="h-3 w-3" />
								已授权
							</Badge>
						)}
						{permission === "denied" && (
							<Badge className="gap-1.5 bg-red-500/10 text-red-500 border-red-500/20">
								<AlertCircle className="h-3 w-3" />
								已拒绝
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label htmlFor="notifications" className="text-sm font-medium">
								启用浏览器通知
							</Label>
							<p className="text-xs text-muted-foreground">
								允许网站发送桌面通知
							</p>
						</div>
						<Switch
							id={notificationsId}
							checked={notificationsEnabled}
							onCheckedChange={onNotificationToggle}
							disabled={!isSupported || permission === "denied"}
						/>
					</div>

					{permission === "denied" && (
						<div className="p-4 rounded-lg border border-red-500/50 bg-red-500/10">
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
								<div className="space-y-1">
									<p className="text-sm font-medium text-red-500">
										通知权限已被拒绝
									</p>
									<p className="text-xs text-muted-foreground">
										请在浏览器设置中允许通知权限。您可以点击地址栏左侧的锁图标,然后在权限设置中修改通知权限。
									</p>
								</div>
							</div>
						</div>
					)}

					{notificationsEnabled && permission === "granted" && (
						<div className="space-y-3 pt-4 border-t">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">测试通知</p>
									<p className="text-xs text-muted-foreground">
										发送一条测试通知以确保功能正常
									</p>
								</div>
								<Button
									onClick={onTestNotification}
									variant="outline"
									size="sm"
									className="gap-2"
								>
									<Send className="h-4 w-4" />
									发送测试
								</Button>
							</div>
						</div>
					)}

					<div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
						<HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground leading-relaxed">
								<strong className="text-foreground">关于通知:</strong>
								启用后,您将在收到新消息时收到桌面通知。通知仅在浏览器窗口不活跃时显示。
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
