import { db } from "@/db";
import { achievements } from "@/db/schema";
import { randomUUID } from "crypto";

const defaultAchievements = [
	{
		id: randomUUID(),
		code: "first_chat",
		name: "新手上路",
		description: "完成首次对话",
		icon: "🎉",
	},
	{
		id: randomUUID(),
		code: "message_100",
		name: "健谈者",
		description: "发送超过 100 条消息",
		icon: "💬",
	},
	{
		id: randomUUID(),
		code: "early_user",
		name: "早期用户",
		description: "加入早期体验计划",
		icon: "⭐",
	},
	{
		id: randomUUID(),
		code: "streak_7",
		name: "连续使用 7 天",
		description: "保持活跃使用",
		icon: "🔥",
	},
];

async function initAchievements() {
	try {
		console.log("开始初始化成就数据...");

		for (const achievement of defaultAchievements) {
			await db
				.insert(achievements)
				.values(achievement)
				.onConflictDoNothing();
		}

		console.log("成就数据初始化完成！");
	} catch (error) {
		console.error("初始化成就数据失败:", error);
		process.exit(1);
	}
}

initAchievements();