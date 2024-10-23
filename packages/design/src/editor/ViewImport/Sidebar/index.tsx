import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { Layers } from "@craftjs/layers";
import clsx from "clsx";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@go-blite/shadcn";
import { Edit, Layers as LayersIcon, ChevronDown } from "lucide-react";
import { Settings } from "../../Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@go-blite/shadcn";

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
      <CollapsibleContent className="">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export const Sidebar: React.FC = () => {
  const { enabled, name } = useEditor(state => {
    const [currentNodeId] = state.events.selected;
    return {
      enabled: state.options.enabled,
      name: state.nodes[currentNodeId]?.data?.displayName
    };
  });

  if (!enabled) return null;

  return (
    <div
      className={clsx(
        "bg-white shadow-md transition-all flex-shrink-0",
        "pt-2",
        enabled ? "opacity-100" : "opacity-0 w-0"
      )}
    >
      <Tabs defaultValue="props" className="h-full w-[300px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="props">属性配置</TabsTrigger>
          <TabsTrigger value="build">部署信息</TabsTrigger>
        </TabsList>
        <TabsContent value="props" className="h-[calc(100vh-60px)] overflow-auto mt-0">
          <SidebarItem title={name} icon={<Edit className="h-4 w-4" />} className="">
            <Settings />
          </SidebarItem>
          <SidebarItem title="层级" icon={<LayersIcon className="h-4 w-4" />} className="">
            <Layers expandRootOnLoad={true} />
          </SidebarItem>
        </TabsContent>
      </Tabs>
    </div>
  );
};
