import { jsx, jsxs } from "react/jsx-runtime";
import { B as Button } from "./button-BOe1jWOF.js";
const backgroundColors = {
  blue: "bg-blue-500/10 border-blue-500/20",
  green: "bg-green-500/10 border-green-500/20",
  purple: "bg-purple-500/10 border-purple-500/20",
  orange: "bg-orange-500/10 border-orange-500/20",
  red: "bg-red-500/10 border-red-500/20",
  yellow: "bg-yellow-500/10 border-yellow-500/20",
  pink: "bg-pink-500/10 border-pink-500/20",
  indigo: "bg-indigo-500/10 border-indigo-500/20"
};
const iconMap = {
  book: "📚",
  file: "📄",
  folder: "📁",
  star: "⭐",
  heart: "❤️",
  rocket: "🚀",
  bulb: "💡",
  flag: "🚩"
};
const formatNumber = (num) => {
  if (num >= 1e4) {
    return `${(num / 1e4).toFixed(1)}万`;
  }
  return num.toLocaleString();
};
function KnowledgePagination({
  currentPage,
  total,
  pageSize = 10,
  onPageChange
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (total <= pageSize) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "border-t border-border/40 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        disabled: currentPage === 1,
        onClick: () => onPageChange(currentPage - 1),
        children: "上一页"
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
      "第 ",
      currentPage,
      " 页 / 共 ",
      totalPages,
      " 页"
    ] }),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        disabled: currentPage >= totalPages,
        onClick: () => onPageChange(currentPage + 1),
        children: "下一页"
      }
    )
  ] }) });
}
export {
  KnowledgePagination as K,
  backgroundColors as b,
  formatNumber as f,
  iconMap as i
};
