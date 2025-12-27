import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useId } from "react";
import { P as ProtectedRoute } from "./ProtectedRoute-DWGtRxT1.mjs";
import { B as Button } from "./button-Bu7Lw5As.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, I as Input } from "./input-0L70PBJF.mjs";
import { S as Switch, a as Separator } from "./switch-D5ow0PbE.mjs";
import { B as Badge } from "./badge-DN1syeeg.mjs";
import { L as Label } from "./label-4Qley_ee.mjs";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { S as Sun, a as Send, r as resetTutorial } from "./tutorialManager-Dl7d-snb.mjs";
import { c as createLucideIcon, T as Toaster, a as cn, u as useToast } from "./router-BKp7vXSH.mjs";
import { Link } from "@tanstack/react-router";
import { A as ArrowLeft } from "./arrow-left.mjs";
import { S as Settings } from "./settings.mjs";
import { S as Shield } from "./shield.mjs";
import { C as CircleAlert } from "./circle-alert.mjs";
import { C as Check } from "./check.mjs";
import { E as EyeOff, L as Lock } from "./lock.mjs";
import { E as Eye } from "./eye.mjs";
import { C as ChartColumn } from "./chart-column.mjs";
import { U as User } from "./user.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-separator";
import "@radix-ui/react-switch";
import "@radix-ui/react-label";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "zod";
import "drizzle-orm/node-postgres";
import "pg";
import "drizzle-orm/pg-core";
import "drizzle-orm";
import "bcryptjs";
const __iconNode$9 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$9);
const __iconNode$8 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleQuestionMark = createLucideIcon("circle-question-mark", __iconNode$8);
const __iconNode$7 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
  ["path", { d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662", key: "154egf" }]
];
const CircleUser = createLucideIcon("circle-user", __iconNode$7);
const __iconNode$6 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$6);
const __iconNode$5 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4", key: "g0fldk" }],
  ["path", { d: "m21 2-9.6 9.6", key: "1j0ho8" }],
  ["circle", { cx: "7.5", cy: "15.5", r: "5.5", key: "yqb3hr" }]
];
const Key = createLucideIcon("key", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
];
const Moon = createLucideIcon("moon", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
      key: "e79jfc"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
];
const Palette = createLucideIcon("palette", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M12 22v-5", key: "1ega77" }],
  ["path", { d: "M9 8V2", key: "14iosj" }],
  ["path", { d: "M15 8V2", key: "18g5xt" }],
  ["path", { d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z", key: "osxo6l" }]
];
const Plug = createLucideIcon("plug", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function AccountSettings() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "账户" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "管理你的账户信息" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(User, { className: "h-5 w-5" }),
          "账户管理"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "管理你的个人信息" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full justify-start h-12", children: [
          /* @__PURE__ */ jsx(User, { className: "h-4 w-4 mr-3" }),
          /* @__PURE__ */ jsx("span", { children: "编辑个人资料" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full justify-start h-12", children: [
          /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 mr-3" }),
          /* @__PURE__ */ jsx("span", { children: "订阅计划" })
        ] }),
        /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: "w-full justify-start h-12 text-destructive border-destructive/50 hover:bg-destructive/10",
            children: [
              /* @__PURE__ */ jsx(User, { className: "h-4 w-4 mr-3" }),
              /* @__PURE__ */ jsx("span", { children: "删除账户" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
function ConnectionsSettings({
  siliconflowApiKey,
  showSiliconflowApiKey,
  siliconflowApiKeySaved,
  onSiliconflowApiKeyChange,
  onToggleShowSiliconflowApiKey,
  onSaveSiliconflowApiKey,
  onClearSiliconflowApiKey
}) {
  const siliconflowApiKeyId = useId();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "应用与连接器" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "管理 API 密钥和集成" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Key, { className: "h-5 w-5" }),
            "SiliconFlow AI 密钥"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "配置 SiliconFlow API 以启用 DeepSeek 模型" })
        ] }),
        siliconflowApiKey && /* @__PURE__ */ jsxs(Badge, { className: "gap-1.5 bg-green-500/10 text-green-500 border-green-500/20", children: [
          /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }),
          "已配置"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "siliconflow-api-key", className: "text-sm font-medium", children: "SiliconFlow API Key" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: siliconflowApiKeyId,
                  type: showSiliconflowApiKey ? "text" : "password",
                  value: siliconflowApiKey,
                  onChange: (e) => onSiliconflowApiKeyChange(e.target.value),
                  placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx",
                  className: "pr-10 h-11"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "absolute right-0 top-0 h-full hover:bg-transparent",
                  onClick: onToggleShowSiliconflowApiKey,
                  children: showSiliconflowApiKey ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 text-muted-foreground" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: onSaveSiliconflowApiKey,
                disabled: !siliconflowApiKey.trim(),
                className: "gap-2 min-w-[100px] h-11",
                children: siliconflowApiKeySaved ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }),
                  "已保存"
                ] }) : "保存密钥"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30", children: [
            /* @__PURE__ */ jsx(CircleQuestionMark, { className: "h-4 w-4 text-muted-foreground mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
              "你的 API 密钥将被安全地存储在浏览器本地。",
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "https://siliconflow.cn/api-keys",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-primary hover:underline ml-1 font-medium",
                  children: "获取 API 密钥"
                }
              )
            ] })
          ] })
        ] }),
        siliconflowApiKey && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: onClearSiliconflowApiKey,
            className: "w-full text-destructive border-destructive/50 hover:bg-destructive/10 h-10",
            children: "清除 API 密钥"
          }
        )
      ] })
    ] })
  ] });
}
function DataSettings() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "数据管理" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "管理你的数据和隐私" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Database, { className: "h-5 w-5" }),
          "数据控制"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "控制你的数据如何被使用" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full justify-start h-12", children: [
          /* @__PURE__ */ jsx(ChartColumn, { className: "h-4 w-4 mr-3" }),
          /* @__PURE__ */ jsx("span", { children: "导出数据" })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: "w-full justify-start h-12 text-destructive border-destructive/50 hover:bg-destructive/10",
            children: [
              /* @__PURE__ */ jsx(Database, { className: "h-4 w-4 mr-3" }),
              /* @__PURE__ */ jsx("span", { children: "清除所有对话历史" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
const useThemeStore = create()(
  persist(
    (set, get) => ({
      theme: "default",
      isDark: true,
      setTheme: (theme) => {
        set({ theme });
        const { isDark } = get();
        get().applyTheme(theme, isDark);
      },
      setDarkMode: (isDark) => {
        set({ isDark });
        const { theme } = get();
        get().applyTheme(theme, isDark);
      },
      toggleDarkMode: () => {
        const { isDark } = get();
        get().setDarkMode(!isDark);
      },
      applyTheme: (theme, isDark) => {
        if (typeof window === "undefined") return;
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        if (isDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
function GeneralSettings({
  darkMode,
  onDarkModeToggle
}) {
  const darkModeId = useId();
  const { theme, setTheme } = useThemeStore();
  const { toast } = useToast();
  const handleResetTutorial = () => {
    resetTutorial();
    toast({
      title: "新手教程已重置",
      description: "下次进入聊天页面时将重新显示新手教程"
    });
  };
  const themeOptions = [
    {
      value: "default",
      label: "默认主题",
      icon: /* @__PURE__ */ jsx(Palette, { className: "h-5 w-5" }),
      description: "经典简约风格"
    },
    {
      value: "tech",
      label: "科技主题",
      icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5" }),
      description: "未来科技感"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "常规" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "管理基本设置和偏好" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Palette, { className: "h-5 w-5" }),
          "外观"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "自定义视觉体验" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium", children: "主题风格" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: themeOptions.map((option) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setTheme(option.value),
              className: `
										relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all overflow-hidden group
										${theme === option.value ? option.value === "tech" ? "border-primary bg-primary/10 shadow-[0_0_20px_-5px_var(--primary)]" : "border-primary bg-primary/5 shadow-sm" : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"}
									`,
              children: [
                option.value === "tech" && theme === "tech" && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-foreground relative z-10", children: [
                  option.icon,
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: option.label })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground text-left relative z-10", children: option.description }),
                theme === option.value && /* @__PURE__ */ jsx("div", { className: `absolute top-2 right-2 h-2 w-2 rounded-full ${option.value === "tech" ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-primary"}` })
              ]
            },
            option.value
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: darkModeId, className: "text-sm font-medium", children: "深色模式" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "护眼的深色主题" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            darkMode ? /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                id: darkModeId,
                checked: darkMode,
                onCheckedChange: onDarkModeToggle
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CircleQuestionMark, { className: "h-5 w-5" }),
          "帮助与指引"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "管理新手教程和帮助信息" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-muted/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium", children: "重置新手教程" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "下次进入聊天页面时将重新显示新手教程" })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleResetTutorial,
            children: "重置"
          }
        )
      ] }) })
    ] })
  ] });
}
function NotificationSettings({
  isSupported,
  permission,
  notificationsEnabled,
  onNotificationToggle,
  onTestNotification
}) {
  const notificationsId = useId();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "通知" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "管理浏览器通知权限和偏好设置" })
    ] }),
    !isSupported && /* @__PURE__ */ jsx(Card, { className: "border-yellow-500/50 bg-yellow-500/10", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(CircleAlert, { className: "h-5 w-5 text-yellow-500 mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-yellow-500", children: "浏览器不支持通知" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "您的浏览器不支持桌面通知功能,请使用现代浏览器如 Chrome、Firefox 或 Edge。" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }),
            "浏览器通知"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "接收重要更新和消息提醒" })
        ] }),
        permission === "granted" && /* @__PURE__ */ jsxs(Badge, { className: "gap-1.5 bg-green-500/10 text-green-500 border-green-500/20", children: [
          /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }),
          "已授权"
        ] }),
        permission === "denied" && /* @__PURE__ */ jsxs(Badge, { className: "gap-1.5 bg-red-500/10 text-red-500 border-red-500/20", children: [
          /* @__PURE__ */ jsx(CircleAlert, { className: "h-3 w-3" }),
          "已拒绝"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "notifications", className: "text-sm font-medium", children: "启用浏览器通知" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "允许网站发送桌面通知" })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: notificationsId,
              checked: notificationsEnabled,
              onCheckedChange: onNotificationToggle,
              disabled: !isSupported || permission === "denied"
            }
          )
        ] }),
        permission === "denied" && /* @__PURE__ */ jsx("div", { className: "p-4 rounded-lg border border-red-500/50 bg-red-500/10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(CircleAlert, { className: "h-5 w-5 text-red-500 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-red-500", children: "通知权限已被拒绝" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "请在浏览器设置中允许通知权限。您可以点击地址栏左侧的锁图标,然后在权限设置中修改通知权限。" })
          ] })
        ] }) }),
        notificationsEnabled && permission === "granted" && /* @__PURE__ */ jsx("div", { className: "space-y-3 pt-4 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "测试通知" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "发送一条测试通知以确保功能正常" })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: onTestNotification,
              variant: "outline",
              size: "sm",
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
                "发送测试"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30", children: [
          /* @__PURE__ */ jsx(CircleQuestionMark, { className: "h-4 w-4 text-muted-foreground mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
            /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "关于通知:" }),
            "启用后,您将在收到新消息时收到桌面通知。通知仅在浏览器窗口不活跃时显示。"
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
function SecuritySettings() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "安全" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "保护你的账户安全" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5" }),
          "安全选项"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "管理账户安全设置" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full justify-start h-12", children: [
          /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 mr-3" }),
          /* @__PURE__ */ jsx("span", { children: "修改密码" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full justify-start h-12", children: [
          /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 mr-3" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-1", children: [
            /* @__PURE__ */ jsx("span", { children: "两步验证" }),
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "推荐" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const sidebarItems = [
  { id: "general", label: "常规", icon: Settings },
  { id: "notifications", label: "通知", icon: Bell },
  { id: "connections", label: "连接", icon: Plug },
  { id: "data", label: "数据管理", icon: Database },
  { id: "security", label: "安全", icon: Shield },
  { id: "account", label: "账户", icon: CircleUser }
];
function SettingsSidebar({
  activeSection,
  onSectionChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "w-64 border-r border-border/40 bg-muted/30 flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-border/40", children: /* @__PURE__ */ jsx(Link, { to: "/chat", children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "w-full justify-start gap-2 hover:bg-muted",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "返回聊天" })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 py-6", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold", children: "设置" }) }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 px-2 pb-4 space-y-1 overflow-y-auto", children: sidebarItems.map((item) => {
      const Icon = item.icon;
      const isActive = activeSection === item.id;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSectionChange(item.id),
          className: cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          ),
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: item.label })
          ]
        },
        item.id
      );
    }) })
  ] });
}
function SettingsPage() {
  return /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(SettingsPageContent, {}) });
}
function SettingsPageContent() {
  const [activeSection, setActiveSection] = useState("general");
  const {
    isDark,
    toggleDarkMode
  } = useThemeStore();
  const [siliconflowApiKey, setSiliconflowApiKey] = useState("");
  const [showSiliconflowApiKey, setShowSiliconflowApiKey] = useState(false);
  const [siliconflowApiKeySaved, setSiliconflowApiKeySaved] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState("default");
  useEffect(() => {
    const savedKey = localStorage.getItem("siliconflow_api_key");
    if (savedKey) setSiliconflowApiKey(savedKey);
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);
  const handleSaveSiliconflowApiKey = () => {
    if (siliconflowApiKey.trim()) {
      localStorage.setItem("siliconflow_api_key", siliconflowApiKey.trim());
      setSiliconflowApiKeySaved(true);
      setTimeout(() => setSiliconflowApiKeySaved(false), 2e3);
    }
  };
  const handleClearSiliconflowApiKey = () => {
    setSiliconflowApiKey("");
    localStorage.removeItem("siliconflow_api_key");
  };
  const handleNotificationToggle = async (checked) => {
    if (checked && typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setNotificationsEnabled(permission === "granted");
    } else {
      setNotificationsEnabled(false);
    }
  };
  const handleTestNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("测试通知", {
        body: "这是一条来自库无忧助手的测试通知消息 🎉"
      });
    }
  };
  const isNotificationSupported = typeof window !== "undefined" && "Notification" in window;
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Toaster, {}),
    /* @__PURE__ */ jsx(SettingsSidebar, { activeSection, onSectionChange: setActiveSection }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto p-8", children: [
      activeSection === "general" && /* @__PURE__ */ jsx(GeneralSettings, { darkMode: isDark, onDarkModeToggle: toggleDarkMode }),
      activeSection === "notifications" && /* @__PURE__ */ jsx(NotificationSettings, { isSupported: isNotificationSupported, permission: notificationPermission, notificationsEnabled, onNotificationToggle: handleNotificationToggle, onTestNotification: handleTestNotification }),
      activeSection === "connections" && /* @__PURE__ */ jsx(ConnectionsSettings, { siliconflowApiKey, showSiliconflowApiKey, siliconflowApiKeySaved, onSiliconflowApiKeyChange: setSiliconflowApiKey, onToggleShowSiliconflowApiKey: () => setShowSiliconflowApiKey(!showSiliconflowApiKey), onSaveSiliconflowApiKey: handleSaveSiliconflowApiKey, onClearSiliconflowApiKey: handleClearSiliconflowApiKey }),
      activeSection === "data" && /* @__PURE__ */ jsx(DataSettings, {}),
      activeSection === "security" && /* @__PURE__ */ jsx(SecuritySettings, {}),
      activeSection === "account" && /* @__PURE__ */ jsx(AccountSettings, {})
    ] }) })
  ] });
}
export {
  SettingsPage as component
};
