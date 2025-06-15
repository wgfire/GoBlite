import React, { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: ReactNode;
}

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType>({
  open: false,
  setOpen: () => {},
});

function TooltipProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <TooltipContext.Provider value={{ open, setOpen }}>{children}</TooltipContext.Provider>;
}

function Tooltip({ children }: TooltipProps) {
  return <div className="relative inline-block">{children}</div>;
}

interface TooltipTriggerProps {
  children: React.ReactElement<React.HTMLProps<HTMLElement>>;
  asChild?: boolean;
}

function TooltipTrigger({ children, asChild = false }: TooltipTriggerProps) {
  const { setOpen } = React.useContext(TooltipContext);

  if (asChild) {
    // 当 asChild 为 true 时，将事件处理器合并到子元素的 props 中
    return React.cloneElement(children, {
      onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
        setOpen(true);
        // 调用子元素可能已有的 onMouseEnter
        if (typeof children.props.onMouseEnter === 'function') {
          children.props.onMouseEnter(event);
        }
      },
      onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
        setOpen(false);
        // 调用子元素可能已有的 onMouseLeave
        if (typeof children.props.onMouseLeave === 'function') {
          children.props.onMouseLeave(event);
        }
      },
    });
  }

  // 当 asChild 为 false 时，渲染一个 span 元素来处理事件
  return (
    <span
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // 确保 span 元素可以聚焦，以便键盘导航
      tabIndex={0}
    >
      {children}
    </span>
  );
}

interface TooltipContentProps {
  children: ReactNode;
  className?: string;
  sideOffset?: number;
}

function TooltipContent({ children, className, sideOffset = 4 }: TooltipContentProps) {
  const { open } = React.useContext(TooltipContext);

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-3 py-1.5 rounded-md bg-gray-800 text-white text-sm shadow-md whitespace-nowrap min-w-max",
        className
      )}
      style={{ marginBottom: sideOffset }}
    >
      {children}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800" />
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
