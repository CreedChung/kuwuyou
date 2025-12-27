import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useId } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { B as Button } from "./button-Bu7Lw5As.mjs";
import { c as createLucideIcon, b as useAuthStore, a as cn, u as useToast } from "./router-BKp7vXSH.mjs";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle, c as CardDescription, I as Input } from "./input-0L70PBJF.mjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { B as Badge } from "./badge-DN1syeeg.mjs";
import { L as Label } from "./label-4Qley_ee.mjs";
import { S as Switch, a as Separator } from "./switch-D5ow0PbE.mjs";
import * as SelectPrimitive from "@radix-ui/react-select";
import { R as RefreshCw, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-cP7Fqz_n.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-vOGP6dl9.mjs";
import { P as ProtectedRoute } from "./ProtectedRoute-DWGtRxT1.mjs";
import { L as LoaderCircle } from "./loader-circle.mjs";
import { S as Shield } from "./shield.mjs";
import { A as ArrowLeft } from "./arrow-left.mjs";
import { C as ChartColumn } from "./chart-column.mjs";
import { U as Users } from "./users.mjs";
import { S as Settings } from "./settings.mjs";
import { M as MessageSquare, b as Clock, G as Globe, T as Trash2, C as ChevronLeft, a as ChevronRight, d as ChevronDown, c as ChevronUp } from "./trash-2.mjs";
import { U as Upload } from "./upload.mjs";
import { C as Calendar } from "./calendar.mjs";
import { S as Search } from "./search.mjs";
import { E as Eye } from "./eye.mjs";
import { C as Check } from "./check.mjs";
import { U as User } from "./user.mjs";
import { M as Mail } from "./mail.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "zod";
import "drizzle-orm/node-postgres";
import "pg";
import "drizzle-orm/pg-core";
import "drizzle-orm";
import "bcryptjs";
import "@radix-ui/react-label";
import "@radix-ui/react-separator";
import "@radix-ui/react-switch";
import "@radix-ui/react-dialog";
import "./react-icons.esm.mjs";
import "@radix-ui/react-tabs";
const __iconNode$7 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$7);
const __iconNode$6 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
const sidebarItems = [
  { id: "overview", label: "概览", icon: ChartColumn },
  { id: "users", label: "用户管理", icon: Users },
  { id: "analytics", label: "数据分析", icon: Activity },
  { id: "system", label: "系统设置", icon: Settings }
];
function AdminSidebar({
  activeSection,
  onSectionChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "w-64 border-r border-border/40 bg-muted/30 flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-border/40", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "w-full justify-start gap-2 hover:bg-muted",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "返回" })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(Shield, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold", children: "管理员面板" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "系统管理与监控" })
    ] }),
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
const defaultSystemStats = {
  totalUsers: 0,
  activeUsers: 0,
  totalRevenue: 0,
  totalMessages: 0,
  userGrowth: 0,
  activeGrowth: 0,
  revenueGrowth: 0,
  messageGrowth: 0
};
const defaultSystemStatus = {
  server: "normal",
  database: "normal",
  api: "normal",
  uptime: "0天 0小时",
  dbResponseTime: "0ms"
};
const useAdminStore = create()(
  persist(
    (set) => ({
      adminUser: null,
      isAdmin: false,
      systemStats: defaultSystemStats,
      systemStatus: defaultSystemStatus,
      setAdminUser: (user) => set({
        adminUser: user,
        isAdmin: user !== null
      }),
      updateSystemStats: (stats) => set((state) => ({
        systemStats: { ...state.systemStats, ...stats }
      })),
      updateSystemStatus: (status) => set((state) => ({
        systemStatus: { ...state.systemStatus, ...status }
      })),
      logout: () => set({
        adminUser: null,
        isAdmin: false
      })
    }),
    {
      name: "admin-storage",
      partialize: (state) => ({
        adminUser: state.adminUser,
        isAdmin: state.isAdmin
      })
    }
  )
);
function AnalyticsSection() {
  const { systemStats } = useAdminStore();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/analytics");
      const result = await response.json();
      if (result.success) {
        setAnalyticsData(result.data);
      }
    } catch (error) {
      console.error("获取分析数据失败:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnalytics();
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "数据分析" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "查看详细的数据统计和分析报告" })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: fetchAnalytics,
          disabled: loading,
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }),
            "刷新"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ChartColumn, { className: "h-5 w-5" }),
          "使用统计"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "过去30天的使用数据" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(MessageSquare, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: "总消息数" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "所有用户消息" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: analyticsData?.totalMessages.toLocaleString() || systemStats.totalMessages.toLocaleString() }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-500 flex items-center gap-1 justify-end", children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }),
              "+",
              systemStats.messageGrowth,
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: "活跃用户" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "30天内活跃" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: analyticsData?.activeUsers.toLocaleString() || systemStats.activeUsers.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: "平均响应时间" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "AI 响应速度" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold", children: [
            analyticsData?.avgResponseTime || "1.2",
            "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Globe, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: "API 调用次数" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "总请求数" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: analyticsData?.apiCalls.toLocaleString() || "0" })
        ] })
      ] }) })
    ] }),
    analyticsData?.dailyStats && /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5" }),
          "每日统计"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "最近7天的活动趋势" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: analyticsData.dailyStats.slice(-7).map((stat) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-muted/50", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: stat.date }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
            "消息: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: stat.messages })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
            "用户: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: stat.users })
          ] })
        ] })
      ] }, stat.date)) }) })
    ] })
  ] });
}
function OverviewSection() {
  const { systemStats, systemStatus, updateSystemStats, updateSystemStatus } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/stats");
      const result = await response.json();
      if (result.success) {
        updateSystemStats(result.data);
      }
    } catch (error) {
      console.error("获取统计数据失败:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("/api/admin/system");
      const result = await response.json();
      if (result.success) {
        updateSystemStatus(result.data);
      }
    } catch (error) {
      console.error("获取系统状态失败:", error);
    }
  };
  useEffect(() => {
    fetchStats();
    fetchSystemStatus();
    const interval = setInterval(() => {
      fetchStats();
      fetchSystemStatus();
    }, 3e4);
    return () => clearInterval(interval);
  }, []);
  const getStatusBadge = (status) => {
    switch (status) {
      case "normal":
        return /* @__PURE__ */ jsxs(Badge, { className: "gap-1.5 bg-green-500/10 text-green-500 border-green-500/20", children: [
          /* @__PURE__ */ jsx(CircleCheckBig, { className: "h-3 w-3" }),
          "正常"
        ] });
      case "warning":
        return /* @__PURE__ */ jsxs(Badge, { className: "gap-1.5 bg-yellow-500/10 text-yellow-500 border-yellow-500/20", children: [
          /* @__PURE__ */ jsx(TriangleAlert, { className: "h-3 w-3" }),
          "警告"
        ] });
      case "error":
        return /* @__PURE__ */ jsxs(Badge, { className: "gap-1.5 bg-red-500/10 text-red-500 border-red-500/20", children: [
          /* @__PURE__ */ jsx(TriangleAlert, { className: "h-3 w-3" }),
          "错误"
        ] });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "系统概览" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "查看系统整体运行状态和关键指标" })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: fetchStats,
          disabled: loading,
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }),
            "刷新"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-muted-foreground" }),
          systemStats.userGrowth >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-red-500" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: systemStats.totalUsers.toLocaleString() }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "总用户数" }),
          /* @__PURE__ */ jsxs("p", { className: `text-xs font-medium ${systemStats.userGrowth >= 0 ? "text-green-500" : "text-red-500"}`, children: [
            systemStats.userGrowth >= 0 ? "+" : "",
            systemStats.userGrowth,
            "%"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx(MessageSquare, { className: "h-5 w-5 text-muted-foreground" }),
          systemStats.messageGrowth >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-red-500" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: systemStats.totalMessages.toLocaleString() }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "消息总数" }),
          /* @__PURE__ */ jsxs("p", { className: `text-xs font-medium ${systemStats.messageGrowth >= 0 ? "text-green-500" : "text-red-500"}`, children: [
            systemStats.messageGrowth >= 0 ? "+" : "",
            systemStats.messageGrowth,
            "%"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5" }),
          "系统状态"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "实时系统运行状态" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "服务器状态" }),
            getStatusBadge(systemStatus.server)
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "运行时间: ",
            systemStatus.uptime
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "数据库" }),
            getStatusBadge(systemStatus.database)
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "响应时间: ",
            systemStatus.dbResponseTime
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "API 服务" }),
            getStatusBadge(systemStatus.api)
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: systemStatus.api === "normal" ? "运行正常" : "请求延迟较高" })
        ] })
      ] }) })
    ] })
  ] });
}
function SystemSection({
  autoBackup,
  onAutoBackupChange
}) {
  const autoBackupId = useId();
  const autoUpdateId = useId();
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [backing, setBacking] = useState(false);
  const { toast } = useToast();
  const handleBackup = async () => {
    setBacking(true);
    try {
      const response = await fetch("/api/admin/system/backup", {
        method: "POST"
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "备份成功",
          description: result.message || "数据库已成功备份"
        });
      } else {
        toast({
          title: "备份失败",
          description: result.error || "数据库备份失败",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "备份失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setBacking(false);
    }
  };
  const handleSettingChange = async (setting, value) => {
    try {
      const response = await fetch("/api/admin/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting, value })
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "设置已更新",
          description: result.message
        });
      }
    } catch (error) {
      console.error("更新设置失败:", error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "系统设置" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "配置系统参数和功能选项" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Settings, { className: "h-5 w-5" }),
          "系统配置"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "管理系统核心设置" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: autoBackupId, className: "text-sm font-medium", children: "自动备份" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "每天自动备份数据库" })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: autoBackupId,
              checked: autoBackup,
              onCheckedChange: (checked) => {
                onAutoBackupChange(checked);
                handleSettingChange("autoBackup", checked);
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: autoUpdateId, className: "text-sm font-medium", children: "自动更新" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "自动检查并安装系统更新" })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: autoUpdateId,
              checked: autoUpdate,
              onCheckedChange: (checked) => {
                setAutoUpdate(checked);
                handleSettingChange("autoUpdate", checked);
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium", children: "数据库操作" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: "flex-1 gap-2",
                onClick: handleBackup,
                disabled: backing,
                children: [
                  /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
                  backing ? "备份中..." : "备份数据库"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "flex-1 gap-2", children: [
              /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
              "恢复数据库"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-transform duration-150 ease-in-out active:scale-98",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-transform duration-150 ease-in-out active:scale-95",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user"
  });
  const { toast } = useToast();
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.name,
        email: user.email,
        role: user.role === "管理员" ? "admin" : "user"
      });
    }
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        })
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "更新成功",
          description: "用户信息已更新"
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "更新失败",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "更新失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "编辑用户" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "修改用户的基本信息和权限" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "用户名" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "username",
              value: formData.username,
              onChange: (e) => setFormData({ ...formData, username: e.target.value }),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "邮箱" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              value: formData.email,
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "角色" }),
          /* @__PURE__ */ jsx(
            Tabs,
            {
              value: formData.role,
              onValueChange: (value) => setFormData({ ...formData, role: value }),
              children: /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
                /* @__PURE__ */ jsx(TabsTrigger, { value: "user", children: "普通用户" }),
                /* @__PURE__ */ jsx(TabsTrigger, { value: "admin", children: "管理员" })
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => onOpenChange(false),
            disabled: loading,
            children: "取消"
          }
        ),
        /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: loading, children: [
          loading && /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "保存"
        ] })
      ] })
    ] })
  ] }) });
}
function UserDetailDialog({
  user,
  open,
  onOpenChange
}) {
  if (!user) return null;
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "从未活跃";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("zh-CN");
    } catch {
      return "无效日期";
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "用户详情" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "查看用户的详细信息" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "h-8 w-8 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: user.name }),
            /* @__PURE__ */ jsx(Badge, { variant: user.role === "管理员" ? "default" : "secondary", children: user.role }),
            user.status === "banned" && /* @__PURE__ */ jsx(Badge, { className: "bg-red-500/10 text-red-500 border-red-500/20", children: "已封禁" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }),
            user.email
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium", children: "账户信息" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "注册时间：" }),
              /* @__PURE__ */ jsx("span", { children: user.joinDate })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "用户ID：" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-xs", children: user.id })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "最后活跃：" }),
              /* @__PURE__ */ jsx("span", { children: formatDateTime(user.lastActiveAt) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium", children: "使用统计" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-muted/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "对话数" }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: user.conversationCount })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-muted/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "消息数" }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: user.messageCount })
            ] }) })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function UsersSection({
  searchQuery,
  onSearchChange
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { toast } = useToast();
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter,
        page: page.toString(),
        pageSize: "10"
      });
      const response = await fetch(`/api/admin/users?${params}`);
      const result = await response.json();
      if (result.success) {
        setUsers(result.data.users);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } else {
        toast({
          title: "获取失败",
          description: result.error || "无法加载用户列表",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("获取用户列表失败:", error);
      toast({
        title: "获取失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [searchQuery, statusFilter, page]);
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
  };
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };
  const handleDeleteUser = async (userId) => {
    if (!confirm("确定要删除此用户吗？此操作无法撤销。")) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE"
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "删除成功",
          description: result.message
        });
        fetchUsers();
      } else {
        toast({
          title: "删除失败",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("删除用户失败:", error);
      toast({
        title: "删除失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "用户管理" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "管理和监控所有用户账户 (共 ",
          total,
          " 人)"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: "gap-2", children: [
        /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
        "导出用户"
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "搜索用户名、邮箱...",
            value: searchQuery,
            onChange: (e) => onSearchChange(e.target.value),
            className: "pl-10"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
        /* @__PURE__ */ jsxs(SelectTrigger, { className: "w-[180px]", children: [
          /* @__PURE__ */ jsx(Funnel, { className: "h-4 w-4 mr-2" }),
          /* @__PURE__ */ jsx(SelectValue, { placeholder: "筛选角色" })
        ] }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "全部用户" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "user", children: "普通用户" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "admin", children: "管理员" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" }),
        "用户列表"
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : users.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(Users, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "暂无用户数据" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: users.map((user) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-primary" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium", children: user.name }),
                    /* @__PURE__ */ jsx(
                      Badge,
                      {
                        variant: user.role === "管理员" ? "default" : "secondary",
                        className: "text-xs",
                        children: user.role
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: user.email }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                    "加入: ",
                    user.joinDate,
                    " | 对话: ",
                    user.conversationCount,
                    " | 消息: ",
                    user.messageCount
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    title: "查看详情",
                    onClick: () => handleViewUser(user),
                    children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    title: "编辑",
                    onClick: () => handleEditUser(user),
                    children: /* @__PURE__ */ jsx(SquarePen, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    title: "删除",
                    className: "text-red-500 hover:text-red-600 hover:bg-red-500/10",
                    onClick: () => handleDeleteUser(user.id),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ]
          },
          user.id
        )) }),
        totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6 pt-6 border-t", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "第 ",
            page,
            " 页，共 ",
            totalPages,
            " 页"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setPage((p) => Math.max(1, p - 1)),
                disabled: page === 1,
                children: [
                  /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
                  "上一页"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
                disabled: page === totalPages,
                children: [
                  "下一页",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
                ]
              }
            )
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      EditUserDialog,
      {
        user: selectedUser,
        open: editDialogOpen,
        onOpenChange: setEditDialogOpen,
        onSuccess: fetchUsers
      }
    ),
    /* @__PURE__ */ jsx(
      UserDetailDialog,
      {
        user: selectedUser,
        open: detailDialogOpen,
        onOpenChange: setDetailDialogOpen
      }
    )
  ] });
}
function AdminPageContent() {
  const navigate = useNavigate();
  const { user, initialized } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  useEffect(() => {
    const checkAdminAuth = async () => {
      if (!initialized) {
        return;
      }
      try {
        if (!user) {
          navigate({ to: "/auth/login" });
          return;
        }
        if (user.role !== "admin") {
          navigate({ to: "/" });
          return;
        }
        setLoading(false);
      } catch (error) {
        console.error("管理员权限检查失败:", error);
        navigate({ to: "/" });
      }
    };
    checkAdminAuth();
  }, [navigate, user, initialized]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-blue-600" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "验证管理员权限中..." })
    ] }) });
  }
  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return /* @__PURE__ */ jsx(OverviewSection, {});
      case "users":
        return /* @__PURE__ */ jsx(UsersSection, {});
      case "analytics":
        return /* @__PURE__ */ jsx(AnalyticsSection, {});
      case "system":
        return /* @__PURE__ */ jsx(SystemSection, {});
      default:
        return /* @__PURE__ */ jsx(OverviewSection, {});
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
    /* @__PURE__ */ jsx(
      AdminSidebar,
      {
        activeSection,
        onSectionChange: setActiveSection
      }
    ),
    /* @__PURE__ */ jsx("main", { className: "flex-1 p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
        /* @__PURE__ */ jsx(Shield, { className: "h-8 w-8 text-blue-600" }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "管理后台" })
      ] }),
      renderSection()
    ] }) })
  ] }) });
}
function AdminPage() {
  return /* @__PURE__ */ jsx(ProtectedRoute, { requireAdmin: true, children: /* @__PURE__ */ jsx(AdminPageContent, {}) });
}
export {
  AdminPage as component
};
