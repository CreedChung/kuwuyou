import { Moon, Palette, Sun } from "lucide-react";
import { useId } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface GeneralSettingsProps {
	darkMode: boolean;
	onDarkModeToggle: () => void;
}

export function GeneralSettings({
	darkMode,
	onDarkModeToggle,
}: GeneralSettingsProps) {
	const darkModeId = useId();
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
		</div>
	);
}
