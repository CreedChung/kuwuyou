import { sqliteTable, AnySQLiteColumn, uniqueIndex, text, integer, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const achievements = sqliteTable("achievements", {
	id: text().primaryKey().notNull(),
	code: text().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	icon: text().notNull(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	uniqueIndex("achievements_code_unique").on(table.code),
]);

export const conversations = sqliteTable("conversations", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	title: text().notNull(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: integer("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const messages = sqliteTable("messages", {
	id: text().primaryKey().notNull(),
	conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" } ),
	role: text().notNull(),
	content: text().notNull(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const profiles = sqliteTable("profiles", {
	id: text().primaryKey().notNull(),
	username: text().notNull(),
	email: text().notNull(),
	avatarUrl: text("avatar_url"),
	bio: text(),
	location: text(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: integer("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	password: text().notNull(),
},
(table) => [
	uniqueIndex("profiles_email_unique").on(table.email),
	uniqueIndex("profiles_username_unique").on(table.username),
]);

export const userAchievements = sqliteTable("user_achievements", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	achievementId: text("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" } ),
	unlockedAt: integer("unlocked_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const userStats = sqliteTable("user_stats", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	conversationCount: integer("conversation_count").default(0).notNull(),
	messageCount: integer("message_count").default(0).notNull(),
	activeDays: integer("active_days").default(0).notNull(),
	lastActiveAt: integer("last_active_at"),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: integer("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

