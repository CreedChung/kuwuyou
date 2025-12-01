import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, userStats, achievements, userAchievements } from "@/db/schema";
import { eq } from "drizzle-orm";

// 获取用户资料
export async function GET(request: NextRequest) {
	try {
		const userId = request.headers.get("x-user-id");

		if (!userId) {
			return NextResponse.json(
				{ error: "未授权访问" },
				{ status: 401 }
			);
		}

		// 获取用户基本信息
		const [profile] = await db
			.select()
			.from(profiles)
			.where(eq(profiles.id, userId))
			.limit(1);

		if (!profile) {
			return NextResponse.json(
				{ error: "用户不存在" },
				{ status: 404 }
			);
		}

		// 获取用户统计信息
		let stats = await db
			.select()
			.from(userStats)
			.where(eq(userStats.userId, userId))
			.limit(1);

		// 如果统计信息不存在，创建默认统计
		if (stats.length === 0) {
			const [newStats] = await db
				.insert(userStats)
				.values({
					id: `stats_${userId}_${Date.now()}`,
					userId: userId,
					conversationCount: 0,
					messageCount: 0,
					activeDays: 0,
				})
				.returning();
			stats = [newStats];
		}

		// 获取用户成就
		const userAchievementsList = await db
			.select({
				id: userAchievements.id,
				achievementId: userAchievements.achievementId,
				unlockedAt: userAchievements.unlockedAt,
				code: achievements.code,
				name: achievements.name,
				description: achievements.description,
				icon: achievements.icon,
			})
			.from(userAchievements)
			.innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
			.where(eq(userAchievements.userId, userId));

		// 安全处理 createdAt 字段
		let joinDate = new Date().toISOString().split('T')[0]; // 默认值为当前日期
		if (profile.createdAt) {
			try {
				const date = profile.createdAt instanceof Date
					? profile.createdAt
					: new Date(profile.createdAt);
				if (!isNaN(date.getTime())) {
					joinDate = date.toISOString().split('T')[0];
				}
			} catch (e) {
				console.error("处理 createdAt 时出错:", e);
			}
		}

		return NextResponse.json({
			profile: {
				id: profile.id,
				username: profile.username,
				email: profile.email,

				joinDate,
			},
			stats: stats[0],
			achievements: userAchievementsList,
		});
	} catch (error) {
		console.error("获取用户资料错误:", error);
		return NextResponse.json(
			{ error: "获取用户资料失败" },
			{ status: 500 }
		);
	}
}

// 更新用户资料
export async function PATCH(request: NextRequest) {
	try {
		const userId = request.headers.get("x-user-id");

		if (!userId) {
			return NextResponse.json(
				{ error: "未授权访问" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { username } = body;

		// 更新用户资料
		const [updatedProfile] = await db
			.update(profiles)
			.set({
				username,
				updatedAt: new Date(),
			})
			.where(eq(profiles.id, userId))
			.returning();

		if (!updatedProfile) {
			return NextResponse.json(
				{ error: "更新失败" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			profile: updatedProfile,
		});
	} catch (error) {
		console.error("更新用户资料错误:", error);
		return NextResponse.json(
			{ error: "更新用户资料失败" },
			{ status: 500 }
		);
	}
}