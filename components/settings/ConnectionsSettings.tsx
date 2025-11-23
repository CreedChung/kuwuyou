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
	zhipuApiKey: string;
	showZhipuApiKey: boolean;
	zhipuApiKeySaved: boolean;
	onZhipuApiKeyChange: (value: string) => void;
	onToggleShowZhipuApiKey: () => void;
	onSaveZhipuApiKey: () => void;
	onClearZhipuApiKey: () => void;
}

export function ConnectionsSettings({
	zhipuApiKey,
	showZhipuApiKey,
	zhipuApiKeySaved,
	onZhipuApiKeyChange,
	onToggleShowZhipuApiKey,
	onSaveZhipuApiKey,
	onClearZhipuApiKey,
}: ConnectionsSettingsProps) {
	const zhipuApiKeyId = useId();
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
								Zhipu AI 密钥
							</CardTitle>
							<CardDescription>配置智谱 API 以启用 GLM 模型</CardDescription>
						</div>
						{zhipuApiKey && (
							<Badge className="gap-1.5 bg-green-500/10 text-green-500 border-green-500/20">
								<Check className="h-3 w-3" />
								已配置
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<Label htmlFor="zhipu-api-key" className="text-sm font-medium">
							Zhipu API Key
						</Label>
						<div className="flex gap-2">
							<div className="relative flex-1">
								<Input
									id={zhipuApiKeyId}
									type={showZhipuApiKey ? "text" : "password"}
									value={zhipuApiKey}
									onChange={(e) => onZhipuApiKeyChange(e.target.value)}
									placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx"
									className="pr-10 h-11"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full hover:bg-transparent"
									onClick={onToggleShowZhipuApiKey}
								>
									{showZhipuApiKey ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>
							</div>
							<Button
								onClick={onSaveZhipuApiKey}
								disabled={!zhipuApiKey.trim()}
								className="gap-2 min-w-[100px] h-11"
							>
								{zhipuApiKeySaved ? (
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
									href="https://open.bigmodel.cn/usercenter/apikeys"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline ml-1 font-medium"
								>
									获取 API 密钥
								</a>
							</p>
						</div>
					</div>
					{zhipuApiKey && (
						<Button
							variant="outline"
							onClick={onClearZhipuApiKey}
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
