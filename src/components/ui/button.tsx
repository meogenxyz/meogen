import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display tracking-wide transition-[color,background-color,border-color,transform] duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 active:scale-[0.98] border-[3px] border-ink",
  {
    variants: {
      variant: {
        solid: "bg-ink text-accent-fg hover:bg-accent hover:text-accent-fg",
        accent: "bg-accent text-accent-fg hover:bg-ink",
        ghost: "border-transparent bg-transparent text-fg hover:text-accent",
        outline: "bg-surface text-ink hover:bg-elevated",
      },
      size: {
        sm: "h-9 rounded-sm px-3 text-sm",
        md: "h-11 rounded-md px-4 text-base",
        lg: "h-12 rounded-lg px-5 text-lg",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
