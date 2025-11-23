import { Download, Settings, Upload } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
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

interface SystemSectionProps {
	maintenanceMode: boolean;
	autoBackup: boolean;
	onMaintenanceModeChange: (value: boolean) => void;
	onAutoBackupChange: (value: boolean) => void;
}

export function SystemSection({
	maintenanceMode,
	autoBackup,
	onMaintenanceModeChange,
	onAutoBackupChange,
}: SystemSectionProps) {
	const maintenanceId = useId();
	const autoBackupId = useId();
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">系统设置</h2>
				<p className="text-sm text-muted-foreground">配置系统参数和功能选项</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Settings className="h-5 w-5" />
						系统配置
					</CardTitle>
					<CardDescription>管理系统核心设置</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label htmlFor={maintenanceId} className="text-sm font-medium">
								维护模式
							</Label>
							<p className="text-xs text-muted-foreground">
								启用后用户将无法访问系统
							</p>
						</div>
						<Switch
							id={maintenanceId}
							checked={maintenanceMode}
							onCheckedChange={onMaintenanceModeChange}
						/>
					</div>

					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label htmlFor={autoBackupId} className="text-sm font-medium">
								自动备份
							</Label>
							<p className="text-xs text-muted-foreground">
								每天自动备份数据库
							</p>
						</div>
						<Switch
							id={autoBackupId}
							checked={autoBackup}
							onCheckedChange={onAutoBackupChange}
						/>
					</div>

					<Separator />

					<div className="space-y-3">
						<Label className="text-sm font-medium">数据库操作</Label>
						<div className="flex gap-3">
							<Button variant="outline" className="flex-1 gap-2">
								<Download className="h-4 w-4" />
								备份数据库
							</Button>
							<Button variant="outline" className="flex-1 gap-2">
								<Upload className="h-4 w-4" />
								恢复数据库
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
