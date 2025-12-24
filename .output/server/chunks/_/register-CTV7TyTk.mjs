import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, useRouter } from "@tanstack/react-router";
import { useId, useState, useMemo } from "react";
import { B as Button } from "./button-siVlPLhQ.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, I as Input, e as CardFooter } from "./input-i-smxDMb.mjs";
import { L as Label } from "./label-7JlTbL8K.mjs";
import { u as useAuth } from "./useAuth-BGX1kSaY.mjs";
import { c as createLucideIcon, u as useToast, X } from "./router-CTkf14GH.mjs";
import { P as Progress } from "./progress-Cv5iTomD.mjs";
import { U as User } from "./user.mjs";
import { M as Mail } from "./mail.mjs";
import { L as Lock, E as EyeOff } from "./lock.mjs";
import { E as Eye } from "./eye.mjs";
import { C as Check } from "./check.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
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
import "@radix-ui/react-progress";
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function calculatePasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password)
  };
  let score = 0;
  if (checks.length) score += 20;
  if (checks.lowercase) score += 20;
  if (checks.uppercase) score += 20;
  if (checks.number) score += 20;
  if (checks.special) score += 20;
  let label = "弱";
  if (score >= 80) label = "强";
  else if (score >= 60) label = "中";
  else if (score >= 40) label = "一般";
  return {
    score,
    label,
    checks
  };
}
const PENDING_LOGIN_KEY = "pending_login";
function savePendingLogin(email, password) {
  const data = {
    email,
    password,
    timestamp: Date.now()
  };
  localStorage.setItem(PENDING_LOGIN_KEY, JSON.stringify(data));
}
function PasswordStrengthIndicator({
  password,
  score,
  label,
  checks
}) {
  if (!password) return null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "密码强度:" }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `font-medium ${score <= 40 ? "text-red-500" : score <= 60 ? "text-yellow-500" : score <= 80 ? "text-blue-500" : "text-green-500"}`,
          children: label
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Progress, { value: score, className: "h-1.5 bg-gray-200" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center gap-1 ${checks?.length ? "text-green-500" : "text-gray-400"}`,
          children: [
            checks?.length ? /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsx("span", { children: "至少8个字符" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center gap-1 ${checks?.uppercase ? "text-green-500" : "text-gray-400"}`,
          children: [
            checks?.uppercase ? /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsx("span", { children: "包含大写字母" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center gap-1 ${checks?.number ? "text-green-500" : "text-gray-400"}`,
          children: [
            checks?.number ? /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsx("span", { children: "包含数字" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center gap-1 ${checks?.special ? "text-green-500" : "text-gray-400"}`,
          children: [
            checks?.special ? /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsx("span", { children: "包含特殊字符" })
          ]
        }
      )
    ] })
  ] });
}
function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const passwordStrength = useMemo(() => {
    return calculatePasswordStrength(registerForm.password);
  }, [registerForm.password]);
  const handleRegister = async (e) => {
    e.preventDefault();
    const username = registerForm.username.trim();
    const email = registerForm.email.trim();
    const password = registerForm.password.trim();
    const confirmPassword = registerForm.confirmPassword.trim();
    if (!username) {
      toast({
        title: "请输入用户名",
        description: "用户名不能为空",
        variant: "destructive"
      });
      return;
    }
    if (username.length < 2) {
      toast({
        title: "用户名太短",
        description: "用户名至少需要2个字符",
        variant: "destructive"
      });
      return;
    }
    if (!email) {
      toast({
        title: "请输入邮箱",
        description: "邮箱地址不能为空",
        variant: "destructive"
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "邮箱格式错误",
        description: "请输入有效的邮箱地址",
        variant: "destructive"
      });
      return;
    }
    if (!password) {
      toast({
        title: "请输入密码",
        description: "密码不能为空",
        variant: "destructive"
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "密码太短",
        description: "密码至少需要6个字符",
        variant: "destructive"
      });
      return;
    }
    if (passwordStrength.score < 40) {
      toast({
        title: "密码强度不足",
        description: "请使用更强的密码(建议包含大小写字母、数字和特殊字符)",
        variant: "destructive"
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "请确保两次输入的密码相同",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, username);
      if (!error) {
        savePendingLogin(email, password);
        router.navigate({ to: "/auth/login" });
      }
    } catch (error) {
      console.error("注册错误:", error);
      toast({
        title: "注册失败",
        description: "发生未知错误,请稍后再试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "border-white/40 shadow-2xl backdrop-blur-xl bg-white/95 overflow-hidden", children: [
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
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl text-center text-gray-800", children: "注册账号" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleRegister, children: [
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "register-username", className: "text-gray-700", children: "用户名" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: usernameId,
                type: "text",
                placeholder: "选择一个用户名",
                value: registerForm.username,
                onChange: (e) => setRegisterForm({
                  ...registerForm,
                  username: e.target.value
                }),
                className: "pl-10 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "register-email", className: "text-gray-700", children: "邮箱地址" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: emailId,
                type: "email",
                placeholder: "your@email.com",
                value: registerForm.email,
                onChange: (e) => setRegisterForm({
                  ...registerForm,
                  email: e.target.value
                }),
                className: "pl-10 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "register-password", className: "text-gray-700", children: "密码" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: passwordId,
                type: showPassword ? "text" : "password",
                placeholder: "至少6个字符",
                value: registerForm.password,
                onChange: (e) => setRegisterForm({
                  ...registerForm,
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
          ] }),
          /* @__PURE__ */ jsx(
            PasswordStrengthIndicator,
            {
              password: registerForm.password,
              score: passwordStrength.score,
              label: passwordStrength.label,
              checks: passwordStrength.checks
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            Label,
            {
              htmlFor: "register-confirm-password",
              className: "text-gray-700",
              children: "确认密码"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: confirmPasswordId,
                type: showConfirmPassword ? "text" : "password",
                placeholder: "再次输入密码",
                value: registerForm.confirmPassword,
                onChange: (e) => setRegisterForm({
                  ...registerForm,
                  confirmPassword: e.target.value
                }),
                className: "pl-10 pr-10 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowConfirmPassword(!showConfirmPassword),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors",
                children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
              }
            )
          ] }),
          registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && /* @__PURE__ */ jsxs("p", { className: "text-xs text-red-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }),
            "密码不匹配"
          ] }),
          registerForm.confirmPassword && registerForm.password === registerForm.confirmPassword && /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }),
            "密码匹配"
          ] })
        ] })
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
              "注册中..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(UserPlus, { className: "w-4 h-4 mr-2" }),
              "注册"
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-center text-gray-600", children: [
          "已有账号?",
          " ",
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/auth/login",
              className: "text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors",
              children: "立即登录"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function RegisterPageContent() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center p-4 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md relative z-10", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center mb-8", children: /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent", children: "库无忧助手" }) }),
    /* @__PURE__ */ jsx(RegisterForm, {}),
    /* @__PURE__ */ jsxs("p", { className: "text-center text-xs text-gray-500 mt-6", children: [
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
function RegisterPage() {
  return /* @__PURE__ */ jsx(RegisterPageContent, {});
}
export {
  RegisterPage as component
};
