export interface ProfileData {
	id: string;
	username: string;
	email: string;
	joinDate: string;
}

export interface StatsData {
	conversationCount: number;
	messageCount: number;
	activeDays: number;
}

export interface AchievementData {
	id: string;
	code: string;
	name: string;
	description: string;
	icon: string;
	unlockedAt: string;
}

export interface ProfileResponse {
	profile: ProfileData;
	stats: StatsData;
	achievements: AchievementData[];
}

/**
 * 获取用户资料
 */
export async function getProfile(): Promise<ProfileResponse | null> {
	try {
		// 从 localStorage 获取当前用户信息
		const authStorage = localStorage.getItem("auth-storage");
		if (!authStorage) {
			console.error("用户未登录");
			return null;
		}

		const { state } = JSON.parse(authStorage);
		const user = state.user;

		if (!user) {
			console.error("用户未登录");
			return null;
		}

		const response = await fetch("/api/profile", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-user-id": user.id,
			},
		});

		if (!response.ok) {
			console.error("获取用户资料失败:", response.statusText);
			return null;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("获取用户资料错误:", error);
		return null;
	}
}

/**
 * 更新用户资料
 */
export async function updateProfile(updates: {
	username?: string;
}): Promise<{ success: boolean; error?: string }> {
	try {
		// 从 localStorage 获取当前用户信息
		const authStorage = localStorage.getItem("auth-storage");
		if (!authStorage) {
			return { success: false, error: "用户未登录" };
		}

		const { state } = JSON.parse(authStorage);
		const user = state.user;

		if (!user) {
			return { success: false, error: "用户未登录" };
		}

		const response = await fetch("/api/profile", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"x-user-id": user.id,
			},
			body: JSON.stringify(updates),
		});

		if (!response.ok) {
			const error = await response.json();
			return { success: false, error: error.error || "更新失败" };
		}

		return { success: true };
	} catch (error) {
		console.error("更新用户资料错误:", error);
		return { success: false, error: "更新用户资料失败" };
	}
}
