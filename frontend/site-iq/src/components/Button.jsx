'use client'
import { cn } from "@/lib/utils"

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={cn("px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition", className)}
      {...props}
    >
      {children}
    </button>
  )
}
