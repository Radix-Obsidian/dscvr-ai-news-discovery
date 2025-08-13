"use client";

import React from "react";
import { cn } from "./utils";

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 1, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        style={{ aspectRatio: ratio }}
        {...props}
      />
    );
  }
);

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
