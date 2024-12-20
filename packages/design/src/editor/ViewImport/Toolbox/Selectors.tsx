import React from "react";
import { Element } from "@craftjs/core";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@go-blite/shadcn";
import { Button } from "@go-blite/shadcn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@go-blite/shadcn";
import { Container, defaultProps } from "@/selectors/Container/Container.edit";
import { Text } from "@/selectors/Text/Text.edit";
import { Image } from "@/selectors/Image/Image.edit";
import { Button as ButtonSelector } from "@/selectors/Button/Button.edit";
import { Type, Image as ImageIcon, SquareMinus, Box } from "lucide-react";
import { DragBox } from "@/components/DragBox";

export const Selectors: React.FC = () => {
  return (
    <Accordion type="single" collapsible defaultValue="basic-components" className="w-full">
      <AccordionItem value="basic-components">
        <AccordionTrigger>组件</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col space-y-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <DragBox
                    element={
                      <Element canvas is={Container} style={{ ...defaultProps.style, width: "10%", height: "10%" }} />
                    }
                  >
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center">
                      <Box className="w-4 h-4" />
                    </Button>
                  </DragBox>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>用于放置子元素使用</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DragBox element={<Text text="文本" />}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center">
                      <Type className="w-4 h-4" />
                    </Button>
                  </DragBox>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>文本组件</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DragBox element={<Image src="" alt="图片" />}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </DragBox>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>图片组件</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DragBox element={<ButtonSelector text="按钮" />}>
                    <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center">
                      <SquareMinus className="w-4 h-4" />
                    </Button>
                  </DragBox>
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
