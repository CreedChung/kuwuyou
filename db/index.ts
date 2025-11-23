import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 从 Supabase URL 构建 PostgreSQL 连接字符串
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 从 Supabase URL 提取项目引用
// 格式: https://xxxxx.supabase.co
const projectRef = supabaseUrl
	.replace("https://", "")
	.replace(".supabase.co", "");

// 构建 PostgreSQL 连接字符串
// 使用 Supabase 的 PostgreSQL 直连端口
const connectionString = `postgresql://postgres.${projectRef}:${supabaseKey}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;

// 创建 postgres 客户端
const client = postgres(connectionString, {
	prepare: false,
});

// 创建 drizzle 实例
export const db = drizzle(client, { schema });
