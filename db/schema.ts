import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 用户资料表
export const profiles = sqliteTable("profiles", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(), // 加密后的密码
	avatarUrl: text("avatar_url"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

// 用户统计表
export const userStats = sqliteTable("user_stats", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	conversationCount: integer("conversation_count").notNull().default(0),
	messageCount: integer("message_count").notNull().default(0),
	activeDays: integer("active_days").notNull().default(0),
	lastActiveAt: integer("last_active_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

// 成就表
export const achievements = sqliteTable("achievements", {
	id: text("id").primaryKey(),
	code: text("code").notNull().unique(), // 成就代码，如 "first_chat"
	name: text("name").notNull(),
	description: text("description").notNull(),
	icon: text("icon").notNull(), // emoji 图标
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

// 用户成就关联表
export const userAchievements = sqliteTable("user_achievements", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	achievementId: text("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
	unlockedAt: integer("unlocked_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

// 对话表
export const conversations = sqliteTable("conversations", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

// 消息表
export const messages = sqliteTable("messages", {
	id: text("id").primaryKey(),
	conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
	role: text("role", { enum: ["user", "assistant"] }).notNull(),
	content: text("content").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type UserStats = typeof userStats.$inferSelect;
export type NewUserStats = typeof userStats.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
