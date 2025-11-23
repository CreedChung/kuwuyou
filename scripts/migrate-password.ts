import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

async function migratePassword() {
  try {
    console.log("开始迁移密码字段...");
    
    // 重命名 password_hash 为 password
    await client.execute(`
      ALTER TABLE profiles RENAME COLUMN password_hash TO password;
    `);
    
    console.log("✓ 成功将 password_hash 重命名为 password");
  } catch (error: any) {
    if (error.message?.includes("no such column")) {
      console.log("password_hash 列不存在，尝试创建 password 列...");
      try {
        await client.execute(`
          ALTER TABLE profiles ADD COLUMN password TEXT NOT NULL DEFAULT '';
        `);
        console.log("✓ 成功创建 password 列");
      } catch (createError) {
        console.error("创建 password 列失败:", createError);
      }
    } else if (error.message?.includes("duplicate column name")) {
      console.log("password 列已存在，无需迁移");
    } else {
      console.error("迁移失败:", error);
    }
  } finally {
    client.close();
  }
}

migratePassword();