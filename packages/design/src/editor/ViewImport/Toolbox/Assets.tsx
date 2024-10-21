import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@go-blite/shadcn/accordion";
import { useDesignContext } from "@/context";
import { ScrollArea } from "@go-blite/shadcn/scroll-area";
import { Card, CardContent } from "@go-blite/shadcn/card";
import { useEditor } from "@craftjs/core";
import { assetsType } from "@/context/Provider";
import { Image } from "@/selectors/Image";

interface AssetItem {
  name: string;
  url: string;
  type: assetsType;
}

export const Assets: React.FC = () => {
  const { assets } = useDesignContext();
  const { connectors } = useEditor();

  const renderAssetItem = (item: AssetItem) => {
    switch (item.type) {
      case "Image":
        return (
          <Card
            key={item.name}
            className="cursor-move"
            ref={ref => ref && connectors.create(ref, <Image src={item.url} alt={item.name} />)}
          >
            <CardContent className="p-2 flex flex-col items-center">
              <div className="w-full h-14 overflow-hidden">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs mt-1 text-center truncate w-full text-ellipsis">{item.name}</p>
            </CardContent>
          </Card>
        );
      case "PDF":
        return (
          <Card
            key={item.name}
            className="cursor-move"
            ref={ref =>
              ref && connectors.create(ref, <embed src={item.url} type="application/pdf" width="100%" height="600px" />)
            }
          >
            <CardContent className="p-2 flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100">
                <span className="text-2xl">📄</span>
              </div>
              <p className="text-xs mt-1 text-center truncate w-full">{item.name}</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const groupedAssets =
    assets?.reduce(
      (acc, asset) => {
        if (!acc[asset.type]) {
          acc[asset.type] = [];
        }
        acc[asset.type].push(asset);
        return acc;
      },
      {} as Record<assetsType, AssetItem[]>
    ) || {};

  return (
    <ScrollArea className="h-[calc(100vh-10px)]">
      <Accordion type="multiple" className="w-full">
        {Object.entries(groupedAssets).map(([category, items]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {(items as AssetItem[]).map((item: AssetItem) => renderAssetItem(item))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};
