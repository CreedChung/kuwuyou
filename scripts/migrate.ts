import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as dotenv from "dotenv";

// 加载环境变量
dotenv.config();

async function main() {
  const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "kuwuyou",
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  const db = drizzle(pool, { schema });

  try {
    console.log("🔄 开始数据库迁移...");

    // 执行迁移
    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ 数据库迁移完成！");

    // 验证表是否创建成功
    const tables = [
      'profiles',
      'user_stats',
      'achievements',
      'user_achievements',
      'conversations',
      'messages',
      'system_settings'
    ];

    for (const table of tables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = $1
        );
      `, [table]);

      if (result.rows[0].exists) {
        console.log(`✅ 表 ${table} 创建成功`);
      } else {
        console.log(`❌ 表 ${table} 创建失败`);
      }
    }

  } catch (error) {
    console.error("❌ 数据库迁移失败:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
