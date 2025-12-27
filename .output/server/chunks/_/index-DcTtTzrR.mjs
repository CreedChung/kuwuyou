import { jsxs, jsx } from "react/jsx-runtime";
import { H as Header, F as Footer } from "./header-g4jUk6-W.mjs";
import { useRouter } from "@tanstack/react-router";
import { B as Badge } from "./badge-DN1syeeg.mjs";
import { B as Button } from "./button-Bu7Lw5As.mjs";
import { u as useAuth } from "./useAuth-D9grmhT4.mjs";
import { c as createLucideIcon } from "./router-BKp7vXSH.mjs";
import "react";
import "react-dom";
import "./react-icons.esm.mjs";
import "@radix-ui/react-navigation-menu";
import "class-variance-authority";
import "./brain.mjs";
import "./search.mjs";
import "./users.mjs";
import "./file-text.mjs";
import "./shield.mjs";
import "@radix-ui/react-slot";
import "@radix-ui/react-toast";
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
const __iconNode = [
  ["path", { d: "M18 8L22 12L18 16", key: "1r0oui" }],
  ["path", { d: "M2 12H22", key: "1m8cig" }]
];
const MoveRight = createLucideIcon("move-right", __iconNode);
function Hero() {
  const router = useRouter();
  const { user } = useAuth();
  const handleGetStarted = () => {
    if (user) {
      router.navigate({ to: "/chat" });
    } else {
      router.navigate({ to: "/auth/login" });
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full pb-10 lg:pb-20 bg-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 items-center", children: [
    /* @__PURE__ */ jsx("div", { className: " rounded-md w-80 md:w-96 overflow-hidden", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/logo.jpg",
        alt: "库无忧智能库存管理系统",
        className: "w-full h-auto object-contain"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 flex-col items-center text-center", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "正式上线！" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 flex-col items-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-5xl md:text-7xl max-w-3xl tracking-tighter font-regular text-black", children: "库无忧助手" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl leading-relaxed tracking-tight text-black max-w-2xl", children: '"库无忧助手"是一款专注于石化仓储工程建设、运营维护、检修升级提供全链路技术服务的石油化工行业专业智能体。 它通过深度学习现行法律法规、国家标准、行业标准及专业数据库知识，应用智能大模型为技术人员提供安全、 高效、专业的数据分析、判断辅助等专业智能体服务，助力企业创造显著的业务价值，提升企业经营效益。' })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-row gap-4", children: /* @__PURE__ */ jsxs(Button, { size: "lg", className: "gap-4", onClick: handleGetStarted, children: [
        "立即开始 ",
        /* @__PURE__ */ jsx(MoveRight, { className: "w-4 h-4" })
      ] }) })
    ] })
  ] }) }) });
}
function HeroDemo() {
  return /* @__PURE__ */ jsx("div", { className: "block", children: /* @__PURE__ */ jsx(Hero, {}) });
}
function HomePage() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col bg-gray-50", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(HeroDemo, {}) }),
    /* @__PURE__ */ jsx(Footer, { logo: /* @__PURE__ */ jsx("img", { src: "/logo.jpg", alt: "库无忧助手", className: "h-10 w-10 object-contain" }), brandName: "库无忧助手", socialLinks: [], mainLinks: [], legalLinks: [], copyright: {
      text: "© 2025 库无忧助手",
      license: "保留所有权利"
    } })
  ] });
}
export {
  HomePage as component
};
