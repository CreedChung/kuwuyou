import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { b as useAuthStore } from "./router-BKp7vXSH.mjs";
function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
  requireAdmin = false
}) {
  const router = useRouter();
  const { user, loading, initialized } = useAuthStore();
  useEffect(() => {
    if (!initialized || loading) {
      return;
    }
    if (!user) {
      router.navigate({ to: redirectTo });
      return;
    }
    if (requireAdmin && user.role !== "admin") {
      router.navigate({ to: "/chat" });
    }
  }, [user, loading, initialized, router, redirectTo, requireAdmin]);
  if (!initialized || loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "加载中..." })
    ] }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "正在跳转..." })
    ] }) });
  }
  if (requireAdmin && user.role !== "admin") {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "无权限访问" }) }) });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
export {
  ProtectedRoute as P
};
