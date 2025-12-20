import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { B as Button } from "./button-BOe1jWOF.js";
import { MessageCircle, Calculator, BarChart, Brain, Search, CodeIcon, Users, FileText, Shield } from "lucide-react";
import * as React from "react";
import React__default from "react";
import { createPortal } from "react-dom";
import { c as cn } from "./router-CXH_V1gJ.js";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
function Footer({
  logo,
  brandName,
  socialLinks,
  legalLinks,
  copyright
}) {
  return /* @__PURE__ */ jsx("footer", { className: "pb-6 pt-16 lg:pb-8 lg:pt-24 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "px-4 lg:px-8", children: [
    /* @__PURE__ */ jsx("div", { className: "md:flex md:items-start md:justify-between", children: /* @__PURE__ */ jsx("ul", { className: "flex list-none mt-6 md:mt-0 space-x-3", children: socialLinks.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "secondary",
        size: "icon",
        className: "h-10 w-10 rounded-full",
        asChild: true,
        children: /* @__PURE__ */ jsx(Link, { to: link.href, target: "_blank", "aria-label": link.label, children: link.icon })
      }
    ) }, `social-${link.href}-${link.label}`)) }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t mt-6 pt-6 md:mt-4 md:pt-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        logo,
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-black", children: brandName })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [
        legalLinks.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: legalLinks.map((link, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: link.href,
                  className: "hover:text-foreground transition-colors",
                  children: link.label
                }
              ),
              index < legalLinks.length - 1 && /* @__PURE__ */ jsx("span", { children: "·" })
            ]
          },
          `legal-${link.href}`
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "whitespace-nowrap text-black", children: [
          /* @__PURE__ */ jsx("div", { className: "text-black", children: copyright.text }),
          copyright.license && /* @__PURE__ */ jsx("div", { className: "text-black", children: copyright.license })
        ] })
      ] })
    ] }) })
  ] }) });
}
function MenuToggleIcon({
  open,
  className,
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2.5,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  duration = 500,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      strokeWidth,
      fill,
      stroke,
      viewBox: "0 0 32 32",
      strokeLinecap,
      strokeLinejoin,
      className: cn(
        "transition-transform ease-in-out",
        open && "-rotate-45",
        className
      ),
      style: {
        transitionDuration: `${duration}ms`
      },
      "aria-label": "菜单图标",
      ...props,
      children: [
        /* @__PURE__ */ jsx("title", { children: "菜单" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            className: cn(
              "transition-all ease-in-out",
              open ? "[stroke-dasharray:20_300] [stroke-dashoffset:-32.42px]" : "[stroke-dasharray:12_63]"
            ),
            style: {
              transitionDuration: `${duration}ms`
            },
            d: "M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
          }
        ),
        /* @__PURE__ */ jsx("path", { d: "M7 16 27 16" })
      ]
    }
  );
}
const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Root,
  {
    ref,
    className: cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(NavigationMenuViewport, {})
    ]
  }
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.List,
  {
    ref,
    className: cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    ),
    ...props
  }
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 active:scale-95"
);
const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Trigger,
  {
    ref,
    className: cn(navigationMenuTriggerStyle(), "group", className),
    ...props,
    children: [
      children,
      " ",
      /* @__PURE__ */ jsx(
        ChevronDownIcon,
        {
          className: "relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        }
      )
    ]
  }
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Content,
  {
    ref,
    className: cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    ),
    ...props
  }
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
const NavigationMenuLink = NavigationMenuPrimitive.Link;
const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: cn("absolute left-0 top-full flex justify-center"), children: /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Viewport,
  {
    className: cn(
      "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
      className
    ),
    ref,
    ...props
  }
) }));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;
const NavigationMenuIndicator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Indicator,
  {
    ref,
    className: cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" })
  }
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;
function Header() {
  const [open, setOpen] = React__default.useState(false);
  const scrolled = useScroll(10);
  const mobileMenuId = "mobile-menu";
  React__default.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: cn("sticky top-0 z-50 w-full border-b border-transparent", {
        "bg-background/95 supports-backdrop-filter:bg-background/50 border-border backdrop-blur-lg": scrolled
      }),
      children: [
        /* @__PURE__ */ jsxs("nav", { className: "mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
            /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo.jpg",
                alt: "库无忧助手",
                className: "h-8 object-contain cursor-pointer hover:opacity-80 transition-opacity"
              }
            ) }),
            /* @__PURE__ */ jsx(NavigationMenu, { className: "hidden md:flex", children: /* @__PURE__ */ jsxs(NavigationMenuList, { children: [
              /* @__PURE__ */ jsxs(NavigationMenuItem, { children: [
                /* @__PURE__ */ jsx(NavigationMenuTrigger, { className: "bg-transparent", children: "产品" }),
                /* @__PURE__ */ jsx(NavigationMenuContent, { className: "bg-background p-1 pr-1.5", children: /* @__PURE__ */ jsx("ul", { className: "bg-popover grid w-lg grid-cols-2 gap-2 rounded-md border p-2 shadow", children: productLinks.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(ListItem, { ...item }) }, item.title)) }) })
              ] }),
              /* @__PURE__ */ jsxs(NavigationMenuItem, { children: [
                /* @__PURE__ */ jsx(NavigationMenuTrigger, { className: "bg-transparent", children: "关于" }),
                /* @__PURE__ */ jsx(NavigationMenuContent, { className: "bg-background p-1 pr-1.5 pb-1.5", children: /* @__PURE__ */ jsxs("div", { className: "grid w-lg grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsx("ul", { className: "bg-popover space-y-2 rounded-md border p-2 shadow", children: companyLinks.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(ListItem, { ...item }) }, item.title)) }),
                  /* @__PURE__ */ jsx("ul", { className: "space-y-2 p-3", children: companyLinks2.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                    NavigationMenuLink,
                    {
                      href: item.href,
                      className: "flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2",
                      children: [
                        /* @__PURE__ */ jsx(item.icon, { className: "text-foreground size-4" }),
                        /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.title })
                      ]
                    }
                  ) }, item.title)) })
                ] }) })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden items-center gap-2 md:flex", children: /* @__PURE__ */ jsx(Button, { children: "开始使用" }) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "icon",
              variant: "outline",
              onClick: () => setOpen(!open),
              className: "md:hidden",
              "aria-expanded": open,
              "aria-controls": mobileMenuId,
              "aria-label": "切换菜单",
              children: /* @__PURE__ */ jsx(MenuToggleIcon, { open, className: "size-5", duration: 300 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          MobileMenu,
          {
            id: mobileMenuId,
            open,
            className: "flex flex-col justify-between gap-2 overflow-y-auto",
            children: [
              /* @__PURE__ */ jsx(NavigationMenu, { className: "max-w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-y-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "产品" }),
                productLinks.map((link) => /* @__PURE__ */ jsx(ListItem, { ...link }, link.title)),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "关于" }),
                companyLinks.map((link) => /* @__PURE__ */ jsx(ListItem, { ...link }, link.title)),
                companyLinks2.map((link) => /* @__PURE__ */ jsx(ListItem, { ...link }, link.title))
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsx(Button, { className: "w-full", children: "开始使用" }) })
            ]
          }
        )
      ]
    }
  );
}
function MobileMenu({ id, open, children, className, ...props }) {
  const [isClient, setIsClient] = React__default.useState(false);
  React__default.useEffect(() => {
    setIsClient(true);
  }, []);
  if (!open || !isClient) return null;
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        id,
        className: cn(
          "bg-background/95 supports-backdrop-filter:bg-background/50 backdrop-blur-lg",
          "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden"
        ),
        children: /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": open ? "open" : "closed",
            className: cn(
              "data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
              "size-full p-4",
              className
            ),
            ...props,
            children
          }
        )
      }
    ),
    document.body
  );
}
function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    NavigationMenuLink,
    {
      className: cn(
        "w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm p-2",
        className
      ),
      ...props,
      asChild: true,
      children: /* @__PURE__ */ jsxs(Link, { to: href, children: [
        /* @__PURE__ */ jsx("div", { className: "bg-background/40 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm", children: /* @__PURE__ */ jsx(Icon, { className: "text-foreground size-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-center", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: title }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs", children: description })
        ] })
      ] })
    }
  );
}
const productLinks = [
  {
    title: "无忧问答",
    href: "#",
    description: "智能问答系统",
    icon: MessageCircle
  },
  {
    title: "无忧计算",
    href: "#",
    description: "强大的计算能力",
    icon: Calculator
  },
  {
    title: "无忧分析",
    href: "#",
    description: "深度数据分析",
    icon: BarChart
  },
  {
    title: "无忧思考",
    href: "#",
    description: "智能思维辅助",
    icon: Brain
  },
  {
    title: "无忧搜索",
    href: "#",
    description: "精准信息检索",
    icon: Search
  },
  {
    title: "API",
    href: "#",
    description: "使用我们的 API 构建自定义集成",
    icon: CodeIcon
  }
];
const companyLinks = [
  {
    title: "关于我们",
    href: "#",
    description: "了解更多关于我们的故事和团队",
    icon: Users
  }
];
const companyLinks2 = [
  {
    title: "服务条款",
    href: "/terms",
    icon: FileText
  },
  {
    title: "隐私政策",
    href: "/privacy",
    icon: Shield
  }
];
function useScroll(threshold) {
  const [scrolled, setScrolled] = React__default.useState(false);
  const [isClient, setIsClient] = React__default.useState(false);
  React__default.useEffect(() => {
    setIsClient(true);
  }, []);
  const onScroll = React__default.useCallback(() => {
    if (isClient) {
      setScrolled(window.scrollY > threshold);
    }
  }, [threshold, isClient]);
  React__default.useEffect(() => {
    if (!isClient) return;
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll, isClient]);
  React__default.useEffect(() => {
    if (isClient) {
      onScroll();
    }
  }, [onScroll, isClient]);
  return scrolled;
}
export {
  Footer as F,
  Header as H
};
