import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { Layers } from "@craftjs/layers";
import clsx from "clsx";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@go-blite/shadcn/collapsible";
import { Edit, Layers as LayersIcon, ChevronDown } from "lucide-react";
import { Toolbar } from "../Toolbar";

const SidebarItem: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={clsx("w-full", className)}>
      <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-sm font-medium">
        <div className="flex items-center">
          {icon}
          <span className="ml-2 uppercase">{title}</span>
        </div>
        <ChevronDown className={clsx("h-4 w-4 transition-transform", isOpen ? "transform rotate-180" : "")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-2">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export const Sidebar: React.FC = () => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));

  // if (!enabled) return null;

  return (
    <div className={clsx("w-64 bg-white shadow-md transition-all", enabled ? "opacity-100" : "opacity-0 w-0")}>
      <div className="flex flex-col h-full">
        <SidebarItem title="Customize" icon={<Edit className="h-4 w-4" />} className="flex-[0.6]">
          <Toolbar />
        </SidebarItem>
        <SidebarItem title="Layers" icon={<LayersIcon className="h-4 w-4" />}>
          <div className="h-64 overflow-auto">
            <Layers expandRootOnLoad={true} />
          </div>
        </SidebarItem>
      </div>
    </div>
  );
};
