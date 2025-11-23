# Turso 数据库迁移指南

本指南介绍如何将项目从 Supabase PostgreSQL 迁移到 Turso (LibSQL) 数据库。

## 什么是 Turso?

Turso 是一个基于 libSQL 的边缘数据库平台,提供:
- 全球边缘部署,低延迟访问
- SQLite 兼容
- 自动备份和扩展
- 简单的开发体验

## 迁移步骤

### 1. 安装 Turso CLI

```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
irm get.tur.so/install.ps1 | iex
```

### 2. 创建 Turso 账号和数据库

```bash
# 注册/登录
turso auth signup
# 或
turso auth login

# 创建数据库
turso db create kuwuyou

# 获取数据库 URL
turso db show kuwuyou

# 创建访问令牌
turso db tokens create kuwuyou
```

### 3. 配置环境变量

在项目根目录创建 `.env` 文件或更新现有文件:

```env
# Turso 数据库配置
TURSO_DATABASE_URL=libsql://kuwuyou-your-username.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Supabase 认证配置 (保持不变)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. 推送数据库架构

```bash
# 生成迁移文件
bun run drizzle-kit generate

# 推送到 Turso 数据库
bun run drizzle-kit push
```

### 5. 初始化成就数据

```bash
bun run tsx scripts/init-achievements.ts
```

### 6. 启动应用

```bash
bun run dev
```

## 主要变更

### 依赖变更

- ✅ 添加: `@libsql/client` - Turso 客户端
- ❌ 移除: `postgres` - PostgreSQL 客户端

### 配置文件变更

#### `drizzle.config.ts`
```typescript
export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',        // 从 'postgresql' 改为 'sqlite'
  driver: 'turso',          // 新增
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

#### `db/index.ts`
```typescript
import { drizzle } from "drizzle-orm/libsql";      // 从 postgres-js 改为 libsql
import { createClient } from "@libsql/client";      // 新的客户端
```

#### `db/schema.ts`
主要变更:
- `pgTable` → `sqliteTable`
- `uuid` → `text` (用于 ID)
- `timestamp` → `integer` (时间戳模式)
- 移除 `withTimezone` 选项

## 数据迁移 (可选)

如果需要从 Supabase 迁移现有数据:

### 1. 导出 Supabase 数据

```bash
# 使用 pg_dump 导出数据
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  --data-only \
  --inserts \
  > supabase_data.sql
```

### 2. 转换为 SQLite 格式

你需要将 PostgreSQL 的 INSERT 语句转换为 SQLite 兼容格式:

- UUID 值需要保持为字符串
- 时间戳需要转换为 Unix 时间戳 (整数)
- 移除 PostgreSQL 特定的语法

### 3. 导入到 Turso

```bash
# 连接到 Turso 数据库
turso db shell kuwuyou

# 在 shell 中执行 SQL 命令
.read converted_data.sql
```

## 故障排查

### 问题: 环境变量未设置

**错误信息**: `TURSO_DATABASE_URL 环境变量未设置`

**解决方案**: 确保 `.env` 文件存在且包含正确的配置。

### 问题: 认证失败

**错误信息**: `Authentication failed`

**解决方案**:
1. 检查 `TURSO_AUTH_TOKEN` 是否正确
2. 令牌可能已过期,重新创建: `turso db tokens create kuwuyou`

### 问题: Schema 推送失败

**错误信息**: `Failed to push schema`

**解决方案**:
1. 检查数据库连接
2. 确保数据库存在: `turso db list`
3. 查看详细错误: `bun run drizzle-kit push --verbose`

## 性能优化建议

1. **使用索引**: 为常查询的字段添加索引
2. **批量操作**: 使用事务处理批量插入/更新
3. **连接池**: LibSQL 客户端自动处理连接管理
4. **边缘函数**: 考虑使用 Turso 的边缘副本功能

## 回滚到 Supabase

如果需要回滚:

1. 恢复 `package.json` 中的 `postgres` 依赖
2. 恢复配置文件到之前的版本
3. 重新设置 `DATABASE_URL` 环境变量
4. 运行 `bun install` 重新安装依赖

## 相关资源

- [Turso 官方文档](https://docs.turso.tech/)
- [Drizzle ORM LibSQL 文档](https://orm.drizzle.team/docs/get-started-sqlite)
- [Turso 定价](https://turso.tech/pricing)

## 技术支持

如果遇到问题,可以:
- 查看 [Turso Discord 社区](https://discord.gg/turso)
- 提交 [GitHub Issue](https://github.com/tursodatabase/turso-cli/issues)