"use client";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function Hero() {
	const router = useRouter();
	const { user } = useAuth();

	const handleGetStarted = () => {
		if (user) {
			// 已登录，跳转到聊天页面
			router.push("/chat");
		} else {
			// 未登录，跳转到登录页面
			router.push("/auth/login");
		}
	};

	return (
		<div className="w-full pb-10 lg:pb-20">
			<div className="container mx-auto">
				<div className="flex flex-col gap-8 items-center">
					<div className="bg-muted rounded-md w-80 md:w-96 overflow-hidden">
						<img
							src="/logo.jpg"
							alt="库无忧智能库存管理系统"
							className="w-full h-auto object-contain"
						/>
					</div>
					<div className="flex gap-4 flex-col items-center text-center">
						<div>
							<Badge variant="outline">正式上线！</Badge>
						</div>
						<div className="flex gap-4 flex-col items-center">
							<h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter font-regular">
								库无忧助手
							</h1>
							<p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
								&quot;库无忧助手&quot;是一款专注于石化仓储工程建设、运营维护、检修升级提供全链路技术服务的石油化工行业专业智能体。
								它通过深度学习现行法律法规、国家标准、行业标准及专业数据库知识，应用智能大模型为技术人员提供安全、
								高效、专业的数据分析、判断辅助等专业智能体服务，助力企业创造显著的业务价值，提升企业经营效益。
							</p>
						</div>
						<div className="flex flex-row gap-4">
							<Button size="lg" className="gap-4" onClick={handleGetStarted}>
								立即开始 <MoveRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export { Hero };
