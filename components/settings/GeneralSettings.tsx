import { Moon, Palette, Sun, Sparkles, HelpCircle } from "lucide-react";
import { useId, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useThemeStore, type Theme } from "@/stores/themeStore";
import { resetTutorial } from "@/utils/tutorialManager";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

interface GeneralSettingsProps {
	darkMode: boolean;
	onDarkModeToggle: () => void;
}

export function GeneralSettings({
	darkMode,
	onDarkModeToggle,
}: GeneralSettingsProps) {
	const darkModeId = useId();
	const { theme, setTheme } = useThemeStore();
	const { toast } = useToast();

	const handleResetTutorial = () => {
		resetTutorial();
		toast({
			title: "新手教程已重置",
			description: "下次进入聊天页面时将重新显示新手教程",
		});
	};

	const themeOptions: { value: Theme; label: string; icon: React.ReactNode; description: string }[] = [
		{
			value: 'default',
			label: '默认主题',
			icon: <Palette className="h-5 w-5" />,
			description: '经典简约风格'
		},
		{
			value: 'tech',
			label: '科技主题',
			icon: <Sparkles className="h-5 w-5" />,
			description: '未来科技感'
		}
	];

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">常规</h2>
				<p className="text-sm text-muted-foreground">管理基本设置和偏好</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Palette className="h-5 w-5" />
						外观
					</CardTitle>
					<CardDescription>自定义视觉体验</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<Label className="text-sm font-medium">主题风格</Label>
						<div className="grid grid-cols-2 gap-3">
							{themeOptions.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => setTheme(option.value)}
									className={`
										relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all overflow-hidden group
										${theme === option.value
											? option.value === 'tech'
												? 'border-primary bg-primary/10 shadow-[0_0_20px_-5px_var(--primary)]'
												: 'border-primary bg-primary/5 shadow-sm'
											: 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
										}
									`}
								>
									{option.value === 'tech' && theme === 'tech' && (
										<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
									)}
									<div className="flex items-center gap-2 text-foreground relative z-10">
										{option.icon}
										<span className="font-medium">{option.label}</span>
									</div>
									<p className="text-xs text-muted-foreground text-left relative z-10">
										{option.description}
									</p>
									{theme === option.value && (
										<div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${option.value === 'tech' ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-primary'}`} />
									)}
								</button>
							))}
						</div>
					</div>

					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label htmlFor={darkModeId} className="text-sm font-medium">
								深色模式
							</Label>
							<p className="text-xs text-muted-foreground">护眼的深色主题</p>
						</div>
						<div className="flex items-center gap-3">
							{darkMode ? (
								<Moon className="h-4 w-4 text-muted-foreground" />
							) : (
								<Sun className="h-4 w-4 text-muted-foreground" />
							)}
							<Switch
								id={darkModeId}
								checked={darkMode}
								onCheckedChange={onDarkModeToggle}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<HelpCircle className="h-5 w-5" />
						帮助与指引
					</CardTitle>
					<CardDescription>管理新手教程和帮助信息</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<Label className="text-sm font-medium">
								重置新手教程
							</Label>
							<p className="text-xs text-muted-foreground">
								下次进入聊天页面时将重新显示新手教程
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleResetTutorial}
						>
							重置
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
