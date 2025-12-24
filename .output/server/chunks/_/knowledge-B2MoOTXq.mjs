import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useToast, a as cn } from "./router-CTkf14GH.mjs";
import { Link } from "@tanstack/react-router";
import { B as Button } from "./button-siVlPLhQ.mjs";
import { C as Card, d as CardContent, I as Input, a as CardHeader, b as CardTitle, c as CardDescription } from "./input-i-smxDMb.mjs";
import { B as Badge } from "./badge-DpDfgwC3.mjs";
import { K as KnowledgePagination, i as iconMap, f as formatNumber, b as backgroundColors } from "./KnowledgePagination-C4ANlTDY.mjs";
import { P as ProtectedRoute } from "./ProtectedRoute-B8Xm5GNi.mjs";
import { A as ArrowLeft } from "./arrow-left.mjs";
import { B as BookOpen } from "./book-open.mjs";
import { S as Search } from "./search.mjs";
import { L as LoaderCircle } from "./loader-circle.mjs";
import "@radix-ui/react-toast";
import "class-variance-authority";
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
import "@radix-ui/react-slot";
function KnowledgeSidebar({ total, currentCount }) {
  return /* @__PURE__ */ jsxs("div", { className: "w-64 border-r border-border/40 bg-muted/30 flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-border/40", children: /* @__PURE__ */ jsx(Link, { href: "/chat", children: /* @__PURE__ */ jsxs(
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
    /* @__PURE__ */ jsx("div", { className: "px-4 py-6", children: /* @__PURE__ */ jsxs("h1", { className: "text-xl font-semibold flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5" }),
      "知识库"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsx(Card, { className: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-sm", children: /* @__PURE__ */ jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "知识库总数" }),
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-foreground", children: total })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 text-primary" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-3 border-t border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "当前显示" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-lg text-foreground", children: currentCount })
      ] }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 pb-4" })
  ] });
}
function KnowledgeSearchBar({
  searchQuery,
  onSearchChange
}) {
  return /* @__PURE__ */ jsx("div", { className: "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "relative max-w-2xl", children: [
    /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
    /* @__PURE__ */ jsx(
      Input,
      {
        value: searchQuery,
        onChange: (e) => onSearchChange(e.target.value),
        placeholder: "搜索知识库名称或描述...",
        className: "pl-10 h-11 text-base"
      }
    )
  ] }) }) });
}
function KnowledgeCard({ knowledge, onClick }) {
  const cardContent = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl shrink-0", children: iconMap[knowledge.icon] || "📚" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold mb-1 line-clamp-2", children: knowledge.name }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-xs line-clamp-2", children: knowledge.description || "暂无描述" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "pt-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "文档数" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: knowledge.document_size })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "总字数" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: formatNumber(knowledge.word_num) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "分词数" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: formatNumber(knowledge.length) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs", children: [
          "ID: ",
          knowledge.id.slice(0, 8),
          "..."
        ] }),
        /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
          "向量模型 #",
          knowledge.embedding_id
        ] })
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsx(Link, { to: `/knowledge/${knowledge.id}`, children: /* @__PURE__ */ jsx(
    Card,
    {
      className: cn(
        "group hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer border-2",
        backgroundColors[knowledge.background] || "bg-muted/30"
      ),
      onClick,
      children: cardContent
    }
  ) });
}
function KnowledgeList({
  loading,
  knowledgeList,
  searchQuery,
  onKnowledgeClick
}) {
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [
      /* @__PURE__ */ jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "加载中..." })
    ] });
  }
  if (knowledgeList.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [
      /* @__PURE__ */ jsx(BookOpen, { className: "h-16 w-16 text-muted-foreground/50 mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-2", children: "暂无知识库" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: searchQuery ? "未找到匹配的知识库" : "您还没有创建知识库" })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4", children: knowledgeList.map((knowledge) => /* @__PURE__ */ jsx(
    KnowledgeCard,
    {
      knowledge,
      onClick: () => onKnowledgeClick(knowledge)
    },
    knowledge.id
  )) });
}
function KnowledgePageContent() {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedKnowledge, setSelectedKnowledge] = useState(null);
  const { toast } = useToast();
  const fetchKnowledgeList = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/knowledge?page=${page}&size=10`);
      const data = await response.json();
      if (response.ok && data.code === 200) {
        setKnowledgeList(data.data.list || []);
        setTotal(data.data.total || 0);
        console.log("✅ 成功获取知识库列表:", data.data);
      } else {
        toast({
          title: "获取失败",
          description: data.message || "获取知识库列表失败",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("获取知识库列表错误:", error);
      toast({
        title: "请求错误",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchKnowledgeList(currentPage);
  }, [currentPage]);
  const filteredKnowledgeList = knowledgeList.filter(
    (knowledge) => knowledge.name.toLowerCase().includes(searchQuery.toLowerCase()) || knowledge.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen bg-background", children: [
    /* @__PURE__ */ jsx(
      KnowledgeSidebar,
      {
        total,
        currentCount: filteredKnowledgeList.length
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        KnowledgeSearchBar,
        {
          searchQuery,
          onSearchChange: setSearchQuery
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsx(
        KnowledgeList,
        {
          loading,
          knowledgeList: filteredKnowledgeList,
          searchQuery,
          onKnowledgeClick: setSelectedKnowledge
        }
      ) }),
      !loading && /* @__PURE__ */ jsx(
        KnowledgePagination,
        {
          currentPage,
          total,
          pageSize: 10,
          onPageChange: setCurrentPage
        }
      )
    ] })
  ] });
}
function KnowledgePage() {
  return /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(KnowledgePageContent, {}) });
}
export {
  KnowledgePage as component
};
