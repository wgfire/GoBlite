import { useDesignContext } from "@/context";

import {
  Button,
  Card,
  CardContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@go-blite/shadcn";
import { assetsType } from "@/context/Provider";
import { Image } from "@/selectors/Image/Image.edit";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@go-blite/shadcn";
import { BookImage } from "lucide-react";
import { DragBox } from "@/components/DragBox";

interface AssetItem {
  name: string;
  url: string;
  type: assetsType;
}

export const Assets: React.FC = () => {
  const context = useDesignContext();
  const assets = context.assets;

  const renderAssetItem = (item: AssetItem) => {
    switch (item.type) {
      case "Image":
        return (
          <Card key={item.name} className="cursor-move">
            <DragBox element={<Image src={item.url} alt={item.name} />}>
              <CardContent className="p-2 flex flex-col items-center justify-center">
                <div className="h-10 overflow-hidden">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs mt-1 text-center truncate w-full text-ellipsis">{item.name}</span>
              </CardContent>
            </DragBox>
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
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="flex items-center justify-center">
                <BookImage className="w-4 h-4 mr-0" />
                <span className="text-xs text-center truncate w-full">资源</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">媒体资源</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent side="right" className="translate-x-2 translate-y-2 w-[200px]">
        <Command className="rounded-lg border">
          <CommandInput placeholder="搜索分类资源" />
          <CommandList className="max-h-[60vh] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(groupedAssets).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                <CommandItem className="grid grid-cols-1 gap-2">
                  {(items as AssetItem[]).map((item: AssetItem) => renderAssetItem(item))}
                </CommandItem>
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
