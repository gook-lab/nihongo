import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        // share/Field 패턴: 1.5px border + focus 시 primary border + 4px primary ring
        className={cn(
          "flex h-12 w-full rounded-xl bg-background px-4 py-3 text-base transition-all duration-200",
          "border-[1.5px] border-border",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:border-primary focus-visible:[box-shadow:0_0_0_4px_color-mix(in_srgb,var(--color-primary)_22%,transparent)]",
          "hover:border-foreground/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
