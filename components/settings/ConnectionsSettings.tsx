import { Check, Eye, EyeOff, HelpCircle, Key } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConnectionsSettingsProps {
	siliconflowApiKey: string;
	showSiliconflowApiKey: boolean;
	siliconflowApiKeySaved: boolean;
	onSiliconflowApiKeyChange: (value: string) => void;
	onToggleShowSiliconflowApiKey: () => void;
	onSaveSiliconflowApiKey: () => void;
	onClearSiliconflowApiKey: () => void;
}

export function ConnectionsSettings({
	siliconflowApiKey,
	showSiliconflowApiKey,
	siliconflowApiKeySaved,
	onSiliconflowApiKeyChange,
	onToggleShowSiliconflowApiKey,
	onSaveSiliconflowApiKey,
	onClearSiliconflowApiKey,
}: ConnectionsSettingsProps) {
	const siliconflowApiKeyId = useId();
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">应用与连接器</h2>
				<p className="text-sm text-muted-foreground">管理 API 密钥和集成</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg flex items-center gap-2">
								<Key className="h-5 w-5" />
								SiliconFlow AI 密钥
							</CardTitle>
							<CardDescription>配置 SiliconFlow API 以启用 DeepSeek 模型</CardDescription>
						</div>
						{siliconflowApiKey && (
							<Badge className="gap-1.5 bg-green-500/10 text-green-500 border-green-500/20">
								<Check className="h-3 w-3" />
								已配置
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<Label htmlFor="siliconflow-api-key" className="text-sm font-medium">
							SiliconFlow API Key
						</Label>
						<div className="flex gap-2">
							<div className="relative flex-1">
								<Input
									id={siliconflowApiKeyId}
									type={showSiliconflowApiKey ? "text" : "password"}
									value={siliconflowApiKey}
									onChange={(e) => onSiliconflowApiKeyChange(e.target.value)}
									placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx"
									className="pr-10 h-11"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full hover:bg-transparent"
									onClick={onToggleShowSiliconflowApiKey}
								>
									{showSiliconflowApiKey ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>
							</div>
							<Button
								onClick={onSaveSiliconflowApiKey}
								disabled={!siliconflowApiKey.trim()}
								className="gap-2 min-w-[100px] h-11"
							>
								{siliconflowApiKeySaved ? (
									<>
										<Check className="h-4 w-4" />
										已保存
									</>
								) : (
									"保存密钥"
								)}
							</Button>
						</div>
						<div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
							<HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
							<p className="text-xs text-muted-foreground leading-relaxed">
								你的 API 密钥将被安全地存储在浏览器本地。
								<a
									href="https://siliconflow.cn/api-keys"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline ml-1 font-medium"
								>
									获取 API 密钥
								</a>
							</p>
						</div>
					</div>
					{siliconflowApiKey && (
						<Button
							variant="outline"
							onClick={onClearSiliconflowApiKey}
							className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 h-10"
						>
							清除 API 密钥
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
