import { jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { a as cn } from "./router-BKp7vXSH.mjs";
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, interactive, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        badgeVariants({ variant }),
        interactive && "cursor-pointer active:scale-95",
        className
      ),
      ...props
    }
  );
}
export {
  Badge as B
};
