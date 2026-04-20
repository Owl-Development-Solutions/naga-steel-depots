"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
  disabled?: boolean
  className?: string
}

interface SelectTriggerProps {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  onValueChange?: (value: string) => void
  disabled?: boolean
}

interface SelectContentProps {
  children?: React.ReactNode
  className?: string
  open?: boolean
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
  onSelect?: (value: string) => void
}

interface SelectValueProps {
  placeholder?: string
  value?: string
}



const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ children, className, onClick, disabled = false, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    
    const handleClick = () => {
      setIsOpen(!isOpen)
      onClick?.()
    }

    // Filter out onValueChange from props to prevent React warning
    const { onValueChange, ...restProps } = props

    return (
      <>
        <div
          ref={ref}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            className
          )}
          onClick={handleClick}
          {...restProps}
        >
          {children}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, open = false, ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute top-full left-0 right-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg",
          className
        )}
        {...props}
      >
        <div className="p-1">
          {children}
        </div>
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, className, onSelect, ...props }, ref) => {
    const handleClick = () => {
      onSelect?.(value)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, value }) => {
  return <span>{value || placeholder}</span>
}

const SelectGroup: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  return (
    <div className="relative">
      {React.Children.map(children, (child, index) => {
        return child
      })}
    </div>
  )
}


export {
   Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
}
