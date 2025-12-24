import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useCallback, memo, useRef } from "react";
import { useNavigate, useLocation, useRouter } from "@tanstack/react-router";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { B as Button } from "./button-siVlPLhQ.mjs";
import { C as Card } from "./input-i-smxDMb.mjs";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { c as createLucideIcon, d as chatSystemPrompt, a as cn, X } from "./router-CTkf14GH.mjs";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-BzbQONUD.mjs";
import { AnimatePresence, motion } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Streamdown } from "streamdown";
import { u as useAuth } from "./useAuth-BGX1kSaY.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-DacAq6LT.mjs";
import { M as MagnifyingGlassIcon } from "./react-icons.esm.mjs";
import { Command as Command$1 } from "cmdk";
import { A as Avatar, a as AvatarFallback } from "./avatar-BYdhSk81.mjs";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { generateText, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import Joyride, { STATUS } from "react-joyride";
import { h as hasTutorialCompleted, S as Sun, m as markTutorialCompleted, a as Send } from "./tutorialManager-Dl7d-snb.mjs";
import { P as ProtectedRoute } from "./ProtectedRoute-B8Xm5GNi.mjs";
import { C as ChevronLeft, T as Trash2, a as ChevronRight, M as MessageSquare, b as Clock, c as ChevronUp, d as ChevronDown, G as Globe, R as RefreshCw } from "./trash-2.mjs";
import { S as Search } from "./search.mjs";
import { B as BookOpen } from "./book-open.mjs";
import { S as Settings } from "./settings.mjs";
import { U as User } from "./user.mjs";
import { C as CircleAlert } from "./circle-alert.mjs";
import { L as LoaderCircle } from "./loader-circle.mjs";
import { F as FileText } from "./file-text.mjs";
import { B as Brain } from "./brain.mjs";
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
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
const __iconNode$9 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$9);
const __iconNode$8 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$8);
const __iconNode$7 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$7);
const __iconNode$6 = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode$6);
const __iconNode$5 = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ],
  ["path", { d: "M12 8v6", key: "1ib9pf" }],
  ["path", { d: "M9 11h6", key: "1fldmi" }]
];
const MessageSquarePlus = createLucideIcon("message-square-plus", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33", key: "1gzdoj" }],
  ["path", { d: "M16.95 16.95A7 7 0 0 1 5 12v-2", key: "cqa7eg" }],
  ["path", { d: "M18.89 13.23A7 7 0 0 0 19 12v-2", key: "16hl24" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12", key: "r2i35w" }]
];
const MicOff = createLucideIcon("mic-off", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
];
const Mic = createLucideIcon("mic", __iconNode$3);
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }]
];
const PanelLeft = createLucideIcon("panel-left", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      key: "1miecu"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$1);
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
];
const Square = createLucideIcon("square", __iconNode);
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
const MOBILE_BREAKPOINT = 768;
function useMobile() {
  const [isMobile, setIsMobile] = React.useState(
    void 0
  );
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
function setSidebarCookie(name, value, maxAge) {
  const cookieString = `${name}=${value}; path=/; max-age=${maxAge}`;
  document.cookie = cookieString;
}
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      setSidebarCookie(SIDEBAR_COOKIE_NAME, String(openState), SIDEBAR_COOKIE_MAX_AGE);
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        className
      ),
      ...props,
      children
    }
  ) }) });
}
function Sidebar$1({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-slot": "sidebar",
        className: cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxs(
      SheetContent,
      {
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: [
          /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group peer text-sidebar-foreground hidden md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: cn(
              "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-container",
            className: cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
                children
              }
            )
          }
        )
      ]
    }
  );
}
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      className: cn("size-7", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(PanelLeft, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function SidebarInset({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: cn(
        "bg-blue-500 relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      ),
      ...props
    }
  );
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
}
function SidebarGroupContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className),
      ...props
    }
  );
}
function SidebarMenu({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-1", className),
      ...props
    }
  );
}
function SidebarMenuItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  );
}
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props
    }
  );
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(
      TooltipContent,
      {
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile,
        ...tooltip
      }
    )
  ] });
}
function useSpeechInput({
  onTranscriptChange,
  language = "zh-CN",
  continuous = true
} = {}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();
  useEffect(() => {
    if (transcript && onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);
  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      throw new Error("浏览器不支持语音识别");
    }
    if (!isMicrophoneAvailable) {
      throw new Error("无法访问麦克风");
    }
    resetTranscript();
    SpeechRecognition.startListening({
      continuous,
      language
    });
  };
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };
  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };
  return {
    transcript,
    listening,
    resetTranscript,
    startListening,
    stopListening,
    toggleListening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  };
}
function truncateText(text, maxLength = 5e3) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength);
}
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
const PLACEHOLDERS = [
  "储罐保温涂层施工要求...",
  "如何选择合适的防腐材料...",
  "储罐维修检测项目有哪些...",
  "保温层破损如何修复...",
  "防腐涂层的使用寿命...",
  "储罐底板防腐处理方案..."
];
function InputArea({
  onSendMessage,
  isGenerating = false,
  onStopGenerating
}) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [thinkActive, setThinkActive] = useState(true);
  const [deepSearchActive, setDeepSearchActive] = useState(true);
  const [webSearchActive, setWebSearchActive] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const {
    listening,
    resetTranscript,
    toggleListening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechInput({
    onTranscriptChange: (text) => {
      setInputValue(text);
      setIsActive(true);
    },
    language: "zh-CN",
    continuous: true
  });
  useEffect(() => {
    if (isActive || inputValue) return;
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3e3);
    return () => clearInterval(interval);
  }, [isActive, inputValue]);
  const handleClickOutside = useCallback((event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      if (!inputValue) setIsActive(false);
    }
  }, [inputValue]);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);
  const handleActivate = useCallback(() => setIsActive(true), []);
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!inputValue.trim() && !uploadedFile || isGenerating || isSending) return;
    setIsSending(true);
    let parsedContent = fileContent;
    if (uploadedFile && !fileContent) {
      setIsProcessingFile(true);
      try {
        const fileData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(uploadedFile);
        });
        const response = await fetch("/api/file-parser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: uploadedFile.name,
            fileData,
            fileType: uploadedFile.name.split(".").pop()
          })
        });
        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch {
          console.error("服务器返回非JSON:", text);
          throw new Error("服务器错误，请稍后重试");
        }
        if (!response.ok) {
          throw new Error(result.error || "文件解析失败");
        }
        parsedContent = truncateText(result.content, 5e3);
      } catch (error) {
        console.error("文件处理失败:", error);
        alert(error instanceof Error ? error.message : "文件处理失败");
        setIsProcessingFile(false);
        setIsSending(false);
        return;
      }
      setIsProcessingFile(false);
    }
    onSendMessage(inputValue.trim(), {
      showThinking: thinkActive,
      showReferences: deepSearchActive,
      useWebSearch: webSearchActive,
      uploadedFile: uploadedFile || void 0,
      fileContent: parsedContent || void 0
    });
    setInputValue("");
    setUploadedFile(null);
    setFileContent("");
    setIsSending(false);
    resetTranscript();
  }, [inputValue, isGenerating, isSending, thinkActive, deepSearchActive, webSearchActive, uploadedFile, fileContent, onSendMessage, resetTranscript]);
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      alert("文件大小不能超过100MB");
      return;
    }
    setUploadedFile(file);
    setFileContent("");
    setIsActive(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);
  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setFileContent("");
  }, []);
  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const handleVoiceInput = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      alert(
        "您的浏览器不支持语音识别功能。请使用 Chrome、Edge 或 Safari 浏览器。"
      );
      return;
    }
    if (!isMicrophoneAvailable) {
      alert("无法访问麦克风。请检查浏览器权限设置。");
      return;
    }
    try {
      if (!listening) {
        setInputValue("");
      }
      toggleListening();
    } catch (error) {
      alert(error instanceof Error ? error.message : "启动语音识别失败");
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable, listening, toggleListening]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);
  const containerVariants = {
    default: {
      height: 68,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      transition: { type: "spring", stiffness: 120, damping: 18 }
    },
    focused: {
      height: 68,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      transition: { type: "spring", stiffness: 120, damping: 18 }
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "border-t border-border bg-background", "data-tutorial": "input-area", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-4 py-6", children: [
    /* @__PURE__ */ jsx(AnimatePresence, { children: uploadedFile && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 },
        className: "mb-3",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-muted/50 px-4 py-3 rounded-2xl border border-border shadow-sm", children: [
          /* @__PURE__ */ jsx(Paperclip, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: uploadedFile.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: formatFileSize(uploadedFile.size) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleRemoveFile,
              className: "p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0",
              title: "移除文件",
              children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
            }
          )
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        ref: wrapperRef,
        className: "w-full",
        variants: containerVariants,
        animate: isActive || inputValue ? "focused" : "default",
        initial: "default",
        style: {
          overflow: "hidden",
          borderRadius: 32,
          background: "hsl(var(--background))"
        },
        onClick: handleActivate,
        children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 rounded-full bg-background w-full", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: ".txt,.md,.doc,.docx,.pdf",
              onChange: handleFileUpload,
              className: "hidden",
              disabled: isGenerating || isProcessingFile
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `p-3 rounded-full hover:bg-accent transition ${isProcessingFile ? "opacity-50 cursor-not-allowed" : ""} ${uploadedFile ? "text-primary" : ""}`,
              title: "附加文件",
              type: "button",
              tabIndex: -1,
              onClick: handleFileButtonClick,
              disabled: isGenerating || isProcessingFile,
              "data-tutorial": "file-upload",
              children: /* @__PURE__ */ jsx(Paperclip, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                onKeyDown: handleKeyDown,
                className: "flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal text-foreground",
                style: { position: "relative", zIndex: 1 },
                onFocus: handleActivate,
                disabled: isGenerating
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: showPlaceholder && !isActive && !inputValue && /* @__PURE__ */ jsx(
              motion.span,
              {
                className: "absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none",
                style: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  zIndex: 0
                },
                initial: { opacity: 0, y: 5 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -5 },
                transition: { duration: 0.3 },
                children: PLACEHOLDERS[placeholderIndex]
              },
              placeholderIndex
            ) }) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `p-3 rounded-full transition ${listening ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : "hover:bg-accent"}`,
              title: listening ? "停止录音" : "语音输入",
              type: "button",
              tabIndex: -1,
              onClick: handleVoiceInput,
              disabled: isGenerating,
              "data-tutorial": "voice-input",
              children: listening ? /* @__PURE__ */ jsx(MicOff, { size: 20 }) : /* @__PURE__ */ jsx(Mic, { size: 20 })
            }
          ),
          isGenerating ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onStopGenerating,
              className: "flex items-center gap-1 bg-destructive hover:bg-destructive/90 text-white p-3 rounded-full font-medium justify-center",
              title: "停止生成",
              children: /* @__PURE__ */ jsx(Square, { size: 18, className: "text-white" })
            }
          ) : /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: !inputValue.trim() && !uploadedFile || isGenerating || isProcessingFile || isSending,
              className: "flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full font-medium justify-center disabled:opacity-40 disabled:cursor-not-allowed",
              title: "发送",
              children: /* @__PURE__ */ jsx(Send, { size: 18 })
            }
          )
        ] }) })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setWebSearchActive(!webSearchActive),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${webSearchActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
          title: webSearchActive ? "关闭联网搜索" : "开启联网搜索",
          "data-tutorial": "web-search",
          children: [
            /* @__PURE__ */ jsx(Globe, { size: 14 }),
            /* @__PURE__ */ jsx("span", { children: "联网搜索" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setDeepSearchActive(!deepSearchActive),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${deepSearchActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
          title: deepSearchActive ? "关闭知识库检索" : "开启知识库检索",
          "data-tutorial": "knowledge-search",
          children: [
            /* @__PURE__ */ jsx(BookOpen, { size: 14 }),
            /* @__PURE__ */ jsx("span", { children: "知识库" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setThinkActive(!thinkActive),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${thinkActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
          title: thinkActive ? "关闭深度思考" : "开启深度思考",
          "data-tutorial": "deep-thinking",
          children: [
            /* @__PURE__ */ jsx(Brain, { size: 14 }),
            /* @__PURE__ */ jsx("span", { children: "深度思考" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 flex items-center justify-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "库无忧助手可能会出错。请核查重要信息。" }) })
  ] }) });
}
function AnalysisResult({ results }) {
  if (!results || results.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
      /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxs("span", { children: [
        "规范检查结果 (",
        results.length,
        " 项)"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: results.map((item, index) => /* @__PURE__ */ jsxs(Card, { className: "p-4 space-y-3 border-l-4 border-l-orange-500", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(CircleAlert, { className: "h-4 w-4 text-orange-500 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-orange-600 dark:text-orange-400", children: "原句" })
          ] }),
          item.location && /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800", children: [
            "位置: ",
            item.location
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm bg-orange-50 dark:bg-orange-950/30 p-2 rounded border border-orange-200 dark:border-orange-800", children: item.origin })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-blue-500 flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-blue-600 dark:text-blue-400", children: "依据" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm bg-blue-50 dark:bg-blue-950/30 p-2 rounded border border-blue-200 dark:border-blue-800", children: item.reason })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CircleAlert, { className: "h-4 w-4 text-red-500 flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-red-600 dark:text-red-400", children: "问题描述" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-800", children: item.issueDes })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Lightbulb, { className: "h-4 w-4 text-green-500 flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-green-600 dark:text-green-400", children: "修改建议" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm bg-green-50 dark:bg-green-950/30 p-2 rounded border border-green-200 dark:border-green-800", children: item.suggestion })
      ] })
    ] }, index)) })
  ] });
}
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
    if (days === 0) {
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1e3 * 60));
        if (minutes === 0) {
          return "刚刚";
        }
        return `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    }
    if (days === 1) {
      return "昨天";
    }
    if (days < 7) {
      return `${days}天前`;
    }
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  } catch {
    return dateString;
  }
}
function Message({ message, onRegenerate }) {
  const { user } = useAuth();
  const isUser = message.role === "user";
  const hasError = !!message.error;
  const isStreaming = message.isStreaming;
  const isLoading = message.isLoading && !message.content;
  const [showThinking, setShowThinking] = useState(true);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [showWebSearch, setShowWebSearch] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const userName = user?.username || user?.email || "用户";
  const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;
  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2e3);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };
  const knowledgeRefs = message.references?.filter((ref) => ref.type === "knowledge") || [];
  const webRefs = message.references?.filter((ref) => ref.type === "web_search") || [];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex gap-4 px-6 py-8 ${isUser ? "bg-background" : "bg-muted/20"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: isUser ? /* @__PURE__ */ jsx(
          "img",
          {
            src: userAvatar,
            alt: userName,
            className: "h-9 w-9 rounded-lg object-cover"
          }
        ) : /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-9 w-9 rounded-lg flex items-center justify-center overflow-hidden ${hasError ? "bg-gradient-to-br from-red-500 to-orange-500 text-white" : "bg-white"}`,
            children: hasError ? /* @__PURE__ */ jsx(CircleAlert, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo.jpg",
                alt: "库无忧助手",
                className: "w-9 h-9 object-cover rounded-full"
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm text-foreground", children: isUser ? "你" : "库无忧助手" }),
            isLoading && !isUser && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
              /* @__PURE__ */ jsx("span", { children: "正在准备回答..." })
            ] }),
            isStreaming && !isUser && !message.content && !message.thinking && knowledgeRefs.length === 0 && webRefs.length === 0 && !isLoading && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
              /* @__PURE__ */ jsx("span", { children: "正在无忧思考..." })
            ] })
          ] }),
          hasError ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-destructive/50 bg-destructive/10 p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(CircleAlert, { className: "h-4 w-4 text-destructive flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 text-sm text-destructive", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium mb-1", children: "发生错误" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs opacity-90", children: message.error })
            ] })
          ] }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            isUser && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              message.uploadedFileName && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border", children: [
                /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "已上传: ",
                  message.uploadedFileName
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
                /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-none dark:prose-invert", children: /* @__PURE__ */ jsx(Streamdown, { children: message.content }) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "absolute -top-2 -right-2 h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity",
                    onClick: () => copyToClipboard(message.content, "user-message"),
                    children: copiedSection === "user-message" ? /* @__PURE__ */ jsx(CheckCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] }),
            !isUser && knowledgeRefs.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-blue-900 dark:text-blue-100", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setShowKnowledge(!showKnowledge),
                    className: "flex items-center gap-2 hover:opacity-80 transition-opacity",
                    children: [
                      /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "查找到 ",
                        knowledgeRefs.length,
                        " 个知识片段"
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "h-6 px-2",
                      onClick: (e) => {
                        e.stopPropagation();
                        const refText = knowledgeRefs.map((ref, i) => `[${i + 1}] ${ref.source ? `文件：${ref.source}
` : ""}${ref.content}`).join("\n\n");
                        copyToClipboard(refText, "knowledge");
                      },
                      children: copiedSection === "knowledge" ? /* @__PURE__ */ jsx(CheckCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowKnowledge(!showKnowledge),
                      className: "hover:opacity-80 transition-opacity",
                      children: showKnowledge ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              showKnowledge && /* @__PURE__ */ jsxs("div", { className: "px-4 pb-3 space-y-3", children: [
                (() => {
                  const uniqueSources = Array.from(
                    new Set(knowledgeRefs.map((ref) => ref.source).filter(Boolean))
                  );
                  return uniqueSources.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-blue-700 dark:text-blue-300 mb-1", children: "📁 查找的文件：" }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: uniqueSources.map((source, idx) => /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200",
                        children: source?.replace(/\.[^/.]+$/, "") || source
                      },
                      idx
                    )) })
                  ] });
                })(),
                knowledgeRefs.map((ref, index) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "text-sm p-3 rounded border bg-white/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-600 text-white text-xs flex items-center justify-center font-medium", children: index + 1 }),
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1 flex-wrap", children: [
                            /* @__PURE__ */ jsx("div", { className: "font-medium text-xs text-blue-600 dark:text-blue-400 truncate", children: ref.source ? ref.source.replace(/\.[^/.]+$/, "") : "知识库" }),
                            ref.score !== void 0 && /* @__PURE__ */ jsxs("span", { className: "flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-mono bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300", children: [
                              (ref.score * 100).toFixed(1),
                              "%"
                            ] })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "sm",
                            className: "h-5 px-1.5 -mt-1 flex-shrink-0",
                            onClick: () => copyToClipboard(ref.content, `k-${index}`),
                            children: copiedSection === `k-${index}` ? /* @__PURE__ */ jsx(CheckCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs prose prose-xs max-w-none dark:prose-invert break-words leading-relaxed", children: /* @__PURE__ */ jsx(Streamdown, { children: ref.content }) })
                    ]
                  },
                  index
                ))
              ] })
            ] }),
            !isUser && webRefs.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-green-900 dark:text-green-100", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setShowWebSearch(!showWebSearch),
                    className: "flex items-center gap-2 hover:opacity-80 transition-opacity",
                    children: [
                      /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        webRefs.length,
                        " 个网络结果"
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "h-6 px-2",
                      onClick: (e) => {
                        e.stopPropagation();
                        const refText = webRefs.map((ref, i) => `[${i + 1}] ${ref.title || ""}
${ref.source ? `来源：${ref.source}
` : ""}${ref.content}${ref.link ? `
链接：${ref.link}` : ""}`).join("\n\n");
                        copyToClipboard(refText, "websearch");
                      },
                      children: copiedSection === "websearch" ? /* @__PURE__ */ jsx(CheckCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowWebSearch(!showWebSearch),
                      className: "hover:opacity-80 transition-opacity",
                      children: showWebSearch ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              showWebSearch && /* @__PURE__ */ jsx("div", { className: "px-4 pb-3 space-y-3", children: webRefs.map((ref, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "text-sm p-3 rounded border bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 w-5 h-5 rounded-full bg-green-500 dark:bg-green-600 text-white text-xs flex items-center justify-center", children: /* @__PURE__ */ jsx(Globe, { className: "h-3 w-3" }) }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1 flex-wrap", children: [
                          ref.title && /* @__PURE__ */ jsx("div", { className: "font-medium text-xs text-green-700 dark:text-green-300 truncate flex-1 min-w-0", children: ref.title }),
                          ref.refer && /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300", children: "搜索引用" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          className: "h-5 px-1.5 -mt-1 flex-shrink-0",
                          onClick: () => copyToClipboard(ref.content, `w-${index}`),
                          children: copiedSection === `w-${index}` ? /* @__PURE__ */ jsx(CheckCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                        }
                      )
                    ] }),
                    (ref.source || ref.link || ref.publishDate) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2 text-xs text-green-600 dark:text-green-400 flex-wrap", children: [
                      ref.source && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "来源:" }),
                        /* @__PURE__ */ jsx("span", { children: ref.source })
                      ] }),
                      ref.publishDate && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("span", { children: "·" }),
                        /* @__PURE__ */ jsx("span", { children: formatDate(ref.publishDate) })
                      ] }),
                      ref.link && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("span", { children: "·" }),
                        /* @__PURE__ */ jsxs(
                          "a",
                          {
                            href: ref.link,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "flex items-center gap-1 hover:underline",
                            children: [
                              /* @__PURE__ */ jsx("span", { children: "查看原文" }),
                              /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs prose prose-xs max-w-none dark:prose-invert break-words leading-relaxed", children: /* @__PURE__ */ jsx(Streamdown, { children: ref.content }) })
                  ]
                },
                index
              )) })
            ] }),
            !isUser && message.thinking && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-amber-900 dark:text-amber-100", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setShowThinking(!showThinking),
                    className: "flex items-center gap-2 hover:opacity-80 transition-opacity",
                    children: [
                      /* @__PURE__ */ jsx(Lightbulb, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsx("span", { children: "思考过程" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "h-6 px-2",
                      onClick: (e) => {
                        e.stopPropagation();
                        copyToClipboard(message.thinking, "thinking");
                      },
                      children: copiedSection === "thinking" ? /* @__PURE__ */ jsx(CheckCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowThinking(!showThinking),
                      className: "hover:opacity-80 transition-opacity",
                      children: showThinking ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              showThinking && /* @__PURE__ */ jsx("div", { className: "px-4 pb-3 text-sm text-amber-800 dark:text-amber-200 prose prose-sm max-w-none dark:prose-invert", children: /* @__PURE__ */ jsx(Streamdown, { children: message.thinking }) })
            ] }),
            !isUser && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
                /* @__PURE__ */ jsxs("div", { className: "prose prose-sm max-w-none dark:prose-invert", children: [
                  /* @__PURE__ */ jsx(Streamdown, { children: message.content }),
                  message.isStreaming === true && /* @__PURE__ */ jsx("span", { className: "inline-block w-2 h-4 ml-1 bg-primary animate-pulse" })
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "absolute -top-2 -right-2 h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity",
                    onClick: () => copyToClipboard(message.content, "assistant-message"),
                    children: copiedSection === "assistant-message" ? /* @__PURE__ */ jsx(CheckCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                  }
                )
              ] }),
              message.analysisResults && message.analysisResults.length > 0 && /* @__PURE__ */ jsx(AnalysisResult, { results: message.analysisResults }),
              !isStreaming && message.content && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "h-8 gap-2",
                    onClick: () => copyToClipboard(message.content, "full-response"),
                    children: copiedSection === "full-response" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(CheckCheck, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs", children: "已复制" })
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs", children: "复制回答" })
                    ] })
                  }
                ),
                onRegenerate && /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "h-8 gap-2",
                    onClick: onRegenerate,
                    children: [
                      /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs", children: "重新生成" })
                    ]
                  }
                )
              ] })
            ] }),
            !isUser && message.usage && message.usage.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mt-2 space-y-1", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Token 使用:" }),
              message.usage.map((usage, index) => /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 pl-2", children: /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
                usage.nodeName,
                ": 输入 ",
                usage.inputTokenCount,
                " + 输出 ",
                usage.outputTokenCount,
                " = ",
                usage.totalTokenCount
              ] }) }, index))
            ] })
          ] })
        ] })
      ]
    }
  );
}
const ChatArea = memo(function ChatArea2({
  messages,
  onSendMessage,
  isGenerating = false,
  onStopGenerating,
  onRegenerateMessage
}) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto min-h-0", children: messages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6 px-4 max-w-3xl", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto w-20 h-20 rounded-2xl overflow-hidden shadow-lg", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/icon.jpg",
          alt: "库无忧助手",
          className: "w-full h-full object-cover"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-foreground", children: "你好,我是库无忧助手" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: "我是库无忧助手,可以帮你解决石油化工行业方面的问题" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mt-8", children: [
        "储罐保温涂层的施工要求和标准",
        "储罐防腐材料的选用原则",
        "储罐维修检测的主要项目有哪些?",
        "储罐外壁防腐涂层的维护保养"
      ].map((suggestion) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onSendMessage(suggestion, {
            showThinking: true,
            showReferences: true,
            useWebSearch: true
          }),
          className: "group rounded-xl border border-border bg-card px-5 py-4 text-left text-sm text-card-foreground transition-all hover:border-primary/50 hover:bg-accent hover:shadow-md",
          children: /* @__PURE__ */ jsx("span", { className: "group-hover:text-primary transition-colors", children: suggestion })
        },
        suggestion
      )) })
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl py-4", children: [
      messages.map((message) => /* @__PURE__ */ jsx(
        Message,
        {
          message,
          onRegenerate: message.role === "assistant" && onRegenerateMessage ? () => onRegenerateMessage(message.id) : void 0
        },
        message.id
      )),
      /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
    ] }) }),
    /* @__PURE__ */ jsx(
      InputArea,
      {
        onSendMessage,
        isGenerating,
        onStopGenerating
      }
    )
  ] });
});
function Header() {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-10 border-b border-border bg-white backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "flex h-14 items-center justify-between px-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(SidebarTrigger, { className: "md:hidden" }) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "rounded-lg p-2 text-black transition-colors hover:bg-accent",
        "aria-label": "切换主题",
        children: /* @__PURE__ */ jsx(Sun, { className: "h-5 w-5 text-black" })
      }
    ) })
  ] }) });
}
const Command = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = Command$1.displayName;
const CommandDialog = ({ children, ...props }) => {
  return /* @__PURE__ */ jsxs(Dialog, { ...props, children: [
    /* @__PURE__ */ jsx(DialogTitle, {}),
    " ",
    /* @__PURE__ */ jsx(DialogDescription, {}),
    " ",
    /* @__PURE__ */ jsx(DialogContent, { className: "overflow-hidden p-0 sm:max-w-lg [&>button:last-child]:hidden", children: /* @__PURE__ */ jsx(Command, { className: "**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group]]:px-2 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-3 **:[[cmdk-item]]:py-2", children }) })
  ] });
};
const CommandInput = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: "flex items-center border-b border-input px-5",
    "cmdk-input-wrapper": "",
    children: [
      /* @__PURE__ */ jsx(MagnifyingGlassIcon, { className: "me-3 text-muted-foreground/80" }),
      /* @__PURE__ */ jsx(
        Command$1.Input,
        {
          ref,
          className: cn(
            "flex h-10 w-full rounded-lg bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50",
            className
          ),
          ...props
        }
      )
    ]
  }
));
CommandInput.displayName = Command$1.Input.displayName;
const CommandList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.List,
  {
    ref,
    className: cn("max-h-80 overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = Command$1.List.displayName;
const CommandEmpty = React.forwardRef((props, ref) => /* @__PURE__ */ jsx(
  Command$1.Empty,
  {
    ref,
    className: "py-6 text-center text-sm",
    ...props
  }
));
CommandEmpty.displayName = Command$1.Empty.displayName;
const CommandGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-2 text-foreground **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = Command$1.Group.displayName;
const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = Command$1.Separator.displayName;
const CommandItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-3 rounded-md px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = Command$1.Item.displayName;
function SearchConversationsDialog({
  open,
  onOpenChange,
  conversations,
  onSelectConversation
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conv) => conv.title.toLowerCase().includes(query) || conv.messages.some((msg) => msg.content.toLowerCase().includes(query))
    );
  }, [conversations, searchQuery]);
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = /* @__PURE__ */ new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1e3 * 60 * 60);
    if (diffInHours < 24) {
      return date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } else if (diffInHours < 48) {
      return "昨天";
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}天前`;
    } else {
      return date.toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric"
      });
    }
  };
  const handleSelect = (conversationId) => {
    onSelectConversation(conversationId);
    onOpenChange(false);
    setSearchQuery("");
  };
  return /* @__PURE__ */ jsxs(CommandDialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsx(
      CommandInput,
      {
        placeholder: "搜索对话...",
        value: searchQuery,
        onValueChange: setSearchQuery
      }
    ),
    /* @__PURE__ */ jsxs(CommandList, { children: [
      /* @__PURE__ */ jsx(CommandEmpty, { children: "未找到相关对话" }),
      /* @__PURE__ */ jsx(CommandGroup, { heading: "对话历史", children: filteredConversations.map((conversation) => /* @__PURE__ */ jsxs(
        CommandItem,
        {
          value: conversation.id,
          onSelect: () => handleSelect(conversation.id),
          className: "flex items-center justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx(
                MessageSquare,
                {
                  size: 16,
                  strokeWidth: 2,
                  className: "opacity-60 shrink-0",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("span", { className: "truncate", children: conversation.title }),
                conversation.messages.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground truncate", children: [
                  conversation.messages[conversation.messages.length - 1].content.substring(0, 50),
                  conversation.messages[conversation.messages.length - 1].content.length > 50 ? "..." : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground shrink-0 ml-2", children: [
              /* @__PURE__ */ jsx(Clock, { size: 12, strokeWidth: 2, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { children: formatTime(conversation.timestamp) })
            ] })
          ]
        },
        conversation.id
      )) })
    ] })
  ] });
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuGroup({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 transition-transform duration-150 ease-in-out active:scale-95",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-inset:pl-8",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
const UserProfileDropdown = ({
  id,
  user,
  actions,
  menuItems
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState(null);
  const contentVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  return /* @__PURE__ */ jsxs(DropdownMenu, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("div", { id, className: "flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer", children: [
      /* @__PURE__ */ jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsx(AvatarFallback, { children: user.name.charAt(0) }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: user.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: user.handle })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
      DropdownMenuContent,
      {
        asChild: true,
        forceMount: true,
        className: "w-64 p-2 overflow-visible max-h-none",
        align: "start",
        children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            variants: contentVariants,
            children: [
              /* @__PURE__ */ jsxs(DropdownMenuLabel, { className: "flex items-center gap-2 p-2", children: [
                /* @__PURE__ */ jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsx(AvatarFallback, { children: user.name.charAt(0) }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: user.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: user.handle })
                ] })
              ] }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "mx-2" }),
              /* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-1 p-1", children: actions.map((action) => /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "ghost",
                  className: "flex flex-row h-12 items-center justify-start gap-3 text-muted-foreground w-full px-3",
                  onClick: action.onClick,
                  children: [
                    /* @__PURE__ */ jsx(action.icon, { className: "h-5 w-5" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm", children: action.label })
                  ]
                },
                action.label
              )) }) }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "mx-2 mb-1" }),
              /* @__PURE__ */ jsx(DropdownMenuGroup, { children: menuItems.map((item) => /* @__PURE__ */ jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  onMouseEnter: () => setHoveredItem(item.label),
                  onMouseLeave: () => setHoveredItem(null),
                  className: cn(
                    "flex items-center justify-between p-2 text-sm relative",
                    item.isDestructive && "text-destructive focus:bg-destructive focus:text-white",
                    item.isDestructive && hoveredItem === item.label && "text-white!"
                  ),
                  onClick: item.onClick,
                  children: [
                    hoveredItem === item.label && /* @__PURE__ */ jsx(
                      motion.div,
                      {
                        layoutId: "dropdown-hover-bg",
                        className: cn(
                          "absolute inset-0 rounded-md -z-10",
                          item.isDestructive ? "bg-destructive" : "bg-muted"
                        ),
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                        transition: { duration: 0.15 }
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(
                        item.icon,
                        {
                          className: cn(
                            "h-4 w-4",
                            item.isDestructive && hoveredItem === item.label && "text-white"
                          )
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: item.label })
                    ] }),
                    item.hasArrow && /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
                  ]
                }
              ) }, item.label)) })
            ]
          }
        )
      }
    ) })
  ] });
};
function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onOpenKnowledgeBase
}) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [searchDialogOpen, setSearchDialogOpen] = React.useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [conversationToDelete, setConversationToDelete] = React.useState(null);
  const { signOut, user } = useAuth();
  const router = useRouter();
  const userName = user?.username || user?.email?.split("@")[0] || "用户";
  const userHandle = user?.email ? `@${user.email.split("@")[0]}` : "@user";
  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    await signOut();
    router.navigate({ to: "/" });
  };
  const handleDeleteClick = (conversationId) => {
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (conversationToDelete) {
      onDeleteConversation(conversationToDelete);
      setConversationToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
  const handleDeleteCancel = () => {
    setConversationToDelete(null);
    setDeleteDialogOpen(false);
  };
  if (isCollapsed) {
    return /* @__PURE__ */ jsx("div", { className: "fixed left-0 top-0 z-50 p-2", children: /* @__PURE__ */ jsx(Button, { onClick: toggleSidebar, size: "icon", variant: "ghost", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 rotate-180" }) }) });
  }
  return /* @__PURE__ */ jsxs(Sidebar$1, { collapsible: "icon", "data-tutorial": "sidebar", children: [
    /* @__PURE__ */ jsxs(SidebarHeader, { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsx(
        Button,
        {
          onClick: toggleSidebar,
          size: "icon",
          variant: "ghost",
          className: "shrink-0",
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
        }
      ) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onNewConversation,
          className: "w-full justify-start",
          size: "default",
          variant: "outline",
          "data-tutorial": "new-conversation",
          children: [
            /* @__PURE__ */ jsx(MessageSquarePlus, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2", children: "新建对话" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => setSearchDialogOpen(true),
          className: "w-full justify-start",
          size: "default",
          variant: "outline",
          children: [
            /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2", children: "搜索对话" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onOpenKnowledgeBase,
          className: "w-full justify-start",
          size: "default",
          variant: "outline",
          "data-tutorial": "knowledge-base",
          children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2", children: "知识库" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: conversations.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center px-4 py-8 text-center text-sm text-muted-foreground", children: "暂无对话" }) : conversations.map((conversation) => /* @__PURE__ */ jsxs(
      SidebarMenuItem,
      {
        className: "relative group",
        children: [
          /* @__PURE__ */ jsxs(
            SidebarMenuButton,
            {
              onClick: () => onSelectConversation(conversation.id),
              isActive: currentConversationId === conversation.id,
              children: [
                /* @__PURE__ */ jsx(MessageSquarePlus, { className: "h-4 w-4 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1 truncate", children: conversation.title })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              role: "button",
              tabIndex: 0,
              onClick: (e) => {
                e.stopPropagation();
                handleDeleteClick(conversation.id);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick(conversation.id);
                }
              },
              className: "opacity-0 group-hover:opacity-100 rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-opacity absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer",
              "aria-label": "删除对话",
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ]
      },
      conversation.id
    )) }) }) }) }),
    /* @__PURE__ */ jsx(SidebarFooter, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
      UserProfileDropdown,
      {
        user: {
          name: userName,
          handle: userHandle
        },
        actions: [
          {
            icon: User,
            label: "资料",
            onClick: () => {
              window.location.href = "/profile";
            }
          }
        ],
        menuItems: [
          {
            icon: Settings,
            label: "设置",
            onClick: () => {
              window.location.href = "/settings";
            }
          },
          {
            icon: Trash2,
            label: "退出账号",
            onClick: () => setLogoutDialogOpen(true),
            isDestructive: true
          }
        ]
      }
    ) }) }) }),
    /* @__PURE__ */ jsx(
      SearchConversationsDialog,
      {
        open: searchDialogOpen,
        onOpenChange: setSearchDialogOpen,
        conversations,
        onSelectConversation
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "删除对话" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "确定要删除这个对话吗？删除后将无法恢复。" })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleDeleteCancel, children: "取消" }),
        /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: handleDeleteConfirm, children: "确定删除" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: logoutDialogOpen, onOpenChange: setLogoutDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "退出登录" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "确定要退出登录吗？退出后需要重新登录才能使用。" })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setLogoutDialogOpen(false),
            children: "取消"
          }
        ),
        /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: handleLogout, children: "确定退出" })
      ] })
    ] }) })
  ] });
}
class ChatService {
  constructor(apiKey, model) {
    this.providerInstance = null;
    this.abortController = null;
    this.apiKey = apiKey || "server-side-key";
    this.baseURL = process.env.AI_API_URL || "https://api.siliconflow.cn/v1";
    this.model = model || "MiniMaxAI/MiniMax-M2";
    this.initializeProvider();
  }
  /**
   * 初始化 AI Provider
   */
  initializeProvider() {
    if (this.apiKey) {
      this.providerInstance = createOpenAI({
        baseURL: this.baseURL,
        apiKey: this.apiKey
      });
    }
  }
  /**
   * 设置 API Key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.initializeProvider();
  }
  /**
   * 获取当前 API Key
   */
  getApiKey() {
    return this.apiKey;
  }
  /**
   * 检查 API Key 是否已设置
   */
  hasApiKey() {
    return !!this.apiKey;
  }
  /**
   * 将消息转换为 AI SDK 格式
   */
  convertMessages(messages) {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content
    }));
  }
  /**
   * 发送聊天请求（非流式）
   */
  async chat(messages, options = {}) {
    if (!this.providerInstance) {
      throw new Error("服务初始化失败");
    }
    const coreMessages = this.convertMessages(messages);
    const model = this.providerInstance(options.model || "MiniMaxAI/MiniMax-M2");
    const { text } = await generateText({
      model,
      messages: coreMessages,
      temperature: options.temperature,
      maxOutputTokens: options.maxTokens ?? 5e4,
      topP: options.topP
    });
    return text;
  }
  /**
   * 发送聊天请求（流式响应）
   */
  async *chatStream(messages, options = {}) {
    if (!this.providerInstance) {
      throw new Error("服务初始化失败");
    }
    this.abortController = new AbortController();
    try {
      const coreMessages = this.convertMessages(messages);
      const model = this.providerInstance(options.model || "MiniMaxAI/MiniMax-M2");
      const result = await streamText({
        model,
        messages: coreMessages,
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens ?? 5e4,
        topP: options.topP,
        abortSignal: this.abortController.signal
      });
      for await (const chunk of result.textStream) {
        yield chunk;
      }
    } finally {
      this.abortController = null;
    }
  }
  /**
   * 停止当前的流式请求
   */
  stopStream() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
  /**
   * 获取可用模型列表
   */
  getAvailableModels() {
    return [
      "MiniMaxAI/MiniMax-M2"
    ];
  }
  /**
   * 调用对话补全 API（流式）
   */
  async *chatCompletionStream(messages, options = {}) {
    console.log("🚀 AI 对话请求开始");
    console.log("📝 用户消息:", messages.filter((m) => m.role === "user").map((m) => m.content));
    console.log("⚙️ 配置:", {
      useKnowledge: options.useKnowledge,
      useWebSearch: options.useWebSearch,
      useThinking: options.useThinking
    });
    let finalMessages = messages;
    if (options.systemPrompt) {
      const hasSystemMessage = messages.some((m) => m.role === "system");
      if (!hasSystemMessage) {
        finalMessages = [
          { role: "system", content: options.systemPrompt },
          ...messages
        ];
        console.log("📋 使用系统提示词");
      }
    }
    const requestBody = {
      messages: finalMessages,
      stream: true
    };
    if (this.model) requestBody.model = this.model;
    if (options.temperature !== void 0) requestBody.temperature = options.temperature;
    if (options.maxTokens !== void 0) requestBody.max_tokens = options.maxTokens;
    if (options.useThinking) requestBody.thinking = { type: "enabled" };
    this.abortController = new AbortController();
    console.log("🔧 请求体:", JSON.stringify(requestBody, null, 2));
    try {
      const response = await fetch("/api/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
        signal: this.abortController.signal
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `请求失败 (${response.status})`);
      }
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法读取响应流");
      }
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim() || !line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            for (const choice of parsed.choices) {
              if (choice.finish_reason) {
                yield { finishReason: choice.finish_reason };
              }
              if (choice.delta) {
                if (choice.delta.reasoning_content) {
                  yield { thinking: choice.delta.reasoning_content };
                }
                if (choice.delta.content) {
                  yield { content: choice.delta.content };
                }
              }
            }
            if (parsed.usage) {
              yield { usage: parsed.usage };
            }
          } catch (e) {
            console.error("❌ 解析SSE数据失败:", e, "原始数据:", data);
          }
        }
      }
    } finally {
      this.abortController = null;
    }
  }
  /**
   * 获取请求头
   */
  getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json"
    };
  }
}
const chatService = new ChatService();
function useChat() {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const currentMessageRef = useRef(null);
  const conversationHistoryRef = useRef([]);
  const handleAnalysisMode = useCallback(async (content, fileContent, retrievalContext, knowledgeId) => {
    console.log("🔍 ========== 启动分析模式（流式）==========");
    console.log("📝 用户输入:", content);
    console.log("📊 文件内容长度:", fileContent.length, "字");
    const defaultKnowledgeIds = process.env.KNOWLEDGE_IDS?.split(",") || [];
    const knowledgeIdToUse = knowledgeId || defaultKnowledgeIds[0];
    const contextParts = [];
    if (retrievalContext?.knowledgeContext) {
      console.log("📚 知识库上下文长度:", retrievalContext.knowledgeContext.length);
      contextParts.push(retrievalContext.knowledgeContext);
    }
    if (retrievalContext?.webContext) {
      console.log("🌐 网络搜索上下文长度:", retrievalContext.webContext.length);
      contextParts.push(retrievalContext.webContext);
    }
    const finalContent = contextParts.length > 0 ? `${contextParts.join("\n\n")}

待分析文件内容：
${fileContent}` : fileContent;
    console.log("📝 第一步：流式调用分析API");
    const step1Response = await fetch("/api/analysis/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: finalContent,
        knowledgeId: knowledgeIdToUse
      })
    });
    if (!step1Response.ok) {
      throw new Error(`第一步分析失败 (${step1Response.status})`);
    }
    const reader = step1Response.body?.getReader();
    const decoder = new TextDecoder();
    let step1Result = "";
    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const content2 = parsed.choices?.[0]?.delta?.content;
                if (content2 && currentMessageRef.current) {
                  step1Result += content2;
                  currentMessageRef.current.content += content2;
                  currentMessageRef.current.isStreaming = true;
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
                      updated[lastIndex] = { ...currentMessageRef.current };
                    }
                    return updated;
                  });
                }
              } catch {
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    }
    console.log("✅ 第一步完成，文本长度:", step1Result.length);
    console.log("📝 第二步：生成结构化结果");
    let step2Success = false;
    let retryCount = 0;
    const maxRetries = 3;
    while (!step2Success && retryCount < maxRetries) {
      try {
        if (retryCount > 0) {
          console.log(`🔄 第二步重试 ${retryCount}/${maxRetries}`);
          await new Promise((resolve) => setTimeout(resolve, 1e3 * retryCount));
        }
        const step2Response = await fetch("/api/analysis/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            content: step1Result
          })
        });
        if (!step2Response.ok) {
          throw new Error(`第二步总结失败 (${step2Response.status})`);
        }
        const step2Data = await step2Response.json();
        if (step2Data.success && step2Data.results && currentMessageRef.current) {
          console.log("✅ 第二步完成，结果数量:", step2Data.results.length);
          currentMessageRef.current.analysisResults = step2Data.results;
          currentMessageRef.current.content += `

---

已完成规范检查分析，共发现 ${step2Data.results.length} 个问题。`;
          currentMessageRef.current.isStreaming = false;
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
              updated[lastIndex] = { ...currentMessageRef.current };
            }
            return updated;
          });
          step2Success = true;
        } else {
          throw new Error("第二步返回数据格式错误");
        }
      } catch (error) {
        retryCount++;
        console.error(`❌ 第二步失败 (尝试 ${retryCount}/${maxRetries}):`, error);
        if (retryCount >= maxRetries) {
          console.log("⚠️ 第二步重试次数已达上限，跳过结构化总结");
          if (currentMessageRef.current) {
            currentMessageRef.current.content += `

---

分析完成，但结构化总结暂时不可用。`;
            currentMessageRef.current.isStreaming = false;
            setMessages((prev) => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
                updated[lastIndex] = { ...currentMessageRef.current };
              }
              return updated;
            });
          }
        }
      }
    }
    console.log("========== 分析模式完成 ==========\n");
    if (currentMessageRef.current) {
      currentMessageRef.current.isStreaming = false;
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
          updated[lastIndex] = { ...currentMessageRef.current };
        }
        return updated;
      });
    }
  }, []);
  const buildContextMessages = useCallback((content, retrievalContext) => {
    const messagesWithContext = [...conversationHistoryRef.current];
    const contextParts = [];
    if (retrievalContext?.knowledgeContext) {
      console.log("📚 知识库上下文长度:", retrievalContext.knowledgeContext.length);
      contextParts.push(retrievalContext.knowledgeContext);
    }
    if (retrievalContext?.webContext) {
      console.log("🌐 网络搜索上下文长度:", retrievalContext.webContext.length);
      contextParts.push(retrievalContext.webContext);
    }
    if (contextParts.length > 0) {
      const finalMessage = `${contextParts.join("\n\n")}

用户问题：${content.trim()}`;
      console.log("📝 最终消息长度:", finalMessage.length);
      console.log("📝 最终消息预览:", finalMessage.substring(0, 300) + "...");
      messagesWithContext.push({
        role: "user",
        content: finalMessage
      });
    } else {
      console.log("⚠️ 没有检索上下文，使用原始消息");
      messagesWithContext.push({
        role: "user",
        content: content.trim()
      });
    }
    conversationHistoryRef.current.push({
      role: "user",
      content: content.trim()
    });
    return messagesWithContext;
  }, []);
  const processChatStream = useCallback(async (messages2, options) => {
    const stream = chatService.chatCompletionStream(
      messages2,
      {
        useKnowledge: false,
        useWebSearch: false,
        useThinking: true,
        systemPrompt: options.systemPrompt
      }
    );
    for await (const chunk of stream) {
      if (!currentMessageRef.current) break;
      if (chunk.thinking !== void 0 && (options.showThinking ?? true)) {
        currentMessageRef.current.thinking = (currentMessageRef.current.thinking || "") + chunk.thinking;
      }
      if (chunk.content !== void 0) {
        currentMessageRef.current.content += chunk.content;
      }
      if (chunk.references && (options.showReferences ?? true)) {
        if (!currentMessageRef.current.references) {
          currentMessageRef.current.references = [];
        }
        for (const ref of chunk.references) {
          const exists = currentMessageRef.current.references.some(
            (existing) => existing.content === ref.content
          );
          if (!exists) {
            currentMessageRef.current.references.push(ref);
          }
        }
      }
      if (chunk.finishReason) {
        if (chunk.finishReason === "sensitive" || chunk.finishReason === "network_error") {
          currentMessageRef.current.error = chunk.finishReason === "sensitive" ? "内容被安全审核拦截" : "网络错误";
        }
        currentMessageRef.current.isStreaming = false;
      }
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
          updated[lastIndex] = { ...currentMessageRef.current };
        }
        return updated;
      });
    }
    if (currentMessageRef.current) {
      currentMessageRef.current.isStreaming = false;
      conversationHistoryRef.current.push({
        role: "assistant",
        content: currentMessageRef.current.content
      });
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
          updated[lastIndex] = { ...currentMessageRef.current };
        }
        return updated;
      });
    }
  }, []);
  const sendMessage = useCallback(async (content, options = {}, retrievalContext) => {
    if (!content.trim() || isGenerating) return;
    const isAnalysisMode = !!options.fileContent;
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
      uploadedFileName: options.uploadedFile?.name
    };
    setMessages((prev) => [...prev, userMessage]);
    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
      isLoading: false,
      thinking: "",
      references: retrievalContext?.references || [],
      analysisResults: []
    };
    currentMessageRef.current = assistantMessage;
    setMessages((prev) => [...prev, assistantMessage]);
    try {
      if (isAnalysisMode && options.fileContent) {
        await handleAnalysisMode(
          content,
          options.fileContent,
          retrievalContext,
          options.knowledgeId
        );
        if (currentMessageRef.current) {
          currentMessageRef.current.isStreaming = false;
        }
        setIsGenerating(false);
        currentMessageRef.current = null;
        return;
      }
      const contextMessages = buildContextMessages(content, retrievalContext);
      await processChatStream(contextMessages, {
        ...options,
        systemPrompt: chatSystemPrompt
      });
    } catch (error) {
      console.error("发送消息失败:", error);
      if (currentMessageRef.current) {
        currentMessageRef.current.error = error instanceof Error ? error.message : "发送消息失败，请重试";
        currentMessageRef.current.isStreaming = false;
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
            updated[lastIndex] = { ...currentMessageRef.current };
          }
          return updated;
        });
      }
    } finally {
      setIsGenerating(false);
      currentMessageRef.current = null;
    }
  }, [isGenerating, handleAnalysisMode, buildContextMessages, processChatStream]);
  const stopGenerating = useCallback(() => {
    chatService.stopStream();
    if (currentMessageRef.current) {
      currentMessageRef.current.isStreaming = false;
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].id === currentMessageRef.current?.id) {
          updated[lastIndex] = { ...currentMessageRef.current };
        }
        return updated;
      });
    }
    setIsGenerating(false);
    currentMessageRef.current = null;
  }, []);
  const clearMessages = useCallback(() => {
    setMessages([]);
    conversationHistoryRef.current = [];
    currentMessageRef.current = null;
  }, []);
  const startNewConversation = useCallback(() => {
    clearMessages();
  }, [clearMessages]);
  return {
    messages,
    isGenerating,
    sendMessage,
    stopGenerating,
    clearMessages,
    startNewConversation
  };
}
class KnowledgeRetrievalService {
  constructor(config) {
    this.apiKey = config?.apiKey || process.env.AI_API_KEY || "";
  }
  /**
   * 检索知识库
   */
  async retrieve(params) {
    if (!params.query || params.query.length > 1e3) {
      throw new Error("查询内容必须在1-1000字以内");
    }
    console.log("🔍 知识库检索请求:", {
      query: params.query,
      knowledge_ids: params.knowledge_ids || "使用默认",
      top_k: params.top_k || 8,
      recall_method: params.recall_method || "embedding"
    });
    const apiKey = this.apiKey || "client-key";
    try {
      const response = await fetch("/api/knowledge/retrieve", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request_id: params.request_id || `retrieve-${Date.now()}`,
          query: params.query,
          knowledge_ids: params.knowledge_ids,
          document_ids: params.document_ids,
          top_k: params.top_k || 8,
          top_n: params.top_n || 10,
          recall_method: params.recall_method || "embedding",
          recall_ratio: params.recall_ratio || 80,
          rerank_status: params.rerank_status || 0,
          rerank_model: params.rerank_model,
          fractional_threshold: params.fractional_threshold
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || errorData.error || `知识库检索失败 (${response.status})`;
        throw new Error(errorMsg);
      }
      const result = await response.json();
      console.log("📦 API 返回数据:", {
        code: result.code,
        message: result.message,
        dataLength: result.data?.length,
        hasData: !!result.data
      });
      if (result.code !== 200) {
        const errorMsg = result.message || "知识库检索失败";
        throw new Error(`[${result.code}] ${errorMsg}`);
      }
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("知识库检索失败，未返回有效数据");
      }
      console.log("✅ 知识库检索成功:", {
        count: result.data.length,
        sources: [...new Set(result.data.map((s) => s.metadata?.doc_name || "未知"))]
      });
      return result;
    } catch (error) {
      console.error("❌ 知识库检索错误:", error);
      throw error;
    }
  }
  /**
   * 格式化检索结果为上下文文本
   */
  formatAsContext(slices) {
    if (!slices || slices.length === 0) {
      return "";
    }
    const context = slices.map((slice, index) => {
      const source = slice.metadata.doc_name || "未知文档";
      const content = slice.text;
      const score = (slice.score * 100).toFixed(1);
      return `[引用${index + 1}] 来源：${source} (相关度: ${score}%)
${content}`;
    }).join("\n\n");
    return `以下是从知识库中检索到的相关信息：

${context}

请基于以上信息回答用户问题。如果信息不足，可以结合你的知识补充，但请明确区分哪些来自知识库，哪些是你的补充。`;
  }
  /**
   * 更新配置
   */
  updateConfig(config) {
    if (config.apiKey) this.apiKey = config.apiKey;
  }
  /**
   * 检查配置是否完整
   */
  isConfigured() {
    return !!this.apiKey;
  }
}
const knowledgeRetrievalService = new KnowledgeRetrievalService();
class WebSearchService {
  constructor() {
    this.apiKey = process.env.SEARCH_API_KEY || "";
  }
  /**
   * 执行联网搜索
   */
  async search(query, options = {}) {
    const { count = 10 } = options;
    const response = await fetch("/api/web-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        count
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `联网搜索失败 (${response.status})`);
    }
    return await response.json();
  }
  /**
   * 检查是否配置了API
   */
  hasApiKey() {
    return !!this.apiKey;
  }
  /**
   * 格式化搜索结果为知识库引用格式
   */
  formatAsReferences(results) {
    return results.map((result) => ({
      content: result.content,
      source: result.media,
      link: result.link,
      title: result.title,
      refer: result.refer,
      publishDate: result.publish_date,
      type: "web_search"
    }));
  }
  /**
   * 格式化搜索结果为上下文文本（用于LLM）
   */
  formatAsContext(results) {
    if (results.length === 0) {
      return "";
    }
    const contextParts = results.map((result, index) => {
      const parts = [
        `[${result.refer}] ${result.title}`,
        `来源：${result.media}`,
        `链接：${result.link}`
      ];
      if (result.publish_date) {
        parts.push(`发布时间：${result.publish_date}`);
      }
      parts.push(`内容：${result.content}`);
      return parts.join("\n");
    });
    return `以下是联网搜索的相关信息：

${contextParts.join("\n\n---\n\n")}`;
  }
}
const webSearchService = new WebSearchService();
const RETRY_DELAY = 5e3;
const MAX_RETRIES = 3;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function useRetrieval() {
  const executeWithRetry = useCallback(async (fn, taskName) => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🔄 ${taskName} 第 ${attempt} 次尝试...`);
        const result = await fn();
        console.log(`✅ ${taskName} 成功`);
        return result;
      } catch (error) {
        console.error(`❌ ${taskName} 第 ${attempt} 次失败:`, error);
        if (attempt < MAX_RETRIES) {
          console.log(`⏳ 等待 ${RETRY_DELAY / 1e3} 秒后重试...`);
          await sleep(RETRY_DELAY);
        } else {
          console.error(`❌ ${taskName} 重试 ${MAX_RETRIES} 次后仍然失败，跳过该步骤`);
          return null;
        }
      }
    }
    return null;
  }, []);
  const retrieveFromKnowledge = useCallback(async (query, knowledgeId) => {
    const knowledgeIds = knowledgeId ? knowledgeId.split(",").map((id) => id.trim()) : ["使用默认"];
    const retrievalResult = await knowledgeRetrievalService.retrieve({
      query: query.trim(),
      knowledge_ids: knowledgeIds,
      top_k: 10,
      recall_method: "mixed"
    });
    const retrievalSlices = retrievalResult.data;
    console.log("📊 知识库检索结果:", retrievalSlices.length, "个，使用知识库:", knowledgeIds.join(","));
    return retrievalSlices;
  }, []);
  const searchWeb = useCallback(async (query) => {
    const searchResponse = await webSearchService.search(query.trim(), {
      searchEngine: "search_std",
      count: 10
    });
    const webSearchResults = searchResponse.search_result || [];
    console.log("📊 联网搜索结果:", webSearchResults.length, "个");
    return webSearchResults;
  }, []);
  const formatKnowledgeReferences = useCallback((retrievalSlices) => {
    if (retrievalSlices.length === 0) return [];
    return retrievalSlices.map((slice) => ({
      // 清除多余的空格和换行，保持文本连续
      content: slice.text.replace(/\s+/g, " ").trim(),
      source: slice.metadata.doc_name,
      score: slice.score,
      type: "knowledge"
    }));
  }, []);
  const performRetrieval = useCallback(async (query, options) => {
    const result = {
      knowledgeSlices: [],
      webResults: [],
      references: []
    };
    console.log("🚀 开始检索流程 (知识库 -> 联网搜索 -> 对话)");
    console.log("📋 检索配置:", {
      knowledgeId: options.knowledgeId || "使用默认",
      enableKnowledge: options.showReferences,
      enableWebSearch: options.useWebSearch
    });
    if (options.showReferences) {
      console.log("\n📖 ========== 步骤1: 知识库检索 ==========");
      const retrievalSlices = await executeWithRetry(
        () => retrieveFromKnowledge(query, options.knowledgeId),
        "知识库检索"
      );
      if (retrievalSlices && retrievalSlices.length > 0) {
        result.knowledgeSlices = retrievalSlices;
        const knowledgeReferences = formatKnowledgeReferences(retrievalSlices);
        result.references = [...result.references, ...knowledgeReferences];
        result.knowledgeContext = knowledgeRetrievalService.formatAsContext(retrievalSlices);
        console.log("✅ 知识库检索完成，获得", retrievalSlices.length, "个结果");
      } else {
        console.log("⚠️ 知识库检索失败或无结果，继续下一步骤");
      }
    } else {
      console.log("\n⏭️ 跳过知识库检索（未启用）");
    }
    if (options.useWebSearch) {
      console.log("\n🌐 ========== 步骤2: 联网搜索 ==========");
      const webSearchResults = await executeWithRetry(
        () => searchWeb(query),
        "联网搜索"
      );
      if (webSearchResults && webSearchResults.length > 0) {
        result.webResults = webSearchResults;
        const webReferences = webSearchService.formatAsReferences(webSearchResults);
        result.references = [...result.references, ...webReferences];
        result.webContext = webSearchService.formatAsContext(webSearchResults);
        console.log("✅ 联网搜索完成，获得", webSearchResults.length, "个结果");
      } else {
        console.log("⚠️ 联网搜索失败或无结果，继续下一步骤");
      }
    } else {
      console.log("\n⏭️ 跳过联网搜索（未启用）");
    }
    console.log("\n🎯 ========== 步骤3: 准备对话 ==========");
    console.log("📊 检索流程完成，汇总:", {
      知识库结果: result.knowledgeSlices.length,
      网络搜索结果: result.webResults.length,
      总引用数: result.references.length
    });
    return result;
  }, [executeWithRetry, retrieveFromKnowledge, searchWeb, formatKnowledgeReferences]);
  return {
    performRetrieval,
    retrieveFromKnowledge,
    searchWeb,
    formatKnowledgeReferences
  };
}
const DEFAULT_OPTIONS = {
  sliceLength: 100,
  maxSlices: 10,
  random: true
};
function sliceText(text, options = {}) {
  const { sliceLength, maxSlices, random } = { ...DEFAULT_OPTIONS, ...options };
  if (!text || text.trim().length === 0) {
    return [];
  }
  const cleanText = text.trim();
  const textLength = cleanText.length;
  if (textLength <= sliceLength) {
    return [cleanText];
  }
  const slices = [];
  for (let i = 0; i < textLength; i += sliceLength) {
    slices.push(cleanText.slice(i, i + sliceLength));
  }
  if (random && slices.length > maxSlices) {
    const shuffled = [...slices].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, maxSlices);
  }
  return slices.slice(0, maxSlices);
}
function joinSlices(slices, separator = " ", maxLength = 1e3) {
  const filtered = slices.filter((s) => s && s.trim().length > 0);
  let result = "";
  for (const slice of filtered) {
    const candidate = result ? result + separator + slice : slice;
    if (candidate.length <= maxLength) {
      result = candidate;
    } else {
      break;
    }
  }
  if (result.length > maxLength) {
    result = result.slice(0, maxLength);
  }
  return result;
}
function CustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep
}) {
  return /* @__PURE__ */ jsxs("div", { ...tooltipProps, style: {
    backgroundColor: "#ffffff",
    borderRadius: "var(--radius-lg)",
    padding: "1.25rem",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 2px hsl(var(--primary))",
    maxWidth: "400px"
  }, children: [
    step.title && /* @__PURE__ */ jsx("div", { style: {
      color: "#1a1a1a",
      fontSize: "1.125rem",
      fontWeight: 700,
      marginBottom: "0.5rem"
    }, children: step.title }),
    /* @__PURE__ */ jsx("div", { style: {
      color: "#1a1a1a",
      fontSize: "0.9375rem",
      lineHeight: "1.6",
      padding: "0.5rem 0"
    }, children: step.content }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "1rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "0.5rem" }, children: [
        index > 0 && /* @__PURE__ */ jsx(
          "button",
          {
            ...backProps,
            style: {
              color: "#666666",
              background: "none",
              border: "none",
              padding: "0.5rem 1rem",
              fontSize: "0.9375rem",
              fontWeight: 500,
              cursor: "pointer"
            },
            children: "上一步"
          }
        ),
        continuous && !isLastStep && /* @__PURE__ */ jsx(
          "button",
          {
            ...primaryProps,
            style: {
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "0.625rem 1.25rem",
              fontSize: "0.9375rem",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              cursor: "pointer"
            },
            children: "下一步"
          }
        ),
        isLastStep && /* @__PURE__ */ jsx(
          "button",
          {
            ...primaryProps,
            style: {
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "0.625rem 1.25rem",
              fontSize: "0.9375rem",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              cursor: "pointer"
            },
            children: "完成"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          ...skipProps,
          style: {
            color: "#666666",
            background: "none",
            border: "none",
            padding: "0.5rem 1rem",
            fontSize: "0.9375rem",
            fontWeight: 500,
            cursor: "pointer"
          },
          children: "跳过"
        }
      )
    ] })
  ] });
}
function ChatTutorial({ onComplete }) {
  const [runTutorial, setRunTutorial] = useState(false);
  useEffect(() => {
    if (!hasTutorialCompleted()) {
      const timer = setTimeout(() => {
        setRunTutorial(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      markTutorialCompleted();
      setRunTutorial(false);
      onComplete?.();
    }
  };
  const steps = [
    {
      target: "body",
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", style: { color: "#1a1a1a" }, children: "欢迎使用库无忧助手！" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "让我们快速了解一下如何使用这个智能助手。" })
      ] }),
      placement: "center",
      disableBeacon: true
    },
    {
      target: '[data-tutorial="sidebar"]',
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", style: { color: "#1a1a1a" }, children: "对话历史" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "这里显示您的所有对话记录，点击可以切换到不同的对话。" })
      ] }),
      placement: "right"
    },
    {
      target: '[data-tutorial="new-conversation"]',
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", style: { color: "#1a1a1a" }, children: "新建对话" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "点击这里可以开始一个全新的对话。" })
      ] }),
      placement: "right"
    },
    {
      target: '[data-tutorial="knowledge-base"]',
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", style: { color: "#1a1a1a" }, children: "知识库管理" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "在这里可以管理您的知识库，上传文档让助手学习。" })
      ] }),
      placement: "right"
    },
    {
      target: '[data-tutorial="input-area"]',
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", style: { color: "#1a1a1a" }, children: "输入区域" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "在这里输入您的问题，支持文本输入和语音输入。" })
      ] }),
      placement: "top"
    },
    {
      target: '[data-tutorial="file-upload"]',
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", style: { color: "#1a1a1a" }, children: "文件上传" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "点击这里可以上传文件（支持 TXT、MD、DOC、DOCX、PDF 格式）。" })
      ] }),
      placement: "top"
    },
    {
      target: '[data-tutorial="voice-input"]',
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", style: { color: "#1a1a1a" }, children: "语音输入" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "点击麦克风图标可以使用语音输入，再次点击停止录音。" })
      ] }),
      placement: "top"
    },
    {
      target: '[data-tutorial="web-search"]',
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", style: { color: "#1a1a1a" }, children: "联网搜索" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "开启后，助手会从互联网搜索相关信息来回答您的问题。" })
      ] }),
      placement: "top"
    },
    {
      target: '[data-tutorial="knowledge-search"]',
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", style: { color: "#1a1a1a" }, children: "知识库检索" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "开启后，助手会从您的知识库中检索相关内容。" })
      ] }),
      placement: "top"
    },
    {
      target: '[data-tutorial="deep-thinking"]',
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", style: { color: "#1a1a1a" }, children: "深度思考" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "开启后，助手会展示详细的思考过程，帮助您理解答案的来源。" })
      ] }),
      placement: "top"
    },
    {
      target: "body",
      content: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", style: { color: "#1a1a1a" }, children: "准备就绪！" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#4a4a4a" }, children: "现在您可以开始使用库无忧助手了。祝您使用愉快！" })
      ] }),
      placement: "center"
    }
  ];
  return /* @__PURE__ */ jsx(
    Joyride,
    {
      steps,
      run: runTutorial,
      continuous: true,
      showProgress: false,
      showSkipButton: true,
      callback: handleJoyrideCallback,
      disableOverlayClose: false,
      disableCloseOnEsc: false,
      hideCloseButton: true,
      spotlightClicks: false,
      tooltipComponent: CustomTooltip,
      styles: {
        options: {
          overlayColor: "rgba(0, 0, 0, 0.7)",
          // 更深的遮罩，突出提示框
          zIndex: 1e4
        }
      },
      floaterProps: {
        disableAnimation: false,
        styles: {
          arrow: {
            length: 8,
            spread: 16
          },
          floater: {
            filter: "drop-shadow(0 10px 40px rgba(0, 0, 0, 0.3))"
          }
        }
      }
    }
  );
}
function ChatPageContent() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    messages,
    isGenerating,
    sendMessage: sendChatMessage,
    stopGenerating,
    startNewConversation
  } = useChat();
  const { performRetrieval } = useRetrieval();
  useEffect(() => {
    if (conversations.length === 0) {
      const initialConversation = {
        id: Date.now().toString(),
        title: "新对话",
        messages: [],
        timestamp: Date.now()
      };
      setConversations([initialConversation]);
      setCurrentConversationId(initialConversation.id);
    }
  }, [conversations.length]);
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      setConversations(
        (prev) => prev.map((conv) => {
          if (conv.id === currentConversationId) {
            const title = conv.messages.length === 0 && messages.length > 0 ? messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? "..." : "") : conv.title;
            return {
              ...conv,
              messages,
              title,
              timestamp: Date.now(),
              lastMessage: messages[messages.length - 1]?.content
            };
          }
          return conv;
        })
      );
    }
  }, [messages, currentConversationId]);
  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );
  const handleNewConversation = useCallback(() => {
    const newConversation = {
      id: Date.now().toString(),
      title: "新对话",
      messages: [],
      timestamp: Date.now()
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    startNewConversation();
  }, [startNewConversation]);
  const handleDeleteConversation = useCallback(
    (id) => {
      const newConversations = conversations.filter((c) => c.id !== id);
      setConversations(newConversations);
      if (currentConversationId === id) {
        const nextConv = newConversations[0];
        setCurrentConversationId(nextConv?.id || null);
        if (nextConv) {
          startNewConversation();
        }
      }
    },
    [conversations, currentConversationId, startNewConversation]
  );
  const handleSelectConversation = useCallback(
    (id) => {
      setCurrentConversationId(id);
      startNewConversation();
    },
    [startNewConversation]
  );
  const handleSendMessage = useCallback(
    async (content, options) => {
      if (!currentConversationId || isGenerating) return;
      if (location.pathname !== "/chat") {
        console.log("🚀 乐观UI: 立即跳转到聊天页面");
        navigate({ to: "/chat" });
        setTimeout(async () => {
          await processMessage(content, options);
        }, 100);
      } else {
        await processMessage(content, options);
      }
    },
    [currentConversationId, isGenerating, sendChatMessage, performRetrieval, navigate, location.pathname]
  );
  const processMessage = useCallback(async (content, options) => {
    try {
      const needsRetrieval = options?.showReferences || options?.useWebSearch;
      let retrievalContext;
      if (needsRetrieval) {
        const retrievalOptions = {
          showReferences: options.showReferences,
          useWebSearch: options.useWebSearch,
          knowledgeId: options.knowledgeId
        };
        const isAnalysisMode = !!options?.fileContent;
        let queryForRetrieval;
        if (isAnalysisMode && options.fileContent) {
          const fileContent = options.fileContent;
          if (fileContent.length > 1e3) {
            const slices = sliceText(fileContent, {
              sliceLength: 100,
              maxSlices: 10,
              random: true
            });
            queryForRetrieval = joinSlices(slices);
          } else {
            queryForRetrieval = fileContent;
          }
        } else {
          queryForRetrieval = content;
        }
        const retrievalResult = await performRetrieval(queryForRetrieval, retrievalOptions);
        retrievalContext = {
          knowledgeContext: retrievalResult.knowledgeContext,
          webContext: retrievalResult.webContext,
          references: retrievalResult.references
        };
      }
      await sendChatMessage(content, options, retrievalContext);
    } catch (error) {
      console.error("❌ 发送消息失败:", error);
    }
  }, [sendChatMessage, performRetrieval]);
  const handleStopGenerating = useCallback(() => {
    stopGenerating();
  }, [stopGenerating]);
  const handleRegenerateMessage = useCallback(
    (messageId) => {
      if (isGenerating) return;
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1 || messages[messageIndex].role !== "assistant") return;
      const userMessageIndex = messageIndex - 1;
      if (userMessageIndex < 0 || messages[userMessageIndex].role !== "user") return;
      const userMessage = messages[userMessageIndex];
      const newMessages = messages.slice(0, userMessageIndex);
      setConversations(
        (prev) => prev.map((conv) => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: newMessages,
              timestamp: Date.now()
            };
          }
          return conv;
        })
      );
      setTimeout(() => {
        handleSendMessage(userMessage.content, {
          showThinking: true,
          showReferences: true,
          useWebSearch: true
        });
      }, 100);
    },
    [messages, isGenerating, currentConversationId, handleSendMessage]
  );
  const handleOpenKnowledgeBase = useCallback(() => {
    window.location.href = "/knowledge";
  }, []);
  return /* @__PURE__ */ jsxs(SidebarProvider, { defaultOpen: true, children: [
    /* @__PURE__ */ jsx(ChatTutorial, {}),
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        conversations,
        currentConversationId,
        onSelectConversation: handleSelectConversation,
        onNewConversation: handleNewConversation,
        onDeleteConversation: handleDeleteConversation,
        onOpenKnowledgeBase: handleOpenKnowledgeBase
      }
    ),
    /* @__PURE__ */ jsxs(SidebarInset, { className: "flex flex-col h-screen overflow-hidden", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsx(
        ChatArea,
        {
          messages: currentConversation?.messages || [],
          onSendMessage: handleSendMessage,
          isGenerating,
          onStopGenerating: handleStopGenerating,
          onRegenerateMessage: handleRegenerateMessage
        }
      ) })
    ] })
  ] });
}
function ChatPage() {
  return /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(ChatPageContent, {}) });
}
export {
  ChatPage as component
};
