import { relations } from "drizzle-orm/relations";
import { profiles, conversations, messages, achievements, userAchievements, userStats } from "./schema";

export const conversationsRelations = relations(conversations, ({one, many}) => ({
	profile: one(profiles, {
		fields: [conversations.userId],
		references: [profiles.id]
	}),
	messages: many(messages),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	conversations: many(conversations),
	userAchievements: many(userAchievements),
	userStats: many(userStats),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id]
	}),
}));

export const userAchievementsRelations = relations(userAchievements, ({one}) => ({
	achievement: one(achievements, {
		fields: [userAchievements.achievementId],
		references: [achievements.id]
	}),
	profile: one(profiles, {
		fields: [userAchievements.userId],
		references: [profiles.id]
	}),
}));

export const achievementsRelations = relations(achievements, ({many}) => ({
	userAchievements: many(userAchievements),
}));

export const userStatsRelations = relations(userStats, ({one}) => ({
	profile: one(profiles, {
		fields: [userStats.userId],
		references: [profiles.id]
	}),
}));