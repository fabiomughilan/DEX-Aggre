import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const dexButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        connect: "bg-gradient-primary text-black font-semibold hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300",
        secondary: "bg-dex-card border border-border text-dex-text-primary hover:bg-dex-card-hover",
        ghost: "text-dex-text-secondary hover:bg-dex-card hover:text-dex-text-primary",
        outline: "border border-border bg-transparent text-dex-text-primary hover:bg-dex-card",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface DexButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dexButtonVariants> {
  asChild?: boolean
}

const DexButton = React.forwardRef<HTMLButtonElement, DexButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(dexButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
DexButton.displayName = "DexButton"

export { DexButton, dexButtonVariants }