# 库无忧 (Kuwuyou)

这是一个基于 [Next.js](https://nextjs.org) 的 AI 聊天应用,使用 Turso (LibSQL) 作为数据库。

## 技术栈

- **框架**: Next.js 16 + React 19
- **数据库**: Turso (LibSQL)
- **ORM**: Drizzle ORM
- **认证**: Supabase Auth
- **UI**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand
- **AI 集成**: 智谱 AI (GLM 模型)

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd kuwuyou
```

### 2. 安装依赖

```bash
bun install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env` 并填写配置:

```bash
cp .env.example .env
```

需要配置的环境变量:
- `TURSO_DATABASE_URL`: Turso 数据库 URL
- `TURSO_AUTH_TOKEN`: Turso 认证令牌
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名密钥
- `ZHIPU_API_KEY`: 智谱 AI API 密钥 (可选)

### 4. 设置 Turso 数据库

参考 [Turso 迁移指南](docs/TURSO_MIGRATION.md) 获取详细步骤。

快速设置:

```bash
# 安装 Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 登录
turso auth login

# 创建数据库
turso db create kuwuyou

# 获取连接信息
turso db show kuwuyou
turso db tokens create kuwuyou
```

### 5. 推送数据库架构

```bash
# 生成迁移
bun run drizzle-kit generate

# 推送到数据库
bun run drizzle-kit push
```

### 6. 初始化数据

```bash
bun run tsx scripts/init-achievements.ts
```

### 7. 启动开发服务器

```bash
bun run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
kuwuyou/
├── app/                    # Next.js 应用目录
│   ├── admin/             # 管理后台
│   ├── auth/              # 认证页面
│   ├── chat/              # 聊天页面
│   └── settings/          # 设置页面
├── components/            # React 组件
│   ├── admin/            # 管理后台组件
│   ├── auth/             # 认证组件
│   ├── chat/             # 聊天组件
│   ├── settings/         # 设置组件
│   └── ui/               # UI 组件 (shadcn/ui)
├── db/                    # 数据库配置
│   ├── index.ts          # 数据库连接
│   └── schema.ts         # 数据库表结构
├── docs/                  # 文档
├── hooks/                 # React Hooks
├── lib/                   # 工具库
├── scripts/              # 脚本
├── services/             # 服务层
├── stores/               # Zustand 状态管理
└── utils/                # 工具函数
```

## 可用脚本

```bash
# 开发模式
bun run dev

# 生产构建
bun run build

# 启动生产服务器
bun run start

# 代码检查
bun run lint

# 生成数据库迁移
bun run drizzle-kit generate

# 推送数据库架构
bun run drizzle-kit push
```

## 功能特性

- ✅ AI 聊天对话
- ✅ 用户认证与授权
- ✅ 用户资料管理
- ✅ 成就系统
- ✅ 管理后台
- ✅ 响应式设计
- ✅ 暗色模式支持

## 数据库

项目使用 Turso (LibSQL) 作为数据库,这是一个基于 SQLite 的边缘数据库。

### 主要表结构

- `profiles`: 用户资料
- `user_stats`: 用户统计
- `achievements`: 成就列表
- `user_achievements`: 用户成就关联

详细的数据库设置指南请参考:
- [数据库设置文档](docs/DATABASE_SETUP.md)
- [Turso 迁移指南](docs/TURSO_MIGRATION.md)

## 认证

使用 Supabase Auth 进行用户认证,支持:
- 邮箱/密码登录
- 钉钉扫码登录
- 第三方 OAuth 登录

详细的认证配置请参考 [认证迁移文档](docs/AUTH_MIGRATION.md)。

## 部署

### Vercel 部署

最简单的部署方式是使用 [Vercel Platform](https://vercel.com/new):

1. 连接你的 GitHub 仓库
2. 配置环境变量
3. 点击部署

### 环境变量配置

确保在部署平台配置以下环境变量:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ZHIPU_API_KEY` (可选)

## 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Turso 文档](https://docs.turso.tech/)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Supabase 文档](https://supabase.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com/)

## 贡献

欢迎提交 Issue 和 Pull Request!

## 许可证

MIT