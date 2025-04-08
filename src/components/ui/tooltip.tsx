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
  children: ReactNode;
  asChild?: boolean;
}

function TooltipTrigger({ children, asChild = false }: TooltipTriggerProps) {
  const { setOpen } = React.useContext(TooltipContext);
  const Child = asChild
    ? React.cloneElement(children as React.ReactElement, {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
      })
    : children;

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {Child}
    </div>
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
