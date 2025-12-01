"use client";

import { useState } from "react";
import { Download, Settings, Upload, Server, Database, Zap, AlertCircle } from "lucide-react";
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
import { useToast } from "@/hooks/useToast";

interface SystemSectionProps {
	autoBackup: boolean;
	onAutoBackupChange: (value: boolean) => void;
}

export function SystemSection({
	autoBackup,
	onAutoBackupChange,
}: SystemSectionProps) {
	const autoBackupId = useId();
	const autoUpdateId = useId();
	const [autoUpdate, setAutoUpdate] = useState(true);
	const [backing, setBacking] = useState(false);
	const { toast } = useToast();

	const handleBackup = async () => {
		setBacking(true);
		try {
			const response = await fetch('/api/admin/system/backup', {
				method: 'POST',
			});

			const result = await response.json();

			if (result.success) {
				toast({
					title: "备份成功",
					description: result.message || "数据库已成功备份",
				});
			} else {
				toast({
					title: "备份失败",
					description: result.error || "数据库备份失败",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "备份失败",
				description: "网络错误，请稍后重试",
				variant: "destructive",
			});
		} finally {
			setBacking(false);
		}
	};

	const handleSettingChange = async (setting: string, value: boolean) => {
		try {
			const response = await fetch('/api/admin/system', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ setting, value }),
			});

			const result = await response.json();

			if (result.success) {
				toast({
					title: "设置已更新",
					description: result.message,
				});
			}
		} catch (error) {
			console.error('更新设置失败:', error);
		}
	};

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">系统设置</h2>
				<p className="text-sm text-muted-foreground">配置系统参数和功能选项</p>
			</div>

			{/* 系统配置 */}
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
							onCheckedChange={(checked) => {
								onAutoBackupChange(checked);
								handleSettingChange('autoBackup', checked);
							}}
						/>
					</div>

					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label htmlFor={autoUpdateId} className="text-sm font-medium">
								自动更新
							</Label>
							<p className="text-xs text-muted-foreground">
								自动检查并安装系统更新
							</p>
						</div>
						<Switch
							id={autoUpdateId}
							checked={autoUpdate}
							onCheckedChange={(checked) => {
								setAutoUpdate(checked);
								handleSettingChange('autoUpdate', checked);
							}}
						/>
					</div>

					<Separator />

					<div className="space-y-3">
						<Label className="text-sm font-medium">数据库操作</Label>
						<div className="flex gap-3">
							<Button
								variant="outline"
								className="flex-1 gap-2"
								onClick={handleBackup}
								disabled={backing}
							>
								<Download className="h-4 w-4" />
								{backing ? '备份中...' : '备份数据库'}
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
