import { createRootRoute, HeadContent, Outlet, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        destructive: "destructive group border-red-500 bg-red-500 text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5e3;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(({ id, title, description, action, ...props }) => /* @__PURE__ */ jsxs(Toast, { ...props, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
        title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
        description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
      ] }),
      action,
      /* @__PURE__ */ jsx(ToastClose, {})
    ] }, id)),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      initialized: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      initialize: async () => {
        if (get().initialized) return;
        try {
          const storedUser = localStorage.getItem("auth-storage");
          if (storedUser) {
            const { state } = JSON.parse(storedUser);
            set({
              user: state.user ?? null,
              loading: false,
              initialized: true
            });
          } else {
            set({ loading: false, initialized: true });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ loading: false, initialized: true });
        }
      },
      signUp: async (email, password, username, toast2) => {
        try {
          const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, username })
          });
          if (!response.ok) {
            const error = await response.json();
            toast2({
              title: "注册失败",
              description: error.error || error.message || "注册失败，请稍后再试",
              variant: "destructive"
            });
            return { error: { message: error.error || error.message } };
          }
          const data = await response.json();
          set({ user: data.user });
          toast2({
            title: "注册成功",
            description: "账号创建成功，正在为您登录..."
          });
          return { error: null };
        } catch (error) {
          toast2({
            title: "注册失败",
            description: "发生未知错误，请稍后再试",
            variant: "destructive"
          });
          return { error: { message: "Unknown error" } };
        }
      },
      signIn: async (email, password, toast2) => {
        console.log("AuthStore signIn 被调用", { email, password: "***" });
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
          });
          if (!response.ok) {
            const error = await response.json();
            let errorMessage = "登录失败，请稍后再试";
            if (error.code === "INVALID_CREDENTIALS") {
              errorMessage = "邮箱或密码错误，请检查后重试";
            }
            toast2({
              title: "登录失败",
              description: errorMessage,
              variant: "destructive"
            });
            return { error: { message: error.message } };
          }
          const data = await response.json();
          set({ user: data.user });
          if (data.user?.role === "admin") {
            localStorage.setItem("admin_auth", "true");
          } else {
            localStorage.removeItem("admin_auth");
          }
          console.log("登录成功!", data);
          toast2({
            title: "登录成功",
            description: "欢迎回来！"
          });
          return { error: null };
        } catch (error) {
          console.error("signIn catch 块捕获错误:", error);
          toast2({
            title: "登录失败",
            description: "发生未知错误，请稍后再试",
            variant: "destructive"
          });
          return { error: { message: "Unknown error" } };
        }
      },
      signInWithProvider: async (provider, toast2) => {
        try {
          toast2({
            title: "功能开发中",
            description: "OAuth 登录功能即将上线",
            variant: "destructive"
          });
          return { error: { message: "Not implemented" } };
        } catch (error) {
          toast2({
            title: "登录失败",
            description: "发生未知错误，请稍后再试",
            variant: "destructive"
          });
          return { error: { message: "Unknown error" } };
        }
      },
      signOut: async (toast2) => {
        try {
          set({ user: null });
          localStorage.removeItem("ai_provider");
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("admin_auth");
          toast2({
            title: "已登出",
            description: "期待您的下次访问"
          });
        } catch (error) {
          console.error("登出错误:", error);
          set({ user: null });
          toast2({
            title: "已登出",
            description: "期待您的下次访问"
          });
        }
      },
      resetPassword: async (email, toast2) => {
        try {
          toast2({
            title: "功能开发中",
            description: "密码重置功能即将上线",
            variant: "destructive"
          });
          return { error: { message: "Not implemented" } };
        } catch (error) {
          toast2({
            title: "发送失败",
            description: "发生未知错误，请稍后再试",
            variant: "destructive"
          });
          return { error: { message: "Unknown error" } };
        }
      },
      updatePassword: async (newPassword, toast2) => {
        try {
          toast2({
            title: "功能开发中",
            description: "密码更新功能即将上线",
            variant: "destructive"
          });
          return { error: { message: "Not implemented" } };
        } catch (error) {
          toast2({
            title: "更新失败",
            description: "发生未知错误，请稍后再试",
            variant: "destructive"
          });
          return { error: { message: "Unknown error" } };
        }
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // 只持久化用户数据，不持久化 loading 和 initialized 状态
      partialize: (state) => ({
        user: state.user
      })
    }
  )
);
function AuthInitializer({ children }) {
  const initialize = useAuthStore((state) => state.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  return /* @__PURE__ */ jsx(Fragment, { children });
}
const appCss = "/assets/globals-zJBx4kr2.css";
const Route$h = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      { title: "库无忧助手" },
      { name: "description", content: "您的智能AI助手" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "icon",
        href: "/icon.jpg"
      }
    ]
  }),
  component: RootLayout,
  notFoundComponent: NotFound
});
function RootLayout() {
  return /* @__PURE__ */ jsxs("html", { lang: "zh-CN", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(HeadContent, {}),
      /* @__PURE__ */ jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `
              (function() {
                document.documentElement.classList.remove('dark');
              })();
            `
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "antialiased", children: [
      /* @__PURE__ */ jsx(AuthInitializer, { children: /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function NotFound() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "页面未找到" }),
    /* @__PURE__ */ jsx("a", { href: "/", className: "text-primary hover:underline", children: "返回首页" })
  ] }) });
}
const $$splitComponentImporter$b = () => import("./terms-CP7Q6qFD.js");
const Route$g = createFileRoute("/terms")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./privacy-BKt_wZ1k.js");
const Route$f = createFileRoute("/privacy")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./knowledge-CxegSJ3h.js");
const Route$e = createFileRoute("/knowledge")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./chat-DlfFSFqx.js");
const Route$d = createFileRoute("/chat")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./admin-Dlf-t_7V.js");
const Route$c = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./index-ClaEErcy.js");
const Route$b = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./register-WALZXegR.js");
const Route$a = createFileRoute("/auth/register")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./login-DMMG7pVZ.js");
const Route$9 = createFileRoute("/auth/login")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const Route$8 = createFileRoute("/api/web-search")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { query, max_results = 10 } = body;
          const SEARCH_API_KEY = process.env.SEARCH_API_KEY;
          const SEARCH_API_URL = process.env.SEARCH_API_URL || "https://api.bocha.cn/v1/web-search";
          if (!SEARCH_API_KEY) {
            return Response.json({ error: "Search API key not configured" }, { status: 500 });
          }
          const response = await fetch(SEARCH_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${SEARCH_API_KEY}`
            },
            body: JSON.stringify({
              query,
              max_results
            })
          });
          if (!response.ok) {
            throw new Error(`Search API error: ${response.status}`);
          }
          const data = await response.json();
          return Response.json(data);
        } catch (error) {
          console.error("Web search error:", error);
          return Response.json({ error: "Web search failed" }, { status: 500 });
        }
      }
    }
  }
});
const $$splitComponentImporter$3 = () => import("./file-parser-C6LGxa43.js");
z.object({
  file: z.any()
});
const Route$7 = createFileRoute("/api/file-parser")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const Route$6 = createFileRoute("/api/knowledge/retrieve")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { query, knowledge_ids, top_k = 10, recall_method = "mixed" } = body;
          const KNOWLEDGE_API_URL = process.env.KNOWLEDGE_API_URL || "https://open.bigmodel.cn/api/llm-application/open/knowledge/retrieve";
          const KNOWLEDGE_API_KEY = process.env.KNOWLEDGE_API_KEY;
          const KNOWLEDGE_IDS = process.env.KNOWLEDGE_IDS || "1998306783759900672";
          if (!KNOWLEDGE_API_KEY) {
            return Response.json({ error: "Knowledge API key not configured" }, { status: 500 });
          }
          const knowledgeIds = knowledge_ids === "使用默认" ? KNOWLEDGE_IDS.split(",") : [knowledge_ids];
          const response = await fetch(KNOWLEDGE_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${KNOWLEDGE_API_KEY}`
            },
            body: JSON.stringify({
              query,
              knowledge_ids: knowledgeIds,
              top_k,
              recall_method
            })
          });
          if (!response.ok) {
            throw new Error(`Knowledge API error: ${response.status}`);
          }
          const data = await response.json();
          return Response.json(data);
        } catch (error) {
          console.error("Knowledge retrieval error:", error);
          return Response.json({ error: "Knowledge retrieval failed" }, { status: 500 });
        }
      }
    }
  }
});
const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string()
});
const chatCompletionSchema = z.object({
  model: z.string().default("deepseek-ai/DeepSeek-V3.2"),
  messages: z.array(chatMessageSchema).min(1),
  stream: z.boolean().default(true),
  temperature: z.number().min(0).max(2).default(0.95),
  max_tokens: z.number().int().min(1).max(5e4).default(12800),
  thinking: z.object({
    type: z.enum(["enabled"])
  }).optional()
});
const Route$5 = createFileRoute("/api/chat/completions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validatedData = chatCompletionSchema.parse(body);
          return Response.json({ message: "Chat completion endpoint" });
        } catch (error) {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }
      }
    }
  }
});
const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  status: text("status", { enum: ["active", "banned", "suspended"] }).notNull().default("active"),
  bannedAt: integer("banned_at", { mode: "timestamp" }),
  bannedReason: text("banned_reason"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const userStats = sqliteTable("user_stats", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  conversationCount: integer("conversation_count").notNull().default(0),
  messageCount: integer("message_count").notNull().default(0),
  activeDays: integer("active_days").notNull().default(0),
  lastActiveAt: integer("last_active_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  // 成就代码，如 "first_chat"
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  // emoji 图标
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const userAchievements = sqliteTable("user_achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  achievementId: text("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const systemSettings = sqliteTable("system_settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  achievements,
  conversations,
  messages,
  profiles,
  systemSettings,
  userAchievements,
  userStats
}, Symbol.toStringTag, { value: "Module" }));
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL 环境变量未设置");
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN 环境变量未设置");
}
if (process.env.NODE_ENV === "development") {
  console.log("数据库连接配置:", {
    hasUrl: !!process.env.TURSO_DATABASE_URL,
    hasToken: !!process.env.TURSO_AUTH_TOKEN,
    urlPrefix: process.env.TURSO_DATABASE_URL?.substring(0, 30) + "..."
  });
}
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  fetch: (url, init) => {
    return fetch(url, {
      ...init,
      signal: AbortSignal.timeout(2e4)
    });
  }
});
const db = drizzle(client, { schema });
const signupSchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(8, "密码至少需要8个字符"),
  username: z.string().min(3, "用户名至少需要3个字符")
});
const Route$4 = createFileRoute("/api/auth/signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validationResult = signupSchema.safeParse(body);
          if (!validationResult.success) {
            const firstError = validationResult.error.issues[0];
            return Response.json(
              { error: firstError?.message || "请求数据格式不正确" },
              { status: 400 }
            );
          }
          const { email, password, username } = validationResult.data;
          const existingUser = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
          if (existingUser.length > 0) {
            return Response.json(
              { error: "该邮箱已被注册" },
              { status: 409 }
            );
          }
          const existingUsername = await db.select().from(profiles).where(eq(profiles.username, username)).limit(1);
          if (existingUsername.length > 0) {
            return Response.json(
              { error: "该用户名已被使用" },
              { status: 409 }
            );
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const userId = crypto.randomUUID();
          await db.insert(profiles).values({
            id: userId,
            email,
            password: hashedPassword,
            username
          });
          await db.insert(userStats).values({
            id: crypto.randomUUID(),
            userId
          });
          return Response.json(
            {
              success: true,
              message: "注册成功",
              user: {
                id: userId,
                email,
                username,
                role: "user"
              }
            },
            { status: 201 }
          );
        } catch (error) {
          console.error("注册错误:", error);
          return Response.json(
            { error: "注册失败，请稍后重试" },
            { status: 500 }
          );
        }
      }
    }
  }
});
const loginSchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(1, "请输入密码")
});
const Route$3 = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validationResult = loginSchema.safeParse(body);
          if (!validationResult.success) {
            const firstError = validationResult.error.issues[0];
            return Response.json(
              { error: firstError?.message || "请求数据格式不正确" },
              { status: 400 }
            );
          }
          const { email, password } = validationResult.data;
          const users = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
          if (users.length === 0) {
            return Response.json(
              { error: "邮箱或密码错误" },
              { status: 401 }
            );
          }
          const user = users[0];
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return Response.json(
              { error: "邮箱或密码错误" },
              { status: 401 }
            );
          }
          const { password: _, ...userWithoutPassword } = user;
          return Response.json(
            {
              success: true,
              message: "登录成功",
              user: {
                ...userWithoutPassword,
                role: userWithoutPassword.role || "user"
              }
            },
            { status: 200 }
          );
        } catch (error) {
          console.error("登录错误:", error);
          return Response.json(
            { error: "登录失败，请稍后重试" },
            { status: 500 }
          );
        }
      }
    }
  }
});
const $$splitComponentImporter$2 = () => import("./users-4oIUT5XN.js");
const Route$2 = createFileRoute("/api/admin/users")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./system-XwyRgm2Z.js");
const Route$1 = createFileRoute("/api/admin/system")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./stats-CuCQKHrY.js");
const Route = createFileRoute("/api/admin/stats")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TermsRoute = Route$g.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$h
});
const PrivacyRoute = Route$f.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$h
});
const KnowledgeRoute = Route$e.update({
  id: "/knowledge",
  path: "/knowledge",
  getParentRoute: () => Route$h
});
const ChatRoute = Route$d.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => Route$h
});
const AdminRoute = Route$c.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$h
});
const IndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$h
});
const AuthRegisterRoute = Route$a.update({
  id: "/auth/register",
  path: "/auth/register",
  getParentRoute: () => Route$h
});
const AuthLoginRoute = Route$9.update({
  id: "/auth/login",
  path: "/auth/login",
  getParentRoute: () => Route$h
});
const ApiWebSearchRoute = Route$8.update({
  id: "/api/web-search",
  path: "/api/web-search",
  getParentRoute: () => Route$h
});
const ApiFileParserRoute = Route$7.update({
  id: "/api/file-parser",
  path: "/api/file-parser",
  getParentRoute: () => Route$h
});
const ApiKnowledgeRetrieveRoute = Route$6.update({
  id: "/api/knowledge/retrieve",
  path: "/api/knowledge/retrieve",
  getParentRoute: () => Route$h
});
const ApiChatCompletionsRoute = Route$5.update({
  id: "/api/chat/completions",
  path: "/api/chat/completions",
  getParentRoute: () => Route$h
});
const ApiAuthSignupRoute = Route$4.update({
  id: "/api/auth/signup",
  path: "/api/auth/signup",
  getParentRoute: () => Route$h
});
const ApiAuthLoginRoute = Route$3.update({
  id: "/api/auth/login",
  path: "/api/auth/login",
  getParentRoute: () => Route$h
});
const ApiAdminUsersRoute = Route$2.update({
  id: "/api/admin/users",
  path: "/api/admin/users",
  getParentRoute: () => Route$h
});
const ApiAdminSystemRoute = Route$1.update({
  id: "/api/admin/system",
  path: "/api/admin/system",
  getParentRoute: () => Route$h
});
const ApiAdminStatsRoute = Route.update({
  id: "/api/admin/stats",
  path: "/api/admin/stats",
  getParentRoute: () => Route$h
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  ChatRoute,
  KnowledgeRoute,
  PrivacyRoute,
  TermsRoute,
  ApiFileParserRoute,
  ApiWebSearchRoute,
  AuthLoginRoute,
  AuthRegisterRoute,
  ApiAdminStatsRoute,
  ApiAdminSystemRoute,
  ApiAdminUsersRoute,
  ApiAuthLoginRoute,
  ApiAuthSignupRoute,
  ApiChatCompletionsRoute,
  ApiKnowledgeRetrieveRoute
};
const routeTree = Route$h._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  useAuthStore as a,
  cn as c,
  router as r,
  useToast as u
};
