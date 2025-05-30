import React, { useMemo } from "react";
import { useDesignContext } from "@/context";
import { Devices } from "@/context/Provider";
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

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator
} from "@go-blite/shadcn";
import { PanelsRightBottom, LucideHeading5 } from "lucide-react";

// 定义模板项的接口
interface TemplateItem {
  name: string;
  devices: Devices;
  icon?: React.ReactNode;
}

// 定义模板组的接口
interface TemplateGroup {
  type: string;
  list: TemplateItem[];
}
export const Layout: React.FC = () => {
  const context = useDesignContext();
  const { currentInfo, templates = [], updateContext } = context;
  console.log(templates, "layout");
  // 为每个模板项添加图标
  const templatesWithIcons = useMemo(() => {
    return templates.map((group: TemplateGroup) => ({
      ...group,
      list: group.list.map((item: TemplateItem) => ({
        ...item,
        icon: <LucideHeading5 /> // 这里可以根据模板类型设置不同图标
      }))
    }));
  }, [templates]);

  const clickTemplate = (item: TemplateItem) => {
    const schema = item.devices.find(el => el.type === currentInfo.device)?.languagePageMap[currentInfo.language]
      ?.schema;
    console.log("点击的模版数据", schema);
    updateContext(draft => {
      draft.device = JSON.parse(JSON.stringify(item.devices));
      draft.schema = schema ? JSON.parse(JSON.stringify(schema)) : schema;
    });

    console.log("模板点击更新完成", new Date().toISOString());
  };

  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="flex items-center justify-center">
                <PanelsRightBottom className="w-4 h-4 mr-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">页面模版</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent side="right" className="translate-x-2 translate-y-2">
        <Command className="rounded-lg border">
          <CommandInput placeholder="模版搜索" />
          <CommandList className="max-h-[60vh] overflow-y-auto">
            <CommandEmpty>没有找到模板</CommandEmpty>

            {templatesWithIcons.length > 0 ? (
              templatesWithIcons.map((group: TemplateGroup, groupIndex: number) => (
                <React.Fragment key={`group-${groupIndex}-${group.type}`}>
                  <CommandGroup heading={group.type}>
                    <CommandItem>
                      <Card className="cursor-pointer flex flex-wrap gap-2">
                        {group.list.map((item: TemplateItem, itemIndex: number) => (
                          <CardContent
                            onClick={() => clickTemplate(item)}
                            key={`template-${groupIndex}-${itemIndex}`}
                            className="p-2 flex flex-col items-center justify-center gap-2 max-w-[80px]"
                          >
                            <div>{item.icon}</div>
                            <span className="text-xs mt-1 text-center truncate w-full text-ellipsis">{item.name}</span>
                          </CardContent>
                        ))}
                      </Card>
                    </CommandItem>
                  </CommandGroup>
                  {groupIndex < templatesWithIcons.length - 1 && <CommandSeparator />}
                </React.Fragment>
              ))
            ) : (
              <CommandGroup heading="模版">
                <CommandItem>
                  <div className="p-4 text-center text-gray-500">暂无可用模板</div>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
