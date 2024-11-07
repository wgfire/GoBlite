import React from "react";
import { Element, useEditor } from "@craftjs/core";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@go-blite/shadcn";
import { Button } from "@go-blite/shadcn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@go-blite/shadcn";
import { Container } from "@/selectors/Container";
import { Text } from "@/selectors/Text";
import { Image } from "@/selectors/Image";
import { Button as ButtonSelector } from "@/selectors/Button";
import { Type, Image as ImageIcon, BoneIcon, Box } from "lucide-react";

export const Selectors: React.FC = () => {
  const {
    connectors: { create }
  } = useEditor();

  return (
    <Accordion type="single" collapsible defaultValue="basic-components" className="w-full">
      <AccordionItem value="basic-components">
        <AccordionTrigger>组件</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col space-y-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    ref={ref =>
                      create(
                        ref!,
                        <Element canvas is={Container} height="300px" background="rgba(243, 244, 246, 0.8)"></Element>
                      )
                    }
                  >
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center">
                      <Box className="w-4 h-4 mr-0" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>用于放置子元素使用</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={ref => create(ref!, <Text text="文本" />)}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center">
                      <Type className="w-4 h-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>文本组件</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={ref => create(ref!, <Image src="" alt="图片" />)}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>图片组件</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={ref => create(ref!, <ButtonSelector text="按钮" />)}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center">
                      <BoneIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
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
