import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Loader2, ArrowLeft, User, BarChart3, Trophy, Save, Mail, Calendar } from "lucide-react";
import { useId, useState, useEffect } from "react";
import { P as ProtectedRoute } from "./ProtectedRoute-BmaL0e_3.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-B_wi39t6.js";
import { B as Button } from "./button-BOe1jWOF.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, I as Input, c as CardDescription } from "./input-gpPefGgY.js";
import { L as Label } from "./label-D-UJjBuw.js";
import { u as useToast, a as useAuthStore, c as cn } from "./router-CXH_V1gJ.js";
import "@radix-ui/react-avatar";
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
async function getProfile() {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) {
      console.error("用户未登录");
      return null;
    }
    const { state } = JSON.parse(authStorage);
    const user = state.user;
    if (!user) {
      console.error("用户未登录");
      return null;
    }
    const response = await fetch("/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id
      }
    });
    if (!response.ok) {
      console.error("获取用户资料失败:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("获取用户资料错误:", error);
    return null;
  }
}
async function updateProfile(updates) {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) {
      return { success: false, error: "用户未登录" };
    }
    const { state } = JSON.parse(authStorage);
    const user = state.user;
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id
      },
      body: JSON.stringify(updates)
    });
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "更新失败" };
    }
    return { success: true };
  } catch (error) {
    console.error("更新用户资料错误:", error);
    return { success: false, error: "更新用户资料失败" };
  }
}
const sidebarItems = [{
  id: "basic",
  label: "基本信息",
  icon: User
}, {
  id: "stats",
  label: "使用统计",
  icon: BarChart3
}, {
  id: "achievements",
  label: "成就徽章",
  icon: Trophy
}];
function ProfilePage() {
  return /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(ProfilePageContent, {}) });
}
function ProfilePageContent() {
  const usernameId = useId();
  const emailId = useId();
  const {
    toast
  } = useToast();
  const {
    user,
    initialized,
    initialize
  } = useAuthStore();
  const [activeSection, setActiveSection] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    id: "",
    username: "用户",
    email: "user@example.com",
    joinDate: "2024-01-01"
  });
  const [stats, setStats] = useState({
    conversationCount: 0,
    messageCount: 0,
    activeDays: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [editedProfile, setEditedProfile] = useState(profile);
  useEffect(() => {
    if (!initialized) initialize();
  }, [initialized, initialize]);
  useEffect(() => {
    const loadProfile = async () => {
      if (!initialized) return;
      setLoading(true);
      const data = await getProfile();
      if (data) {
        setProfile(data.profile);
        setEditedProfile(data.profile);
        setStats(data.stats);
        setAchievements(data.achievements);
      }
      setLoading(false);
    };
    loadProfile();
  }, [user, initialized]);
  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({
      username: editedProfile.username
    });
    if (result.success) {
      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "保存成功",
        description: "您的资料已更新"
      });
    } else {
      toast({
        title: "保存失败",
        description: result.error || "更新资料失败",
        variant: "destructive"
      });
    }
    setSaving(false);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-64 border-r border-border/40 bg-muted/30 flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-border/40", children: /* @__PURE__ */ jsx(Link, { to: "/chat", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "w-full justify-start gap-2 hover:bg-muted", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: "返回聊天" })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "px-4 py-6", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold", children: "个人资料" }) }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 px-2 pb-4 space-y-1 overflow-y-auto", children: sidebarItems.map((item) => {
        const Icon = item.icon;
        return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveSection(item.id), className: cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", activeSection === item.id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"), children: [
          /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: item.label })
        ] }, item.id);
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto p-8", children: [
      activeSection === "basic" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "基本信息" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "管理你的个人资料" })
          ] }),
          !isEditing ? /* @__PURE__ */ jsx(Button, { onClick: () => setIsEditing(true), variant: "outline", children: "编辑资料" }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Button, { onClick: () => {
              setEditedProfile(profile);
              setIsEditing(false);
            }, variant: "outline", size: "sm", disabled: saving, children: "取消" }),
            /* @__PURE__ */ jsxs(Button, { onClick: handleSave, size: "sm", disabled: saving, children: [
              saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
              saving ? "保存中..." : "保存"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(User, { className: "h-5 w-5" }),
            "个人资料"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsx(Avatar, { className: "h-20 w-20 border-4 border-primary/20", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "text-2xl bg-gradient-to-br from-primary to-primary/60", children: profile.username.charAt(0).toUpperCase() }) }),
            !isEditing ? /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-muted/50 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "用户名" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: profile.username })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" }),
                  "邮箱"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: profile.email })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
                  "加入日期"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: profile.joinDate })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: usernameId, children: "用户名" }),
                /* @__PURE__ */ jsx(Input, { id: usernameId, value: editedProfile.username, onChange: (e) => setEditedProfile({
                  ...editedProfile,
                  username: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: emailId, children: "邮箱" }),
                /* @__PURE__ */ jsx(Input, { id: emailId, value: editedProfile.email, disabled: true, className: "bg-muted" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      activeSection === "stats" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "使用统计" }) }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5" }),
            "统计数据"
          ] }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center p-6 rounded-lg bg-primary/5 border border-primary/10", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-primary", children: stats.conversationCount }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mt-2", children: "对话数" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-6 rounded-lg bg-primary/5 border border-primary/10", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-primary", children: stats.messageCount }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mt-2", children: "消息数" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-6 rounded-lg bg-primary/5 border border-primary/10", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-primary", children: stats.activeDays }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mt-2", children: "使用天数" })
            ] })
          ] }) })
        ] })
      ] }),
      activeSection === "achievements" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "成就徽章" }) }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Trophy, { className: "h-5 w-5" }),
              "我的成就"
            ] }),
            /* @__PURE__ */ jsxs(CardDescription, { children: [
              "已解锁 ",
              achievements.length,
              " 个成就"
            ] })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: achievements.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: achievements.map((a) => /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-muted/50 border flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl", children: a.icon }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: a.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: a.description })
            ] })
          ] }, a.id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(Trophy, { className: "h-12 w-12 text-muted-foreground/50 mx-auto mb-4" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "暂无成就" })
          ] }) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ProfilePage as component
};
