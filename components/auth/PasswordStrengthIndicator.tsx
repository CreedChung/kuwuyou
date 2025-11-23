import { Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
	password: string;
	score: number;
	label: string;
	checks?: {
		length: boolean;
		uppercase: boolean;
		number: boolean;
		special: boolean;
	};
}

export function PasswordStrengthIndicator({
	password,
	score,
	label,
	checks,
}: PasswordStrengthIndicatorProps) {
	if (!password) return null;

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between text-xs">
				<span className="text-gray-600">密码强度:</span>
				<span
					className={`font-medium ${
						score <= 40
							? "text-red-500"
							: score <= 60
								? "text-yellow-500"
								: score <= 80
									? "text-blue-500"
									: "text-green-500"
					}`}
				>
					{label}
				</span>
			</div>
			<Progress value={score} className="h-1.5 bg-gray-200" />
			<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
				<div
					className={`flex items-center gap-1 ${
						checks?.length ? "text-green-500" : "text-gray-400"
					}`}
				>
					{checks?.length ? (
						<Check className="w-3 h-3" />
					) : (
						<X className="w-3 h-3" />
					)}
					<span>至少8个字符</span>
				</div>
				<div
					className={`flex items-center gap-1 ${
						checks?.uppercase ? "text-green-500" : "text-gray-400"
					}`}
				>
					{checks?.uppercase ? (
						<Check className="w-3 h-3" />
					) : (
						<X className="w-3 h-3" />
					)}
					<span>包含大写字母</span>
				</div>
				<div
					className={`flex items-center gap-1 ${
						checks?.number ? "text-green-500" : "text-gray-400"
					}`}
				>
					{checks?.number ? (
						<Check className="w-3 h-3" />
					) : (
						<X className="w-3 h-3" />
					)}
					<span>包含数字</span>
				</div>
				<div
					className={`flex items-center gap-1 ${
						checks?.special ? "text-green-500" : "text-gray-400"
					}`}
				>
					{checks?.special ? (
						<Check className="w-3 h-3" />
					) : (
						<X className="w-3 h-3" />
					)}
					<span>包含特殊字符</span>
				</div>
			</div>
		</div>
	);
}
