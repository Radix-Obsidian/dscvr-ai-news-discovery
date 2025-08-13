import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-center text-base font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700 active:border-blue-700 active:bg-blue-700",
        destructive:
          "border border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700 active:border-red-700 active:bg-red-700",
        outline:
          "border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:hover:bg-blue-900/20 dark:active:bg-blue-900/30",
        secondary:
          "border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
        ghost:
          "border border-transparent bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
      },
      size: {
        default: "px-7 py-3 rounded",
        sm: "px-5 py-2 text-sm rounded",
        lg: "px-8 py-4 text-lg rounded",
        icon: "p-3 rounded",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      ref,
      className: cn(buttonVariants({ variant, size, className })),
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };