import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import * as dotenv from "dotenv";

// 加载环境变量
dotenv.config();

async function seedDatabase() {
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
    console.log("🌱 开始数据库种子数据植入...");

    // 清空现有数据（可选）
    console.log("🧹 清空现有数据...");
    await db.delete(schema.userAchievements).execute();
    await db.delete(schema.messages).execute();
    await db.delete(schema.conversations).execute();
    await db.delete(schema.userStats).execute();
    await db.delete(schema.profiles).execute();
    await db.delete(schema.achievements).execute();
    await db.delete(schema.systemSettings).execute();

    // 插入系统设置
    console.log("⚙️ 插入系统设置...");
    const settings = [
      {
        id: "1",
        key: "site_name",
        value: "酷我友",
        description: "网站名称",
      },
      {
        id: "2",
        key: "max_conversations_per_user",
        value: "100",
        description: "每个用户最大对话数",
      },
      {
        id: "3",
        key: "enable_registration",
        value: "true",
        description: "是否允许注册",
      },
      {
        id: "4",
        key: "ai_model",
        value: "gpt-3.5-turbo",
        description: "默认AI模型",
      },
    ];

    await db.insert(schema.systemSettings).values(settings).execute();

    // 插入成就数据
    console.log("🏆 插入成就数据...");
    const achievements = [
      {
        id: "1",
        code: "first_chat",
        name: "初次对话",
        description: "完成第一次AI对话",
        icon: "💬",
      },
      {
        id: "2",
        code: "chat_lover",
        name: "聊天爱好者",
        description: "完成10次对话",
        icon: "❤️",
      },
      {
        id: "3",
        code: "chat_master",
        name: "聊天大师",
        description: "完成50次对话",
        icon: "👑",
      },
      {
        id: "4",
        code: "prolific_chatter",
        name: "话痨",
        description: "完成100次对话",
        icon: "🗣️",
      },
      {
        id: "5",
        code: "early_bird",
        name: "早起的鸟儿",
        description: "早上6点前进行第一次对话",
        icon: "🌅",
      },
      {
        id: "6",
        code: "night_owl",
        name: "夜猫子",
        description: "晚上11点后进行对话",
        icon: "🦉",
      },
    ];

    await db.insert(schema.achievements).values(achievements).execute();

    // 插入测试用户
    console.log("👤 插入测试用户...");
    const testUsers = [
      {
        id: "1",
        username: "admin",
        email: "admin@kuwuyou.com",
        password: "$2a$10$rOZ8rKzHJ8K8K8K8K8K8K.uL8K8K8K8K8K8K8K8K8K8K8K8K8K8K", // password: admin123
        role: "admin",
        status: "active",
      },
      {
        id: "2",
        username: "user1",
        email: "user1@example.com",
        password: "$2a$10$rOZ8rKzHJ8K8K8K8K8K8K.uL8K8K8K8K8K8K8K8K8K8K8K8K8K8", // password: user123
        role: "user",
        status: "active",
      },
      {
        id: "3",
        username: "user2",
        email: "user2@example.com",
        password: "$2a$10$rOZ8rKzHJ8K8K8K8K8K8K.uL8K8K8K8K8K8K8K8K8K8K8K8K8K8", // password: user123
        role: "user",
        status: "active",
      },
    ];

    await db.insert(schema.profiles).values(testUsers).execute();

    // 插入用户统计
    console.log("📊 插入用户统计数据...");
    const userStats = [
      {
        id: "1",
        userId: "1",
        conversationCount: 5,
        messageCount: 25,
        activeDays: 3,
      },
      {
        id: "2",
        userId: "2",
        conversationCount: 12,
        messageCount: 48,
        activeDays: 7,
      },
      {
        id: "3",
        userId: "3",
        conversationCount: 3,
        messageCount: 15,
        activeDays: 2,
      },
    ];

    await db.insert(schema.userStats).values(userStats).execute();

    // 插入对话示例
    console.log("💭 插入对话示例...");
    const conversations = [
      {
        id: "1",
        userId: "2",
        title: "关于人工智能的讨论",
      },
      {
        id: "2",
        userId: "2",
        title: "编程技巧分享",
      },
      {
        id: "3",
        userId: "3",
        title: "旅行计划咨询",
      },
    ];

    await db.insert(schema.conversations).values(conversations).execute();

    // 插入消息示例
    console.log("📝 插入消息示例...");
    const messages = [
      // 对话1的消息
      {
        id: "1",
        conversationId: "1",
        role: "user",
        content: "你好，请介绍一下人工智能的发展历史",
      },
      {
        id: "2",
        conversationId: "1",
        role: "assistant",
        content: "你好！人工智能的发展历史可以分为几个主要阶段：\n\n1. **起源期（1940s-1950s）**：图灵测试的提出，第一个AI程序\n2. **第一次浪潮（1950s-1970s）**：符号主义AI，专家系统\n3. **寒冬期（1970s-1980s）**：由于计算能力和理论的限制，AI研究陷入低谷\n4. **第二次浪潮（1980s-1990s）**：专家系统繁荣，神经网络复兴\n5. **现代AI（2000s至今）**：机器学习、深度学习、大语言模型时代\n\n每个阶段都有其独特的贡献和发展特点。",
      },
      {
        id: "3",
        conversationId: "1",
        role: "user",
        content: "谢谢你的介绍！能详细说说深度学习吗？",
      },

      // 对话2的消息
      {
        id: "4",
        conversationId: "2",
        role: "user",
        content: "有什么好的JavaScript学习建议吗？",
      },
      {
        id: "5",
        conversationId: "2",
        role: "assistant",
        content: "当然！学习JavaScript的建议：\n\n1. **基础语法**：掌握变量、函数、对象、数组等基础概念\n2. **异步编程**：理解Promise、async/await\n3. **DOM操作**：学习如何操作网页元素\n4. **框架学习**：React、Vue或Angular选择其一深入学习\n5. **工程化工具**：了解Webpack、Vite、ESLint等\n6. **持续练习**：通过项目实战巩固知识\n\n记住：理论结合实践是最好的学习方式！",
      },

      // 对话3的消息
      {
        id: "6",
        conversationId: "3",
        role: "user",
        content: "我想去日本旅行，有什么推荐的吗？",
      },
      {
        id: "7",
        conversationId: "3",
        role: "assistant",
        content: "日本是个很棒的旅行目的地！我为你推荐几个热门路线：\n\n**经典路线（7-10天）**：\n- 东京：浅草寺、东京塔、涩谷、原宿\n- 京都：清水寺、金阁寺、伏见稻荷大社\n- 大阪：大阪城、道顿堀、环球影城\n\n**特色体验**：\n- 温泉旅馆住宿\n- 传统日式料理\n- 樱花季（3-4月）或红叶季（10-11月）\n\n你更偏好什么类型的旅行体验呢？",
      },
    ];

    await db.insert(schema.messages).values(messages).execute();

    // 插入用户成就（给user1一些成就）
    console.log("🎖️ 插入用户成就...");
    const userAchievements = [
      {
        id: "1",
        userId: "2",
        achievementId: "1", // 初次对话
      },
      {
        id: "2",
        userId: "2",
        achievementId: "2", // 聊天爱好者
      },
      {
        id: "3",
        userId: "3",
        achievementId: "1", // 初次对话
      },
    ];

    await db.insert(schema.userAchievements).values(userAchievements).execute();

    console.log("✅ 数据库种子数据植入完成！");
    console.log("\n📋 种子数据概览：");
    console.log(`- 用户数：${testUsers.length}`);
    console.log(`- 成就数：${achievements.length}`);
    console.log(`- 对话数：${conversations.length}`);
    console.log(`- 消息数：${messages.length}`);
    console.log(`- 系统设置：${settings.length}`);
    console.log(`- 用户成就：${userAchievements.length}`);

  } catch (error) {
    console.error("❌ 数据库种子数据植入失败:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 执行种子数据植入
seedDatabase();
