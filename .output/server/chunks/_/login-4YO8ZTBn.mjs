import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRouter, Link } from "@tanstack/react-router";
import { useId, useState, useEffect } from "react";
import { B as Button } from "./button-siVlPLhQ.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, I as Input, e as CardFooter } from "./input-i-smxDMb.mjs";
import { L as Label } from "./label-7JlTbL8K.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D2adV2O_.mjs";
import { u as useAuth } from "./useAuth-BGX1kSaY.mjs";
import { c as createLucideIcon, b as useAuthStore } from "./router-CTkf14GH.mjs";
import { M as Mail } from "./mail.mjs";
import { L as Lock, E as EyeOff } from "./lock.mjs";
import { E as Eye } from "./eye.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-tabs";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "zustand";
import "zustand/middleware";
import "zod";
import "drizzle-orm/libsql";
import "@libsql/client";
import "drizzle-orm/sqlite-core";
import "drizzle-orm";
import "bcryptjs";
const __iconNode = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode);
function LoginPageContent() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const { signIn, user, loading } = useAuth();
  const authStore = useAuthStore();
  useEffect(() => {
    if (!authStore.initialized) {
      console.log("登录页面：正在初始化认证状态...");
      authStore.initialize();
    }
  }, [authStore]);
  useEffect(() => {
    if (user && !loading && authStore.initialized) {
      console.log("用户已登录，重定向到聊天页面");
      router.navigate({ to: "/chat" });
    }
  }, [user, loading, authStore.initialized, router]);
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = loginForm.email.trim();
    const password = loginForm.password.trim();
    if (!email) {
      alert("请输入邮箱");
      return;
    }
    if (!password) {
      alert("请输入密码");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("邮箱格式错误");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (!error) {
        router.navigate({ to: "/chat" });
      }
    } catch (error) {
      console.error("登录错误:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center p-4 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md relative z-10", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center mb-8", children: /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent", children: "库无忧助手" }) }),
    /* @__PURE__ */ jsxs(Card, { className: "border-white/40 shadow-2xl backdrop-blur-xl bg-white/95 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/30 to-gray-50/30 pointer-events-none" }),
      /* @__PURE__ */ jsxs(CardHeader, { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/",
            className: "inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors group",
            children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "w-5 h-5 transition-transform group-hover:-translate-x-1",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ jsx("title", { children: "返回箭头" }),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "返回主页" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl text-center text-gray-800", children: "登录账号" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-center text-gray-600", children: "选择登录方式" })
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "email", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid max-w-sm grid-cols-2 mx-auto mb-6", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "email", children: "邮箱登录" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "dingtalk", children: "钉钉登录" })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "email", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, children: [
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: emailId, className: "text-gray-700", children: "邮箱地址" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: emailId,
                    type: "email",
                    placeholder: "your@email.com",
                    value: loginForm.email,
                    onChange: (e) => setLoginForm({ ...loginForm, email: e.target.value }),
                    className: "pl-10 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: passwordId, className: "text-gray-700", children: "密码" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: passwordId,
                    type: showPassword ? "text" : "password",
                    placeholder: "••••••••",
                    value: loginForm.password,
                    onChange: (e) => setLoginForm({
                      ...loginForm,
                      password: e.target.value
                    }),
                    className: "pl-10 pr-10 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPassword(!showPassword),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors",
                    children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-sm", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer group", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-600/20 transition-all"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 group-hover:text-gray-800 transition-colors", children: "记住我" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(CardFooter, { className: "flex flex-col gap-4 relative", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                className: "w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]",
                disabled: isLoading,
                children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" }),
                  "登录中..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(LogIn, { className: "w-4 h-4 mr-2" }),
                  "登录"
                ] })
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-center text-gray-600", children: [
              "还没有账号?",
              " ",
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: "/auth/register",
                  className: "text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors",
                  children: "立即注册"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "dingtalk", children: [
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-4 relative py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "钉钉扫码区域" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "请使用钉钉扫码登录" })
          ] }) }),
          /* @__PURE__ */ jsx(CardFooter, { className: "flex flex-col gap-4 relative", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-center text-gray-600", children: [
            "还没有账号?",
            " ",
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/auth/register",
                className: "text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors",
                children: "立即注册"
              }
            )
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-center text-xs text-gray-600 mt-6", children: [
      "继续即表示您同意我们的",
      " ",
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/terms",
          className: "text-blue-600 hover:text-blue-700 hover:underline transition-colors",
          children: "服务条款"
        }
      ),
      " ",
      "和",
      " ",
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/privacy",
          className: "text-blue-600 hover:text-blue-700 hover:underline transition-colors",
          children: "隐私政策"
        }
      )
    ] })
  ] }) });
}
function LoginPage() {
  return /* @__PURE__ */ jsx(LoginPageContent, {});
}
export {
  LoginPage as component
};
