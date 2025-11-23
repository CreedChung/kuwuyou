# 数据库设置指南

本文档说明如何设置数据库表以支持用户资料功能。

## 数据库表结构

### 1. profiles 表（用户资料）
已存在的表，新增以下字段：
- `bio` (text): 个人简介
- `location` (text): 位置信息

### 2. user_stats 表（用户统计）
```sql
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_count INTEGER NOT NULL DEFAULT 0,
  message_count INTEGER NOT NULL DEFAULT 0,
  active_days INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
```

### 3. achievements 表（成就）
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### 4. user_achievements 表（用户成就关联）
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
```

## 使用 Drizzle 迁移

1. 生成迁移文件：
```bash
bun run drizzle-kit generate:pg
```

2. 应用迁移：
```bash
bun run drizzle-kit push:pg
```

## 初始化成就数据

运行初始化脚本：
```bash
bun run scripts/init-achievements.ts
```

## 手动创建表（Supabase）

如果你使用 Supabase，可以在 SQL Editor 中运行以下 SQL：

```sql
-- 创建 profiles 表（如果不存在）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 如果表已存在，添加新字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- 创建 user_stats 表
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_count INTEGER NOT NULL DEFAULT 0,
  message_count INTEGER NOT NULL DEFAULT 0,
  active_days INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- 创建 achievements 表
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 创建 user_achievements 表
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- 插入默认成就数据
INSERT INTO achievements (code, name, description, icon) VALUES
  ('first_chat', '新手上路', '完成首次对话', '🎉'),
  ('message_100', '健谈者', '发送超过 100 条消息', '💬'),
  ('early_user', '早期用户', '加入早期体验计划', '⭐'),
  ('streak_7', '连续使用 7 天', '保持活跃使用', '🔥')
ON CONFLICT (code) DO NOTHING;
```

## 验证设置

访问 `http://localhost:3000/profile` 检查以下功能：
1. ✅ 用户资料正确显示
2. ✅ 统计数据显示（默认为 0）
3. ✅ 成就列表显示
4. ✅ 可以编辑和保存资料
5. ✅ 可以上传头像（需要配置 Supabase Storage）

## 配置 Supabase Storage（可选）

如果要支持头像上传，需要在 Supabase 中创建存储桶：

1. 在 Supabase Dashboard 中打开 Storage
2. 创建新的 bucket，名称为 `user-uploads`
3. 设置为 Public bucket
4. 添加策略允许用户上传和读取文件

策略示例：
```sql
-- 允许用户上传自己的头像
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 允许所有人查看头像
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-uploads');
```

## 故障排除

### 问题：无法加载用户资料
- 检查 API 路由是否正常工作：`/api/profile`
- 检查数据库连接配置
- 查看浏览器控制台和服务器日志

### 问题：统计数据不显示
- 确保 `user_stats` 表已创建
- API 会自动为新用户创建默认统计记录

### 问题：成就不显示
- 运行初始化脚本插入默认成就
- 检查 `achievements` 表是否有数据

## 下一步

- 实现头像上传功能的完整测试
- 添加更多成就类型
- 实现统计数据的自动更新逻辑
- 添加用户活动追踪