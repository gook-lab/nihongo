import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// share/screens.jsx BigButton 패턴 기반:
// - solid primary (그라데이션 X) → 모든 테마 자동 적용
// - primary 색상 기반 glow shadow (테마 변수)
// - fontWeight 800, letterSpacing -0.3
// - active scale 0.97 (snappy)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-extrabold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-2xl shadow-[var(--shadow-primary-glow)] hover:brightness-[1.05]",
        destructive:
          "bg-destructive text-destructive-foreground rounded-2xl shadow-md hover:bg-destructive/90",
        outline:
          "border-[1.5px] border-foreground bg-background hover:bg-accent rounded-2xl",
        secondary:
          "bg-muted text-foreground hover:bg-muted/80 rounded-2xl",
        ghost:
          "hover:bg-accent rounded-xl font-semibold",
        link:
          "text-foreground underline-offset-4 hover:underline font-semibold",
        airbnb:
          "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-2xl shadow-[var(--shadow-primary-glow)] hover:brightness-[1.05]",
      },
      size: {
        default: "h-12 px-5 py-2",
        sm: "h-9 px-4 text-xs rounded-xl",
        lg: "h-14 px-8 text-base rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
