# 快速开始指南

本指南将帮助你在 5 分钟内启动库无忧项目。

## 前置要求

- Node.js 18+ 或 Bun
- Git
- Turso CLI

## 步骤 1: 克隆项目

```bash
git clone <repository-url>
cd kuwuyou
```

## 步骤 2: 安装依赖

```bash
bun install
```

## 步骤 3: 设置 Turso 数据库

### 安装 Turso CLI

**macOS/Linux:**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm get.tur.so/install.ps1 | iex
```

### 创建数据库

```bash
# 登录 Turso
turso auth login

# 创建数据库
turso db create kuwuyou

# 获取数据库 URL (复制输出的 URL)
turso db show kuwuyou

# 创建认证令牌 (复制输出的令牌)
turso db tokens create kuwuyou
```

## 步骤 4: 配置环境变量

创建 `.env` 文件:

```bash
cp .env.example .env
```

编辑 `.env` 文件,填入你的配置:

```env
# Turso 数据库 (必需)
TURSO_DATABASE_URL=libsql://kuwuyou-你的用户名.turso.io
TURSO_AUTH_TOKEN=你的认证令牌

# Supabase 认证 (必需)
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# 智谱 AI (可选)
ZHIPU_API_KEY=你的智谱API密钥
```

### 如何获取 Supabase 配置

1. 访问 [Supabase 控制台](https://app.supabase.com/)
2. 选择或创建项目
3. 在项目设置中找到 API 配置
4. 复制 `URL` 和 `anon public` 密钥

## 步骤 5: 初始化数据库

```bash
# 推送数据库架构
bun run drizzle-kit push

# 初始化成就数据
bun run tsx scripts/init-achievements.ts
```

## 步骤 6: 启动开发服务器

```bash
bun run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 步骤 7: 注册账号

1. 访问 `/auth/register` 创建新账号
2. 使用邮箱和密码注册
3. 登录后即可使用聊天功能

## 常见问题

### Q: 数据库连接失败?

**A:** 检查以下几点:
- `TURSO_DATABASE_URL` 格式正确 (以 `libsql://` 开头)
- `TURSO_AUTH_TOKEN` 没有多余的空格或换行
- 网络连接正常

验证方法:
```bash
turso db shell kuwuyou
```

### Q: Supabase 认证失败?

**A:** 确保:
- `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 正确
- Supabase 项目处于活跃状态
- 在 Supabase 控制台启用了邮箱认证

### Q: 如何重置数据库?

**A:** 
```bash
# 删除现有数据库
turso db destroy kuwuyou

# 创建新数据库
turso db create kuwuyou

# 重新配置环境变量
turso db show kuwuyou
turso db tokens create kuwuyou

# 重新推送架构
bun run drizzle-kit push
bun run tsx scripts/init-achievements.ts
```

### Q: 智谱 AI 不工作?

**A:** 
- 确保设置了 `ZHIPU_API_KEY`
- 在应用设置中配置 API 密钥
- 检查 API 额度是否充足

## 下一步

- 📖 阅读 [Turso 迁移指南](./TURSO_MIGRATION.md) 了解更多细节
- 🗄️ 查看 [数据库设置文档](./DATABASE_SETUP.md) 了解表结构
- 🔐 参考 [认证迁移文档](./AUTH_MIGRATION.md) 配置认证

## 获取帮助

如果遇到问题:
1. 查看项目文档
2. 搜索已有 Issues
3. 提交新的 Issue 并附上错误信息

## 开发资源

- [Next.js 文档](https://nextjs.org/docs)
- [Turso 文档](https://docs.turso.tech/)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Supabase 文档](https://supabase.com/docs)

祝你使用愉快! 🎉