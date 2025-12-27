# 库无忧助手 - 新手教程

一个基于 TanStack Start 和 AI 技术的智能助手应用，支持智能对话、知识库管理和 Web 搜索功能。

## 📋 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [常见问题](#常见问题)

## ✨ 功能特性

- 🤖 **智能对话**：基于 AI SDK 的流式对话功能
- 📚 **知识库管理**：上传和管理文档（支持 PDF、Word 等格式）
- 🔍 **Web 搜索**：集成搜索 API，实时获取网络信息
- 👤 **用户系统**：完整的注册、登录和个人资料管理
- 🛡️ **管理后台**：用户管理、系统监控和数据分析
- 📱 **响应式设计**：支持移动端和桌面端
- 🎤 **语音识别**：支持语音输入
- 📊 **Mermaid 图表**：支持在对话中渲染流程图

## 🛠 技术栈

- **框架**：TanStack Start + TanStack Router
- **构建工具**：Vite 7
- **运行时**：Bun.js
- **前端**：React 19
- **样式**：Tailwind CSS 4
- **UI 组件**：shadcn/ui + Radix UI
- **状态管理**：Zustand
- **数据库**：PostgreSQL
- **ORM**：Drizzle ORM
- **AI 集成**：AI SDK (@ai-sdk/openai)
- **验证**：Zod
- **加密**：bcryptjs
- **动画**：Framer Motion

## 📦 环境要求

- **Bun**: >= 1.0.0

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repository-url>
cd kuwuyou
```

### 2. 安装依赖

```bash
bun install
```

### 3. 配置环境变量

复制 `.env` 文件并根据需要修改配置：

```bash
cp .env .env.local
```

编辑 `.env.local` 文件，配置以下内容：

```env
# 数据库设置
DATABASE_URL=postgresql://user:password@localhost:5432/kuwuyou

# 搜索设置
SEARCH_API_KEY=your_search_api_key
SEARCH_API_URL=https://api.bocha.cn/v1/web-search

# SiliconFlow AI 设置
AI_KEY=your_siliconflow_api_key
AI_BASE_URL=https://api.siliconflow.cn/v1

# 知识库 API 设置
KNOWLEDGE_API_URL=https://open.bigmodel.cn/api/llm-application/open/knowledge/retrieve
# 支持多个知识库ID，用逗号分隔
KNOWLEDGE_IDS=your_knowledge_ids

# AI 设置
DEFAULT_MODEL=MiniMaxAI/MiniMax-M2
TEMPERATURE=0.7
MAX_TOKENS=12800
```

### 4. 初始化数据库

```bash
# 生成迁移文件
bun run db:generate

# 执行数据库迁移
bun run db:push

# 或使用迁移脚本
bun run db:migrate

# 填充初始数据（可选）
bun run db:seed
```

### 5. 启动开发服务器

```bash
bun run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## ⚙️ 配置说明

### 获取 API 密钥

#### SiliconFlow AI 密钥

1. 访问 [SiliconFlow 开放平台](https://siliconflow.cn/)
2. 注册并登录账号
3. 在控制台创建 API 密钥
4. 将密钥配置到 `AI_KEY` 环境变量

#### 搜索 API

1. 获取搜索服务的 API 密钥
2. 配置到 `SEARCH_API_KEY` 环境变量

## 📁 项目结构

```
kuwuyou/
├── src/                      # 源代码目录
│   ├── app/                  # 应用目录
│   │   ├── api/             # API 路由
│   │   │   ├── admin/       # 管理后台 API
│   │   │   ├── analysis/    # 分析 API
│   │   │   ├── auth/        # 认证相关 API
│   │   │   ├── chat/        # 对话 API
│   │   │   └── knowledge/   # 知识库 API
│   │   ├── auth/            # 认证页面
│   │   ├── __root.tsx       # 根布局
│   │   ├── index.tsx        # 首页
│   │   ├── chat.tsx         # 对话页面
│   │   ├── knowledge.tsx    # 知识库列表页面
│   │   ├── knowledge.$id.tsx # 知识库详情页面
│   │   ├── admin.tsx        # 管理后台
│   │   ├── profile.tsx      # 个人资料页面
│   │   ├── settings.tsx     # 设置页面
│   │   ├── privacy.tsx      # 隐私政策
│   │   └── terms.tsx        # 服务条款
│   ├── globals.css          # 全局样式
│   ├── router.tsx           # 路由配置
│   └── routeTree.gen.ts     # 自动生成的路由树
├── components/              # React 组件
│   ├── auth/               # 认证组件
│   ├── chat/               # 对话组件
│   ├── knowledge/          # 知识库组件
│   ├── admin/              # 管理后台组件
│   └── ui/                 # UI 组件库
├── db/                      # 数据库配置
│   ├── index.ts            # 数据库客户端
│   └── schema.ts           # 数据库模式
├── drizzle/                 # Drizzle 迁移文件
├── hooks/                   # React Hooks
├── lib/                     # 工具函数
├── services/                # 业务服务
├── stores/                  # Zustand 状态管理
├── utils/                   # 通用工具
├── scripts/                 # 脚本文件
│   ├── migrate.ts          # 数据库迁移脚本
│   └── seed.ts             # 数据填充脚本
├── public/                  # 静态资源
├── vite.config.ts          # Vite 配置
├── drizzle.config.ts       # Drizzle 配置
└── tsconfig.json           # TypeScript 配置
```

## 📖 开发指南

### 运行命令

```bash
# 开发模式
bun run dev

# 生产构建
bun run build

# 启动生产服务器
bun run start

# 代码检查
bun run lint
```

### 数据库管理

```bash
# 生成数据库迁移
bun run db:generate

# 执行数据库迁移
bun run db:push

# 运行迁移脚本
bun run db:migrate

# 填充初始数据
bun run db:seed

# 打开数据库管理界面
bun run db:studio
```

### 添加 UI 组件

项目使用 shadcn/ui，添加新组件：

```bash
bunx shadcn-ui@latest add [component-name]
```

### 状态管理

使用 Zustand 管理全局状态，示例：

```typescript
import { useAuthStore } from '@/stores/authStore';

const { user, isAuthenticated, login } = useAuthStore();
```

### API 开发

在 `src/app/api` 目录下创建新的 API 路由：

```typescript
// src/app/api/example.ts
import { createAPIFileRoute } from '@tanstack/react-start/api';

export const APIRoute = createAPIFileRoute('/api/example')({
  GET: async ({ request }) => {
    return Response.json({ message: 'Hello' });
  },
});
```

### 页面路由

使用 TanStack Router 的文件系统路由：

```typescript
// src/app/example.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/example')({
  component: ExamplePage,
});

function ExamplePage() {
  return <div>Example Page</div>;
}
```

## 🎯 主要功能使用

### 1. 用户注册和登录

- 访问 `/auth/register` 注册新账号
- 访问 `/auth/login` 登录
- 支持密码强度检测和表单验证

### 2. AI 对话

- 登录后访问 `/chat` 开始对话
- 支持流式响应
- 可以启用 Web 搜索增强回答
- 支持语音输入

### 3. 知识库管理

- 访问 `/knowledge` 管理知识库
- 支持上传 PDF、Word 等文档
- 文档会自动处理并用于 AI 检索

### 4. 管理后台

- 管理员访问 `/admin` 进入后台
- 查看系统统计和用户管理
- 监控系统运行状态

## ❓ 常见问题

### 1. 安装依赖失败

确保使用 Bun 安装依赖：
```bash
bun install
```

如果遇到问题，尝试清理缓存：
```bash
rm -rf node_modules bun.lock
bun install
```

### 2. 数据库连接失败

确保 PostgreSQL 服务正在运行，并检查 `DATABASE_URL` 配置是否正确。

### 3. AI API 调用失败

确认以下配置：
- `AI_KEY` 是否有效
- `AI_BASE_URL` 是否正确
- API 配额是否充足

### 4. 端口已被占用

修改端口启动（在 vite.config.ts 中配置或使用环境变量）：
```bash
PORT=3001 bun run dev
```

### 5. 样式不生效

确保 Tailwind CSS 配置正确，尝试重启开发服务器：
```bash
bun run dev
```

### 6. 路由不生效

TanStack Router 会自动生成路由树，如果添加新页面后路由不生效，尝试重启开发服务器让其重新生成 `routeTree.gen.ts`。