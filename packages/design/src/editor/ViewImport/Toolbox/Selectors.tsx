import React from "react";
import { Element } from "@craftjs/core";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@go-blite/shadcn";
import { Button } from "@go-blite/shadcn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@go-blite/shadcn";
import { useDesignContext } from "@/context/useDesignContext";
import { DragBox } from "@/components/DragBox";
import { defaultProps as ContainerDefaultProps } from "@/selectors/Container/Container.edit";
import type { BusinessComponents } from "@/context/Provider";

export const Selectors: React.FC = () => {
  const designContext = useDesignContext();

  if (!designContext) {
    return null;
  }

  const businessComponents = designContext.resolver?.filter(comp => comp.name !== "App") || [];

  const groupedComponents = React.useMemo(() => {
    const groups: { [key: string]: BusinessComponents[] } = {};
    businessComponents.forEach(comp => {
      const category = (comp as any).category || "基础组件";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(comp);
    });
    return groups;
  }, [businessComponents]);

  const defaultCategory = Object.keys(groupedComponents)[0] || "";

  return (
    <TooltipProvider>
      <Accordion type="multiple" defaultValue={defaultCategory ? [defaultCategory] : []} className="w-full">
        {Object.entries(groupedComponents).map(([category, componentsInCategory]) => (
          <AccordionItem value={category} key={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 gap-2">
              {componentsInCategory.map((comp: BusinessComponents) => {
                let elementProps: any = {};
                if (comp.name === "Container") {
                  elementProps = { style: { ...ContainerDefaultProps.style, width: "100px", height: "100px" } };
                } else if (comp.name === "Text") {
                  elementProps = { text: "文本" };
                } else if (comp.name === "Button") {
                  elementProps = { text: "按钮" };
                } else if (comp.name === "Image") {
                  elementProps = { src: "", alt: "图片" };
                }
                // 其他组件可以根据需要添加默认属性

                return (
                  <Tooltip key={comp.name}>
                    <TooltipTrigger asChild>
                      <DragBox
                        element={
                          <Element canvas={comp.name === "Container"} is={comp.editResolver} {...elementProps} />
                        }
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <Button variant="outline" className="text-xs flex items-center justify-center">
                            {comp.icon ? (
                              React.cloneElement(comp.icon as React.ReactElement, { className: "w-4 h-4" })
                            ) : (
                              <div className="w-4 h-4 bg-gray-300 rounded-md" />
                            )}
                            <span className="text-xs text-center truncate w-full">{comp.description ?? comp.name}</span>
                          </Button>
                        </div>
                      </DragBox>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>
                        {comp.name} ({comp.category})
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </TooltipProvider>
  );
};
