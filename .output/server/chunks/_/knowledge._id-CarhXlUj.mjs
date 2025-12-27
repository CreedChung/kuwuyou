import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { c as createLucideIcon, u as useToast, X, a as cn } from "./router-BKp7vXSH.mjs";
import { B as Button } from "./button-Bu7Lw5As.mjs";
import { I as Input, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./input-0L70PBJF.mjs";
import { B as Badge } from "./badge-DN1syeeg.mjs";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-BMzenCj3.mjs";
import { K as KnowledgePagination, f as formatNumber } from "./KnowledgePagination-f6JcsSpH.mjs";
import { R as RefreshCw, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-cP7Fqz_n.mjs";
import { L as Label } from "./label-4Qley_ee.mjs";
import { P as Progress } from "./progress-Bwg5aDKk.mjs";
import { P as ProtectedRoute } from "./ProtectedRoute-DWGtRxT1.mjs";
import { A as ArrowLeft } from "./arrow-left.mjs";
import { L as LoaderCircle } from "./loader-circle.mjs";
import { F as FileText } from "./file-text.mjs";
import { U as Upload } from "./upload.mjs";
import { C as CircleAlert } from "./circle-alert.mjs";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "zustand";
import "zustand/middleware";
import "zod";
import "drizzle-orm/node-postgres";
import "pg";
import "drizzle-orm/pg-core";
import "drizzle-orm";
import "bcryptjs";
import "@radix-ui/react-slot";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dialog";
import "./react-icons.esm.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-progress";
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
const embeddingStatusMap = {
  0: { label: "待处理", color: "bg-gray-500" },
  1: { label: "处理中", color: "bg-blue-500" },
  2: { label: "已完成", color: "bg-green-500" },
  3: { label: "失败", color: "bg-red-500" }
};
const knowledgeTypeMap = {
  1: "智能切片",
  2: "自定义切片"
};
const removeFileExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return filename;
  }
  return filename.substring(0, lastDotIndex);
};
function DocumentCard({ document, onClick }) {
  const statusInfo = embeddingStatusMap[document.embedding_stat] || embeddingStatusMap[0];
  const hasError = document.embedding_stat === 3 && document.failInfo;
  const displayName = removeFileExtension(document.name || "未命名文档");
  const shouldShowStatus = document.embedding_stat === 2 || document.embedding_stat === 3;
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "group hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer h-full flex flex-col",
        hasError && "border-red-200 bg-red-50/30"
      ),
      onClick,
      children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsx(FileText, { className: "h-8 w-8 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold mb-1 line-clamp-2 break-all", children: displayName }) }),
                /* @__PURE__ */ jsx(TooltipContent, { side: "top", className: "max-w-md", children: /* @__PURE__ */ jsx("p", { className: "break-all", children: displayName }) })
              ] }),
              /* @__PURE__ */ jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(CardDescription, { className: "text-xs line-clamp-1 break-all", children: document.url || "无URL" }) }),
                /* @__PURE__ */ jsx(TooltipContent, { side: "bottom", className: "max-w-md", children: /* @__PURE__ */ jsx("p", { className: "break-all text-xs", children: document.url || "无URL" }) })
              ] })
            ] })
          ] }),
          shouldShowStatus && /* @__PURE__ */ jsx(
            Badge,
            {
              className: cn(
                "shrink-0",
                statusInfo.color,
                "text-white"
              ),
              children: statusInfo.label
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-0 flex-1 flex flex-col", children: [
          hasError && document.failInfo && /* @__PURE__ */ jsxs("div", { className: "mb-3 p-2 bg-red-100 border border-red-200 rounded-lg flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(CircleAlert, { className: "h-4 w-4 text-red-600 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-red-900 break-all", children: [
                "向量化失败 (代码: ",
                document.failInfo.embedding_code,
                ")"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-red-700 mt-1 break-all", children: document.failInfo.embedding_msg })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "字数" }),
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: formatNumber(document.word_num) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "长度" }),
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: formatNumber(document.length) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "切片字数" }),
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: document.sentence_size })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs truncate max-w-[120px]", children: [
                "ID: ",
                document.id.slice(0, 8),
                "..."
              ] }) }),
              /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsxs("p", { className: "text-xs", children: [
                "完整ID: ",
                document.id
              ] }) })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs shrink-0", children: knowledgeTypeMap[document.knowledge_type] || "未知类型" })
          ] })
        ] })
      ]
    }
  ) });
}
function DocumentList({
  loading,
  refreshing = false,
  documents,
  searchQuery,
  onDocumentClick
}) {
  if (loading && !refreshing) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [
      /* @__PURE__ */ jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "加载中..." })
    ] });
  }
  if (documents.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [
      /* @__PURE__ */ jsx(FileText, { className: "h-16 w-16 text-muted-foreground/50 mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-2", children: "暂无文档" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: searchQuery ? "未找到匹配的文档" : "该知识库还没有文档" })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4", children: documents.map((document) => /* @__PURE__ */ jsx(
    DocumentCard,
    {
      document,
      onClick: () => onDocumentClick?.(document)
    },
    document.id
  )) });
}
function UploadDocumentDialog({
  open,
  onOpenChange,
  knowledgeId,
  onUploadSuccess
}) {
  const { toast } = useToast();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "请选择文件",
        description: "请至少选择一个文件上传",
        variant: "destructive"
      });
      return;
    }
    try {
      setUploading(true);
      setProgress(0);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      const response = await fetch(`/api/knowledge/upload?id=${knowledgeId}`, {
        method: "POST",
        body: formData
      });
      clearInterval(progressInterval);
      setProgress(100);
      const data = await response.json();
      if (response.ok && data.code === 200) {
        const successCount = data.data?.successInfos?.length || 0;
        const failCount = data.data?.failedInfos?.length || 0;
        toast({
          title: "上传完成",
          description: `成功上传 ${successCount} 个文件${failCount > 0 ? `, ${failCount} 个文件失败` : ""}`
        });
        if (failCount > 0) {
          data.data.failedInfos.forEach((failInfo) => {
            console.error(`文件 ${failInfo.fileName} 上传失败: ${failInfo.failReason}`);
          });
        }
        if (successCount > 0) {
          toast({
            title: "正在解析文档",
            description: "文档上传成功，正在后台解析中，请稍等..."
          });
          setTimeout(() => {
            onUploadSuccess();
          }, 3e3);
          setTimeout(() => {
            handleClose();
          }, 5e3);
        } else {
          handleClose();
        }
      } else {
        toast({
          title: "上传失败",
          description: data.message || "上传文档失败",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("上传文档错误:", error);
      toast({
        title: "上传错误",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      setProgress(0);
      onOpenChange(false);
    }
  };
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[700px] max-h-[90vh] flex flex-col", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "上传文档" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "支持 txt, doc, pdf, docx, ppt, pptx, md, xls, xlsx, csv 等格式" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "选择文件" }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "file",
            multiple: true,
            onChange: handleFileChange,
            disabled: uploading,
            accept: ".txt,.doc,.pdf,.docx,.ppt,.pptx,.md,.xls,.xlsx,.csv"
          }
        ) })
      ] }),
      files.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs(Label, { children: [
            "已选文件 (",
            files.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "总大小: ",
            formatSize(totalSize)
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border rounded-lg divide-y max-h-[350px] overflow-y-auto", children: files.map((file, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors group",
            children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 flex-shrink-0 text-primary" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs(Tooltip, { children: [
                  /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate cursor-default", children: file.name }) }),
                  /* @__PURE__ */ jsx(TooltipContent, { side: "top", className: "max-w-md", children: /* @__PURE__ */ jsx("p", { className: "break-all", children: file.name }) })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatSize(file.size) })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  onClick: () => removeFile(index),
                  disabled: uploading,
                  className: "flex-shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              )
            ]
          },
          index
        )) })
      ] }),
      uploading && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { children: "上传进度" }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            progress,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx(Progress, { value: progress })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleClose, disabled: uploading, children: "取消" }),
      /* @__PURE__ */ jsx(Button, { onClick: handleUpload, disabled: uploading || files.length === 0, children: uploading ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        "上传中..."
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-4 w-4" }),
        "开始上传 (",
        files.length,
        ")"
      ] }) })
    ] })
  ] }) }) });
}
function KnowledgeDocumentsPage() {
  return /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(KnowledgeDocumentsContent, {}) });
}
function KnowledgeDocumentsContent() {
  const {
    id: knowledgeId
  } = useParams({
    from: "/knowledge/$id"
  });
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const fetchDocuments = async (page = 1, word = "", isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const params = new URLSearchParams({
        knowledge_id: knowledgeId,
        page: page.toString(),
        size: "20"
      });
      if (word) params.append("word", word);
      const response = await fetch(`/api/knowledge/documents?${params.toString()}`);
      const data = await response.json();
      if (response.ok && data.code === 200) {
        setDocuments(data.data.list || []);
        setTotal(data.data.total || 0);
      } else {
        toast({
          title: "获取失败",
          description: data.message || "获取文档列表失败",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "请求错误",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchDocuments(currentPage, searchQuery);
  }, [currentPage]);
  const handleSearch = () => {
    setCurrentPage(1);
    fetchDocuments(1, searchQuery, false);
  };
  const handleRefresh = () => {
    fetchDocuments(currentPage, searchQuery, true);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-border/40 bg-background/95 backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mb-4", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate({
          to: "/knowledge"
        }), className: "gap-2", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          "返回知识库列表"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Input, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSearch(), placeholder: "搜索文档名称...", className: "max-w-md" }),
            /* @__PURE__ */ jsx(Button, { onClick: handleSearch, children: "搜索" })
          ] }),
          /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "h-10 px-4", children: [
            "共 ",
            total,
            " 个文档"
          ] }),
          /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2", onClick: handleRefresh, disabled: refreshing, children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${refreshing ? "animate-spin" : ""}` }),
            "刷新"
          ] }),
          /* @__PURE__ */ jsxs(Button, { className: "gap-2", onClick: () => setUploadDialogOpen(true), children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "上传文档"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsx(DocumentList, { loading, refreshing, documents, searchQuery, onDocumentClick: (doc) => console.log("点击文档:", doc) }) }),
      !loading && /* @__PURE__ */ jsx(KnowledgePagination, { currentPage, total, pageSize: 20, onPageChange: setCurrentPage })
    ] }),
    /* @__PURE__ */ jsx(UploadDocumentDialog, { open: uploadDialogOpen, onOpenChange: setUploadDialogOpen, knowledgeId, onUploadSuccess: () => fetchDocuments(currentPage, searchQuery, true) })
  ] });
}
export {
  KnowledgeDocumentsPage as component
};
