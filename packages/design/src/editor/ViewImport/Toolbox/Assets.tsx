import { useDesignContext } from "@/context";

import { Card, CardContent } from "@go-blite/shadcn/card";
import { useEditor } from "@craftjs/core";
import { assetsType } from "@/context/Provider";
import { Image } from "@/selectors/Image";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator
} from "@go-blite/shadcn/command";

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
              <div className="h-10 overflow-hidden">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs mt-1 text-center truncate w-full text-ellipsis">{item.name}</span>
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
    <div>
      <Command className="rounded-lg border">
        <CommandInput placeholder="搜索分类资源" />
        <CommandList className="max-h-[90vh] overflow-y-auto">
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(groupedAssets).map(([category, items]) => (
            <>
              <CommandGroup key={category} heading={category}>
                <CommandItem className="grid grid-cols-1 gap-2">
                  {(items as AssetItem[]).map((item: AssetItem) => renderAssetItem(item))}
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};
