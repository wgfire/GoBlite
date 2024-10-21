import React from "react";
import { Element, useEditor } from "@craftjs/core";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@go-blite/shadcn/tooltip";
import { Button } from "@go-blite/shadcn/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@go-blite/shadcn/accordion";
import { Container } from "@/selectors/Container";
import { Text } from "@/selectors/Text";
import { Image } from "@/selectors/Image";
import { Button as ButtonSelector } from "@/selectors/Button";
import { LayoutGrid, Type, Image as ImageIcon, BoneIcon } from "lucide-react";

export const Selectors: React.FC = () => {
  const {
    connectors: { create }
  } = useEditor();

  return (
    <Accordion type="single" collapsible defaultValue="basic-components" className="w-full">
      <AccordionItem value="basic-components">
        <AccordionTrigger>基础组件</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={ref => create(ref!, <Element canvas is={Container} height="300px"></Element>)}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-start">
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      容器
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>用于放置子元素使用</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={ref => create(ref!, <Text text="文本" />)}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-start">
                      <Type className="w-4 h-4 mr-2" />
                      文本
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>文本组件</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={ref => create(ref!, <Image src="" alt="图片" />)}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-start">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      图片
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>图片组件</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={ref => create(ref!, <ButtonSelector text="按钮" />)}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-start">
                      <BoneIcon className="w-4 h-4 mr-2" />
                      按钮
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>按钮组件</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
