import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// 检查必需的环境变量
if (!process.env.TURSO_DATABASE_URL) {
	throw new Error("TURSO_DATABASE_URL 环境变量未设置");
}

if (!process.env.TURSO_AUTH_TOKEN) {
	throw new Error("TURSO_AUTH_TOKEN 环境变量未设置");
}

console.log("数据库连接配置:", {
	hasUrl: !!process.env.TURSO_DATABASE_URL,
	hasToken: !!process.env.TURSO_AUTH_TOKEN,
	urlPrefix: process.env.TURSO_DATABASE_URL?.substring(0, 30) + "...",
});

// 创建 Turso (LibSQL) 客户端
const client = createClient({
	url: process.env.TURSO_DATABASE_URL,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

// 创建 drizzle 实例
export const db = drizzle(client, { schema });
