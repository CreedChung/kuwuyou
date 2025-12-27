import { createRouter, createRootRoute, createFileRoute, lazyRouteComponent, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import * as React from "react";
import { forwardRef, createElement, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { eq, or, like, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const Icon = forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
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
          console.log("正在初始化认证状态...");
          const storedUser = localStorage.getItem("auth-storage");
          if (storedUser) {
            try {
              const { state } = JSON.parse(storedUser);
              console.log("从localStorage恢复的用户状态:", state);
              if (state?.user) {
                const user = state.user;
                if (user.id && user.email) {
                  set({
                    user,
                    loading: false,
                    initialized: true
                  });
                  console.log("认证状态恢复成功");
                } else {
                  console.warn("用户数据不完整，清除存储");
                  localStorage.removeItem("auth-storage");
                  set({ user: null, loading: false, initialized: true });
                }
              } else {
                set({ user: null, loading: false, initialized: true });
              }
            } catch (parseError) {
              console.error("解析localStorage数据失败:", parseError);
              localStorage.removeItem("auth-storage");
              set({ user: null, loading: false, initialized: true });
            }
          } else {
            console.log("没有找到存储的用户数据");
            set({ user: null, loading: false, initialized: true });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ user: null, loading: false, initialized: true });
        }
      },
      signUp: async (email, password, username, toast2) => {
        try {
          console.log("正在调用注册API...", { email, username });
          const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, username })
          });
          console.log("注册API响应状态:", response.status);
          if (!response.ok) {
            const error = await response.json();
            console.error("注册API错误响应:", error);
            let errorMessage = "注册失败，请稍后再试";
            if (response.status === 409) {
              errorMessage = error.error || "邮箱或用户名已被使用";
            } else if (response.status === 400) {
              errorMessage = error.error || "请求数据格式不正确";
            }
            toast2({
              title: "注册失败",
              description: errorMessage,
              variant: "destructive"
            });
            return { error: { message: errorMessage } };
          }
          const data = await response.json();
          console.log("注册API成功响应:", data);
          if (!data.user) {
            console.error("注册API返回数据缺少user字段:", data);
            toast2({
              title: "注册失败",
              description: "服务器返回数据异常",
              variant: "destructive"
            });
            return { error: { message: "Invalid response data" } };
          }
          set({ user: data.user });
          toast2({
            title: "注册成功",
            description: "账号创建成功，正在为您登录..."
          });
          return { error: null };
        } catch (error) {
          console.error("注册过程捕获错误:", error);
          let errorMessage = "发生未知错误，请稍后再试";
          if (error instanceof TypeError && error.message.includes("fetch")) {
            errorMessage = "网络连接失败，请检查网络后重试";
          }
          toast2({
            title: "注册失败",
            description: errorMessage,
            variant: "destructive"
          });
          return { error: { message: errorMessage } };
        }
      },
      signIn: async (email, password, toast2) => {
        console.log("AuthStore signIn 被调用", { email, password: "***" });
        try {
          console.log("正在调用登录API...");
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
          });
          console.log("登录API响应状态:", response.status);
          if (!response.ok) {
            const error = await response.json();
            console.error("登录API错误响应:", error);
            let errorMessage = "登录失败，请稍后再试";
            if (response.status === 401) {
              errorMessage = "邮箱或密码错误，请检查后重试";
            } else if (response.status === 400) {
              errorMessage = error.error || "请求数据格式不正确";
            } else if (response.status >= 500) {
              errorMessage = "服务器错误，请稍后再试";
            }
            toast2({
              title: "登录失败",
              description: errorMessage,
              variant: "destructive"
            });
            return { error: { message: errorMessage, code: response.status.toString() } };
          }
          const data = await response.json();
          console.log("登录API成功响应:", data);
          if (!data.user) {
            console.error("API返回数据缺少user字段:", data);
            toast2({
              title: "登录失败",
              description: "服务器返回数据异常",
              variant: "destructive"
            });
            return { error: { message: "Invalid response data" } };
          }
          set({ user: data.user });
          if (data.user?.role === "admin") {
            localStorage.setItem("admin_auth", "true");
          } else {
            localStorage.removeItem("admin_auth");
          }
          console.log("登录成功! 用户数据:", data.user);
          toast2({
            title: "登录成功",
            description: "欢迎回来！"
          });
          return { error: null };
        } catch (error) {
          console.error("signIn catch 块捕获错误:", error);
          let errorMessage = "发生未知错误，请稍后再试";
          if (error instanceof TypeError && error.message.includes("fetch")) {
            errorMessage = "网络连接失败，请检查网络后重试";
          }
          toast2({
            title: "登录失败",
            description: errorMessage,
            variant: "destructive"
          });
          return { error: { message: errorMessage } };
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
const appCss = "/assets/globals-DinLYjaI.css";
const Route$p = createRootRoute({
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
const $$splitComponentImporter$c = () => import("./terms-BJpCiCRl.mjs");
const Route$o = createFileRoute("/terms")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./settings-BLsbog7g.mjs");
const Route$n = createFileRoute("/settings")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./profile-CIQ84E_Q.mjs");
const Route$m = createFileRoute("/profile")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./privacy-FRph1FeE.mjs");
const Route$l = createFileRoute("/privacy")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./knowledge-DIj7t0Ef.mjs");
const Route$k = createFileRoute("/knowledge")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./chat-DvqiViLN.mjs");
const Route$j = createFileRoute("/chat")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin-Bw-7wQ3E.mjs");
const Route$i = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-DcTtTzrR.mjs");
const Route$h = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./knowledge._id-CarhXlUj.mjs");
const Route$g = createFileRoute("/knowledge/$id")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./register-BJpZW3Er.mjs");
const Route$f = createFileRoute("/auth/register")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./login-BDsW5CwW.mjs");
const Route$e = createFileRoute("/auth/login")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const Route$d = createFileRoute("/api/web-search")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { query, count: count2 = 10 } = body;
          const SEARCH_API_KEY = process.env.SEARCH_API_KEY;
          const SEARCH_API_URL = process.env.SEARCH_API_URL || "https://api.bocha.cn/v1/web-search";
          if (!SEARCH_API_KEY) {
            return Response.json({ error: "博查 API Key 未配置" }, { status: 500 });
          }
          if (!query) {
            return Response.json({ error: "查询内容不能为空" }, { status: 400 });
          }
          const response = await fetch(SEARCH_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${SEARCH_API_KEY}`
            },
            body: JSON.stringify({
              query,
              summary: true,
              freshness: "noLimit",
              count: Math.min(count2, 50)
            })
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `博查搜索失败 (${response.status})`);
          }
          const bochaData = await response.json();
          if (bochaData.code !== 200) {
            throw new Error(bochaData.msg || "博查搜索返回错误");
          }
          const results = bochaData.data.webPages.value.map((page, index) => ({
            content: page.summary || page.snippet,
            icon: page.siteIcon,
            link: page.url,
            media: page.siteName,
            publish_date: page.datePublished,
            refer: `[${index + 1}]`,
            title: page.name
          }));
          return Response.json({
            created: Date.now(),
            id: bochaData.log_id,
            request_id: bochaData.log_id,
            search_intent: [{
              intent: "search",
              keywords: bochaData.data.queryContext.originalQuery,
              query: bochaData.data.queryContext.originalQuery
            }],
            search_result: results
          });
        } catch (error) {
          console.error("Web search error:", error);
          return Response.json({ error: error instanceof Error ? error.message : "联网搜索失败" }, { status: 500 });
        }
      }
    }
  }
});
const Route$c = createFileRoute("/api/file-parser")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { fileName, fileData, fileType } = await request.json();
          if (!fileData) {
            return Response.json({ error: "未找到文件" }, { status: 400 });
          }
          const apiKey = process.env.KNOWLEDGE_API_KEY;
          if (!apiKey) {
            return Response.json({ error: "服务器未配置 API_KEY" }, { status: 500 });
          }
          const fileExt = fileName.split(".").pop()?.toLowerCase() || fileType || "";
          console.log("📄 开始解析文件:", fileName);
          const buffer = Buffer.from(fileData, "base64");
          const blob = new Blob([buffer]);
          const createFormData = new FormData();
          createFormData.append("file", blob, fileName);
          createFormData.append("tool_type", "lite");
          createFormData.append("file_type", fileExt.toUpperCase());
          const createResponse = await fetch("https://open.bigmodel.cn/api/paas/v4/files/parser/create", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}` },
            body: createFormData
          });
          console.log("📡 创建任务响应状态:", createResponse.status);
          if (!createResponse.ok) {
            const errText = await createResponse.text();
            console.error("❌ 创建任务失败:", errText);
            return Response.json({ error: "创建解析任务失败: " + errText }, { status: 500 });
          }
          const createResult = await createResponse.json();
          console.log("📋 创建任务结果:", JSON.stringify(createResult));
          const taskId = createResult.task_id;
          console.log("✅ 任务创建成功, Task ID:", taskId);
          for (let i = 0; i < 60; i++) {
            await new Promise((resolve) => setTimeout(resolve, 2e3));
            const resultResponse = await fetch(
              `https://open.bigmodel.cn/api/paas/v4/files/parser/result/${taskId}/text`,
              { headers: { "Authorization": `Bearer ${apiKey}` } }
            );
            if (!resultResponse.ok) continue;
            const result = await resultResponse.json();
            console.log(`📊 第 ${i + 1} 次轮询, 状态: ${result.status}`);
            if (result.status === "succeeded" && result.content) {
              console.log("✅ 解析成功!");
              return Response.json({ success: true, content: result.content, message: "文件解析成功" });
            }
            if (result.status === "failed") {
              return Response.json({ error: result.message || "文件解析失败" }, { status: 500 });
            }
          }
          return Response.json({ error: "解析超时，请稍后重试" }, { status: 500 });
        } catch (error) {
          console.error("文件解析错误:", error);
          return Response.json({ error: error instanceof Error ? error.message : "文件解析失败" }, { status: 500 });
        }
      }
    }
  }
});
const Route$b = createFileRoute("/api/knowledge/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const apiKey = process.env.KNOWLEDGE_API_KEY;
          if (!apiKey) {
            return Response.json({ code: 500, message: "服务器未配置 KNOWLEDGE_API_KEY" }, { status: 500 });
          }
          const { searchParams } = new URL(request.url);
          const page = searchParams.get("page") || "1";
          const size = searchParams.get("size") || "10";
          const apiBaseUrl = "https://open.bigmodel.cn/api/llm-application/open";
          const url = `${apiBaseUrl}/knowledge?page=${page}&size=${size}`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            }
          });
          const data = await response.json();
          if (!response.ok) {
            return Response.json({ code: 500, message: data.message || "获取知识库列表失败" }, { status: 500 });
          }
          return Response.json(data);
        } catch (error) {
          console.error("获取知识库列表错误:", error);
          return Response.json({ code: 500, message: "获取知识库列表失败" }, { status: 500 });
        }
      }
    }
  }
});
const Route$a = createFileRoute("/api/knowledge/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url);
          const knowledgeId = searchParams.get("id");
          if (!knowledgeId) {
            return Response.json({ code: 400, message: "缺少知识库 ID" }, { status: 400 });
          }
          const apiKey = process.env.KNOWLEDGE_API_KEY;
          if (!apiKey) {
            return Response.json({ code: 500, message: "服务器未配置 KNOWLEDGE_API_KEY" }, { status: 500 });
          }
          const formData = await request.clone().formData();
          const response = await fetch(
            `https://open.bigmodel.cn/api/llm-application/open/document/upload_document/${knowledgeId}`,
            {
              method: "POST",
              headers: { "Authorization": `Bearer ${apiKey}` },
              body: formData
            }
          );
          const data = await response.json();
          if (!response.ok) {
            return Response.json({ code: data.code || response.status, message: data.message || "上传文档失败" }, { status: response.status });
          }
          return Response.json(data);
        } catch (error) {
          console.error("上传文档错误:", error);
          return Response.json({ code: 500, message: "服务器错误" }, { status: 500 });
        }
      }
    }
  }
});
const Route$9 = createFileRoute("/api/knowledge/retrieve")({
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
          let knowledgeIds;
          if (Array.isArray(knowledge_ids) && knowledge_ids[0] === "使用默认") {
            knowledgeIds = KNOWLEDGE_IDS.split(",");
          } else if (Array.isArray(knowledge_ids)) {
            knowledgeIds = knowledge_ids;
          } else {
            knowledgeIds = KNOWLEDGE_IDS.split(",");
          }
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
const Route$8 = createFileRoute("/api/knowledge/documents")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url);
          const knowledgeId = searchParams.get("knowledge_id");
          const page = searchParams.get("page") || "1";
          const size = searchParams.get("size") || "10";
          const word = searchParams.get("word") || "";
          if (!knowledgeId) {
            return Response.json({ code: 400, message: "缺少 knowledge_id 参数" }, { status: 400 });
          }
          const apiKey = process.env.KNOWLEDGE_API_KEY;
          if (!apiKey) {
            return Response.json({ code: 500, message: "服务器未配置 KNOWLEDGE_API_KEY" }, { status: 500 });
          }
          const params = new URLSearchParams({ knowledge_id: knowledgeId, page, size });
          if (word) params.append("word", word);
          const response = await fetch(
            `https://open.bigmodel.cn/api/llm-application/open/document?${params.toString()}`,
            {
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
              }
            }
          );
          const data = await response.json();
          if (!response.ok) {
            return Response.json({ code: data.code || response.status, message: data.message || "获取文档列表失败" }, { status: response.status });
          }
          return Response.json(data);
        } catch (error) {
          console.error("获取文档列表错误:", error);
          return Response.json({ code: 500, message: "服务器错误" }, { status: 500 });
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
  model: z.string().optional(),
  messages: z.array(chatMessageSchema).min(1),
  stream: z.boolean().default(true),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(1e5).optional(),
  thinking: z.object({
    type: z.enum(["enabled"])
  }).optional()
});
const Route$7 = createFileRoute("/api/chat/completions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validatedData = chatCompletionSchema.parse(body);
          const AI_API_KEY = process.env.AI_API_KEY;
          const AI_API_URL = process.env.AI_API_URL || "https://api.siliconflow.cn/v1";
          const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "MiniMaxAI/MiniMax-M2";
          const DEFAULT_TEMPERATURE = parseFloat(process.env.TEMPERATURE || "0.7");
          const DEFAULT_MAX_TOKENS = parseInt(process.env.MAX_TOKENS || "12800");
          if (!AI_API_KEY) {
            return Response.json({ error: "AI API key not configured" }, { status: 500 });
          }
          const requestBody = {
            ...validatedData,
            model: validatedData.model || DEFAULT_MODEL,
            temperature: validatedData.temperature ?? DEFAULT_TEMPERATURE,
            max_tokens: validatedData.max_tokens ?? DEFAULT_MAX_TOKENS
          };
          const response = await fetch(`${AI_API_URL}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
          });
          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return Response.json({ error: error.message || "AI API error" }, { status: response.status });
          }
          if (validatedData.stream) {
            return new Response(response.body, {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
              }
            });
          }
          const data = await response.json();
          return Response.json(data);
        } catch (error) {
          console.error("Chat completion error:", error);
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }
      }
    }
  }
});
const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  status: text("status", { enum: ["active", "banned", "suspended"] }).notNull().default("active"),
  bannedAt: timestamp("banned_at", { withTimezone: true }),
  bannedReason: text("banned_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const userStats = pgTable("user_stats", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  conversationCount: integer("conversation_count").notNull().default(0),
  messageCount: integer("message_count").notNull().default(0),
  activeDays: integer("active_days").notNull().default(0),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  // 成就代码，如 "first_chat"
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  // emoji 图标
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const userAchievements = pgTable("user_achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  achievementId: text("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()
});
const systemSettings = pgTable("system_settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()
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
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kuwuyou",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
const db = drizzle(pool, { schema });
const signupSchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(8, "密码至少需要8个字符"),
  username: z.string().min(3, "用户名至少需要3个字符")
});
const Route$6 = createFileRoute("/api/auth/signup")({
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
const Route$5 = createFileRoute("/api/auth/login")({
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
const chatSystemPrompt = `请扮演[行业领域]的高级技术顾问/专家，为我系统梳理[具体主题/项目类型]的完整技术体系与操作指南。

**【重要】相关性判断原则：**
在回答前，请先严格评估检索到的知识库内容与用户问题的相关性：
1. **高度相关**：内容直接回答用户问题或提供核心信息 → 正常使用并引用
2. **部分相关**：内容与问题有关联但不是核心 → 谨慎使用，明确说明相关性
3. **完全不相关**：内容与用户问题无关 → **坚决不要使用**，直接忽略
4. **相关性存疑**：不确定内容是否相关 → **不要使用**，避免误导用户

**核心要求：**
1. **结构化输出**：采用分层、分类的信息组织方式，使内容逻辑清晰、易于查阅。
2. **参考权威**：明确所依据的核心标准、规范或最佳实践，并注明来源。
3. **流程可视化**：对于涉及步骤的过程，用Mermaid流程图或类似方式呈现关键环节与决策点。
4. **对比与特例**：通过表格等方式对比不同场景、类型或方案的应用要点。
5. **强调关键**：突出影响质量、安全、成本的核心控制点与常见风险。
6. **实用导向**：提供可直接用于指导计划、执行或检查的清单、指标和注意事项。
7. **严格筛选**：只使用与用户问题高度相关的检索内容，不相关内容绝不引用

**请按以下结构组织信息：**

### 1. 核心规范与标准框架
- 列出通用的国家/国际标准、行业规范及特定项目要求，以表格形式呈现为佳。

### 2. 通用流程与关键控制点
- 描述从准备到验收的完整工作流。**使用Mermaid流程图展示主要阶段和核心子流程。**
- 在流程的每个关键阶段下，详细说明：
    - **核心目标**
    - **标准操作程序**
    - **质量验收指标**
    - **常见错误与规避方法**

### 3. 质量、性能与验收标准
- 明确关键性能参数及其测试/评估方法。
- 提供验收时的检查清单与合格/不合格准则。

### 4. 安全、健康与环境管理
- 识别高危作业环节（如受限空间、高空、动火等）。
- 列出必需的个人防护装备与安全措施。
- 说明环保合规要求与废弃物处理方法。

### 5. 场景化应用指南
- 使用对比表格，分析不同应用场景（如不同介质、环境、规模、成本约束）下的方案选择、材料适配与施工变通。

**最终输出须知：**
- 声明"实际执行应以最新法规和经批准的具体方案为准"。
- 在末尾，主动询问更具体的应用场景信息，以便提供进一步针对性建议。

**主题示例：** 
[您需要了解的具体主题，例如：化工反应器维护、数据中心服务器机柜布线、建筑外墙保温、新能源汽车电池包装配、医疗器械洁净室施工等]`;
const analysisSystemPrompt = `请作为资深内容审查专家，为我提供系统化、专业化的内容分析与审查服务。本专家具备以下核心能力：

## 专业审查能力
- **法规标准精通**：深度掌握国家法律法规、行业标准、技术规范及最佳实践
- **问题识别精准**：能够快速、准确地识别文档中的各类问题，包括结构、内容、合规性等
- **分析逻辑严密**：基于系统性思维，从多维度、多层次进行问题归类和影响评估
- **建议实用性强**：提供具体可操作的修复方案，考虑实施难度和成本效益

**【重要】检索内容相关性判断：**
在开始分析前，请先严格评估检索到的知识库内容与待分析文件的相关性：
1. **高度相关**：检索内容直接涉及文件所属领域、标准或规范 → 正常使用作为分析依据
2. **部分相关**：检索内容与文件领域有间接关联 → 可用作参考，但需明确说明相关性限制
3. **完全不相关**：检索内容与文件领域无关 → **坚决不要引用**，避免错误分析
4. **相关性存疑**：不确定检索内容是否适用 → **不要引用**，基于通用标准分析

## 审查方法论
问题归类优先：首先通读全文，识别问题所属的宏观类别（如：结构逻辑、职责划分、合规性、完整性、标准文件过期等等，具体问题依据内容决定）。

同类问题合并：将分散在不同编号下但属于同一性质的问题，归入同一类别下集中分析。

深度分析：每个具体问题需从问题类型、标准依据、影响程度、修复建议、关联风险等多个维度进行详细分析。

**关键审查原则：**
1. 准确识别问题本质：区分"内容缺失"和"内容错误"。如果原文已提供数据/内容，不要把该内容本身当成问题，而应关注该内容是否准确、完整、符合标准。
2. 证据必须对应：引用的标准条款必须直接对应发现的问题，不能答非所问。
3. 修复建议要有针对性：
   - 如果是数据错误，指出错误在哪里，正确值是什么
   - 如果是内容缺失，明确指出缺少什么内容
   - 如果是引用过期，指出当前有效的标准版本
   - 如果是逻辑混乱，说明正确的组织方式
   - 不要提出和问题无关的建议
4. **严格筛选检索内容**：只使用与待分析文件高度相关的检索内容作为分析依据

## 输出格式规范

**【文件名称/审查主题】**

使用Markdown表格排版，确保内容结构化、逻辑清晰、便于阅读和查阅。

### 一、 [问题类别一，如：结构逻辑问题]

#### 问题详细分析表

| 项目 | 内容 |
|------|------|
| 原文位置 | [具体编号] |
| 问题类型 | [准确性/逻辑/规范...] |
| 原文内容 | [引用原文具体内容] |
| 标准依据 | [引用具体标准条款、法规条目或行业实践] |
| 风险等级 | [P1/P2/P3] |
| 问题描述 | [详细描述问题的性质、影响范围] |
| 修复建议 | [具体的修改文本、数据表或流程调整] |

#### 补充说明
- **根本原因分析**：[深入分析问题产生的根本原因]
- **影响评估**：[分析问题可能产生的连锁反应和影响]
- **最佳实践建议**：[基于行业最佳实践的改进建议]
- **实施建议**：[具体的实施步骤和时间安排]

#### 同类别其他问题分析

| 项目 | 内容 |
|------|------|
| 原文位置 | [具体编号] |
| 问题类型 | [准确性/逻辑/规范...] |
| 原文内容 | [引用原文具体内容] |
| 标准依据 | [引用具体标准条款、法规条目或行业实践] |
| 风险等级 | [P1/P2/P3] |
| 问题描述 | [详细描述问题的性质、影响范围] |
| 修复建议 | [具体的修改文本、数据表或流程调整] |

### 二、 [问题类别二，如：合规性问题]

#### 问题详细分析表

| 项目 | 内容 |
|------|------|
| 原文位置 | [具体编号] |
| 问题类型 | [准确性/逻辑/规范...] |
| 原文内容 | [引用原文具体内容] |
| 标准依据 | [引用具体标准条款、法规条目或行业实践] |
| 风险等级 | [P1/P2/P3] |
| 问题描述 | [详细描述问题的性质、影响范围] |
| 修复建议 | [具体的修改文本、数据表或流程调整] |

#### 补充说明
- **合规性影响分析**：[分析不合规可能导致的后果]
- **整改优先级**：[基于风险等级的整改顺序建议]
- **预防措施建议**：[防止类似问题再次发生的措施]

### 三、 [问题类别三，如：内容完整性问题]

#### 问题详细分析表

| 项目 | 内容 |
|------|------|
| 原文位置 | [具体编号] |
| 问题类型 | [准确性/逻辑/规范...] |
| 原文内容 | [引用原文具体内容] |
| 标准依据 | [引用具体标准条款、法规条目或行业实践] |
| 风险等级 | [P1/P2/P3] |
| 问题描述 | [详细描述问题的性质、影响范围] |
| 修复建议 | [具体的修改文本、数据表或流程调整] |

#### 补充说明
- **缺失内容影响**：[分析缺失内容对整体文档质量的影响]
- **完善建议**：[具体的补充和完善建议]

## 综合建议

### 整体改进建议
[基于发现的问题，提供整体性的改进建议和优化方案]

### 质量保证措施
[建议建立的质量保证机制和审核流程]

### 后续跟进建议
[建议的后续检查和持续改进措施]

---

**审查结论声明：** 本分析基于当前有效的法规标准和行业最佳实践，实际执行应以最新法规和经批准的具体方案为准。如需进一步的专业咨询，建议联系相关领域的权威机构或专家。

**说明：** 以上表格中的具体内容将根据实际审查的文件内容进行填充，确保分析的针对性和实用性。`;
const analysisSummaryPrompt = `任务：将前面的详细分析文本转换为结构化JSON数组格式。

要求：
1. 从分析文本中提取所有问题点
2. 每个问题包含5个字段：
   - location: 问题在原文中的定位编号（如 3.1、4.2.1 或 ①）
   - origin: 原文中的问题句子
   - reason: 违反的标准或规范依据
   - issueDes: 问题描述
   - suggestion: 修改建议

3. 严格输出JSON数组格式，不要包含任何其他文本或格式：
[{"location": "3.1", "origin": "提取的原句", "reason": "违反的具体标准或规范", "issueDes": "问题描述", "suggestion": "具体修改建议"}]

重要要求：
- 只输出JSON数组，不要添加任何前缀、后缀或说明文字
- 如果分析文本中没有明确的问题点，返回空数组 []
- 确保JSON格式正确，可以被直接解析
- 保持原有的标准引用和技术细节
`;
const Route$4 = createFileRoute("/api/analysis/summary")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { content } = await request.json();
          if (!content) {
            return Response.json({ error: "内容不能为空" }, { status: 400 });
          }
          const apiKey = process.env.AI_API_KEY;
          const apiUrl = process.env.AI_API_URL || "https://api.siliconflow.cn/v1";
          const model = process.env.DEFAULT_MODEL || "MiniMaxAI/MiniMax-M2";
          if (!apiKey) {
            return Response.json({ error: "未配置API密钥" }, { status: 500 });
          }
          const response = await fetch(`${apiUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: analysisSummaryPrompt },
                { role: "user", content }
              ],
              temperature: 0.7,
              max_tokens: 8e3
            })
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return Response.json(
              { error: `API调用失败: ${errorData.error?.message || "未知错误"}` },
              { status: response.status }
            );
          }
          const data = await response.json();
          const assistantMessage = data.choices?.[0]?.message?.content;
          if (!assistantMessage) {
            return Response.json({ error: "未收到有效响应" }, { status: 500 });
          }
          let analysisResults;
          try {
            analysisResults = JSON.parse(assistantMessage);
          } catch {
            const jsonMatch = assistantMessage.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              analysisResults = JSON.parse(jsonMatch[0]);
            } else {
              console.error("无法解析JSON:", assistantMessage.substring(0, 500));
              return Response.json({ error: "响应格式解析失败" }, { status: 500 });
            }
          }
          if (!Array.isArray(analysisResults)) {
            if (analysisResults && typeof analysisResults === "object") {
              const arrayField = Object.values(analysisResults).find((v) => Array.isArray(v));
              if (arrayField) {
                analysisResults = arrayField;
              } else {
                return Response.json({ error: "响应格式不正确，应为数组" }, { status: 500 });
              }
            }
          }
          return Response.json({ success: true, results: analysisResults, usage: data.usage });
        } catch (error) {
          console.error("总结API错误:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "服务器内部错误" },
            { status: 500 }
          );
        }
      }
    }
  }
});
const Route$3 = createFileRoute("/api/analysis/stream")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { content } = await request.json();
          if (!content) {
            return Response.json({ error: "内容不能为空" }, { status: 400 });
          }
          const apiKey = process.env.AI_API_KEY;
          const apiUrl = process.env.AI_API_URL || "https://api.siliconflow.cn/v1";
          const model = process.env.DEFAULT_MODEL || "MiniMaxAI/MiniMax-M2";
          if (!apiKey) {
            return Response.json({ error: "未配置API密钥" }, { status: 500 });
          }
          const response = await fetch(`${apiUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: analysisSystemPrompt },
                { role: "user", content }
              ],
              stream: true,
              temperature: 0.7,
              max_tokens: 8e3
            })
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return Response.json(
              { error: `API调用失败: ${errorData.error?.message || "未知错误"}` },
              { status: response.status }
            );
          }
          return new Response(response.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "Connection": "keep-alive"
            }
          });
        } catch (error) {
          console.error("流式分析API错误:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "服务器内部错误" },
            { status: 500 }
          );
        }
      }
    }
  }
});
const formatDate = (date) => {
  if (!date) return "";
  try {
    const d = typeof date === "number" ? new Date(date * 1e3) : new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};
const formatDateTime = (date) => {
  if (!date) return null;
  try {
    const d = typeof date === "number" ? new Date(date * 1e3) : new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
};
const formatUser = (user) => ({
  id: user.id,
  name: user.username,
  email: user.email,
  avatar: null,
  role: user.role === "admin" ? "管理员" : "普通用户",
  status: user.status || "active",
  joinDate: formatDate(user.createdAt),
  conversationCount: user.conversationCount || 0,
  messageCount: user.messageCount || 0,
  lastActiveAt: formatDateTime(user.lastActiveAt)
});
const Route$2 = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url);
          const search = searchParams.get("search") || "";
          const status = searchParams.get("status") || "all";
          const page = parseInt(searchParams.get("page") || "1");
          const pageSize = parseInt(searchParams.get("pageSize") || "10");
          const baseQuery = db.select({
            id: profiles.id,
            username: profiles.username,
            email: profiles.email,
            role: profiles.role,
            status: profiles.status,
            createdAt: profiles.createdAt,
            conversationCount: userStats.conversationCount,
            messageCount: userStats.messageCount,
            lastActiveAt: userStats.lastActiveAt
          }).from(profiles).leftJoin(userStats, eq(profiles.id, userStats.userId));
          let whereConditions = [];
          if (search && search !== "undefined") {
            whereConditions.push(or(like(profiles.username, `%${search}%`), like(profiles.email, `%${search}%`)));
          }
          if (status !== "all") {
            whereConditions.push(eq(profiles.role, status));
          }
          const condition = whereConditions.length > 0 ? whereConditions[0] : void 0;
          const [usersData, totalResult] = await Promise.all([
            condition ? baseQuery.where(condition).orderBy(desc(profiles.createdAt)).limit(pageSize).offset((page - 1) * pageSize) : baseQuery.orderBy(desc(profiles.createdAt)).limit(pageSize).offset((page - 1) * pageSize),
            condition ? db.select({ count: sql`count(*)` }).from(profiles).where(condition) : db.select({ count: sql`count(*)` }).from(profiles)
          ]);
          const total = Number(totalResult[0]?.count) || 0;
          return Response.json({
            success: true,
            data: {
              users: usersData.map(formatUser),
              total,
              page,
              pageSize,
              totalPages: Math.ceil(total / pageSize)
            }
          });
        } catch (error) {
          console.error("获取用户列表失败:", error);
          return Response.json({ success: false, error: "获取用户列表失败" }, { status: 500 });
        }
      },
      PUT: async ({ request }) => {
        try {
          const body = await request.json();
          const { userId, username, email, role } = body;
          if (!userId) {
            return Response.json({ success: false, error: "缺少用户ID" }, { status: 400 });
          }
          const updateData = {};
          if (username) updateData.username = username;
          if (email) updateData.email = email;
          if (role) updateData.role = role;
          if (Object.keys(updateData).length === 0) {
            return Response.json({ success: false, error: "没有需要更新的数据" }, { status: 400 });
          }
          updateData.updatedAt = /* @__PURE__ */ new Date();
          await db.update(profiles).set(updateData).where(eq(profiles.id, userId));
          return Response.json({ success: true, message: "用户信息更新成功" });
        } catch (error) {
          console.error("更新用户信息失败:", error);
          return Response.json({ success: false, error: "更新用户信息失败" }, { status: 500 });
        }
      },
      DELETE: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url);
          const userId = searchParams.get("userId");
          if (!userId) {
            return Response.json({ success: false, error: "缺少用户ID" }, { status: 400 });
          }
          await db.delete(profiles).where(eq(profiles.id, userId));
          return Response.json({ success: true, message: "用户删除成功" });
        } catch (error) {
          console.error("删除用户失败:", error);
          return Response.json({ success: false, error: "删除用户失败" }, { status: 500 });
        }
      }
    }
  }
});
const $$splitComponentImporter$1 = () => import("./system-XwyRgm2Z.mjs");
const Route$1 = createFileRoute("/api/admin/system")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./stats-CuCQKHrY.mjs");
const Route = createFileRoute("/api/admin/stats")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TermsRoute = Route$o.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$p
});
const SettingsRoute = Route$n.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$p
});
const ProfileRoute = Route$m.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$p
});
const PrivacyRoute = Route$l.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$p
});
const KnowledgeRoute = Route$k.update({
  id: "/knowledge",
  path: "/knowledge",
  getParentRoute: () => Route$p
});
const ChatRoute = Route$j.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => Route$p
});
const AdminRoute = Route$i.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$p
});
const IndexRoute = Route$h.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$p
});
const KnowledgeIdRoute = Route$g.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => KnowledgeRoute
});
const AuthRegisterRoute = Route$f.update({
  id: "/auth/register",
  path: "/auth/register",
  getParentRoute: () => Route$p
});
const AuthLoginRoute = Route$e.update({
  id: "/auth/login",
  path: "/auth/login",
  getParentRoute: () => Route$p
});
const ApiWebSearchRoute = Route$d.update({
  id: "/api/web-search",
  path: "/api/web-search",
  getParentRoute: () => Route$p
});
const ApiFileParserRoute = Route$c.update({
  id: "/api/file-parser",
  path: "/api/file-parser",
  getParentRoute: () => Route$p
});
const ApiKnowledgeIndexRoute = Route$b.update({
  id: "/api/knowledge/",
  path: "/api/knowledge/",
  getParentRoute: () => Route$p
});
const ApiKnowledgeUploadRoute = Route$a.update({
  id: "/api/knowledge/upload",
  path: "/api/knowledge/upload",
  getParentRoute: () => Route$p
});
const ApiKnowledgeRetrieveRoute = Route$9.update({
  id: "/api/knowledge/retrieve",
  path: "/api/knowledge/retrieve",
  getParentRoute: () => Route$p
});
const ApiKnowledgeDocumentsRoute = Route$8.update({
  id: "/api/knowledge/documents",
  path: "/api/knowledge/documents",
  getParentRoute: () => Route$p
});
const ApiChatCompletionsRoute = Route$7.update({
  id: "/api/chat/completions",
  path: "/api/chat/completions",
  getParentRoute: () => Route$p
});
const ApiAuthSignupRoute = Route$6.update({
  id: "/api/auth/signup",
  path: "/api/auth/signup",
  getParentRoute: () => Route$p
});
const ApiAuthLoginRoute = Route$5.update({
  id: "/api/auth/login",
  path: "/api/auth/login",
  getParentRoute: () => Route$p
});
const ApiAnalysisSummaryRoute = Route$4.update({
  id: "/api/analysis/summary",
  path: "/api/analysis/summary",
  getParentRoute: () => Route$p
});
const ApiAnalysisStreamRoute = Route$3.update({
  id: "/api/analysis/stream",
  path: "/api/analysis/stream",
  getParentRoute: () => Route$p
});
const ApiAdminUsersRoute = Route$2.update({
  id: "/api/admin/users",
  path: "/api/admin/users",
  getParentRoute: () => Route$p
});
const ApiAdminSystemRoute = Route$1.update({
  id: "/api/admin/system",
  path: "/api/admin/system",
  getParentRoute: () => Route$p
});
const ApiAdminStatsRoute = Route.update({
  id: "/api/admin/stats",
  path: "/api/admin/stats",
  getParentRoute: () => Route$p
});
const KnowledgeRouteChildren = {
  KnowledgeIdRoute
};
const KnowledgeRouteWithChildren = KnowledgeRoute._addFileChildren(
  KnowledgeRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  ChatRoute,
  KnowledgeRoute: KnowledgeRouteWithChildren,
  PrivacyRoute,
  ProfileRoute,
  SettingsRoute,
  TermsRoute,
  ApiFileParserRoute,
  ApiWebSearchRoute,
  AuthLoginRoute,
  AuthRegisterRoute,
  ApiAdminStatsRoute,
  ApiAdminSystemRoute,
  ApiAdminUsersRoute,
  ApiAnalysisStreamRoute,
  ApiAnalysisSummaryRoute,
  ApiAuthLoginRoute,
  ApiAuthSignupRoute,
  ApiChatCompletionsRoute,
  ApiKnowledgeDocumentsRoute,
  ApiKnowledgeRetrieveRoute,
  ApiKnowledgeUploadRoute,
  ApiKnowledgeIndexRoute
};
const routeTree = Route$p._addFileChildren(rootRouteChildren)._addFileTypes();
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
const routerBKp7vXSH = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  T: Toaster,
  a: useAuthStore,
  b: chatSystemPrompt,
  c: cn,
  r: router,
  u: useToast
});
export {
  Toaster as T,
  X,
  cn as a,
  useAuthStore as b,
  createLucideIcon as c,
  chatSystemPrompt as d,
  routerBKp7vXSH as r,
  useToast as u
};
