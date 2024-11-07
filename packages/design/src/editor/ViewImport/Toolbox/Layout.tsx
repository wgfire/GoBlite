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
import { LayoutPanelLeft, PanelsRightBottom } from "lucide-react";

export const Layout: React.FC = () => {
  const template = [
    {
      type: "static-download",
      name: "落地页注册",
      icon: <LayoutPanelLeft />
    }
  ];

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
            <CommandEmpty>No results found.</CommandEmpty>

            <>
              <CommandGroup heading={"模版"}>
                <CommandItem>
                  <Card className="cursor-move flex gap-2">
                    {template.map(item => {
                      return (
                        <CardContent
                          key={item.type}
                          className="p-2 flex flex-col items-center justify-center gap-2 max-w-[80px]"
                        >
                          <div>{item.icon}</div>
                          <span className="text-xs mt-1 text-center truncate w-full text-ellipsis">{item.name}</span>
                        </CardContent>
                      );
                    })}
                  </Card>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
