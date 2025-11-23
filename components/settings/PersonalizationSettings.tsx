import { Database, Sparkles, Zap } from "lucide-react";
import { useId } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface PersonalizationSettingsProps {
	model: string;
	onModelChange: (model: string) => void;
}

export function PersonalizationSettings({
	model,
	onModelChange,
}: PersonalizationSettingsProps) {
	const modelId = useId();
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div>
				<h2 className="text-2xl font-bold mb-2">个性化</h2>
				<p className="text-sm text-muted-foreground">自定义你的体验</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Sparkles className="h-5 w-5" />
						AI 模型
					</CardTitle>
					<CardDescription>选择默认的 AI 模型</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="model" className="text-sm font-medium">
							默认模型
						</Label>
						<Select value={model} onValueChange={onModelChange}>
							<SelectTrigger id={modelId} className="h-11">
								<SelectValue placeholder="选择模型" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="glm-4-plus">
									<div className="flex items-center gap-2">
										<Sparkles className="h-4 w-4 text-primary" />
										<span>GLM-4 Plus</span>
										<Badge variant="secondary" className="ml-auto text-xs">
											推荐
										</Badge>
									</div>
								</SelectItem>
								<SelectItem value="glm-4-flash">
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4 text-blue-500" />
										<span>GLM-4 Flash</span>
									</div>
								</SelectItem>
								<SelectItem value="glm-4v-plus">
									<div className="flex items-center gap-2">
										<Database className="h-4 w-4 text-purple-500" />
										<span>GLM-4V Plus</span>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
