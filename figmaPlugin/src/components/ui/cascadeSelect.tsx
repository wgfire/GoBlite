"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function CascadeSelect() {
  const Langue = [
    { value: "ZH", label: "中文" },
    { value: "EN", label: "英文" },
    { value: "KR", label: "韩文" },
    { value: "TH", label: "泰文" },
    { value: "VN", label: "越南文" },
    { value: "MY", label: "马来文" },
    { value: "IN", label: "印尼文" },
    { value: "ID", label: "印度文" },
    { value: "PH", label: "菲律宾文" },
    { value: "PT", label: "葡萄牙" },
  ];
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const toggleItem = React.useCallback((item: string) => {
    setSelectedItems((current) => {
      const safeCurrentArray = Array.isArray(current) ? current : [];
      return safeCurrentArray.includes(item) ? safeCurrentArray.filter((i) => i !== item) : [...safeCurrentArray, item];
    });
  }, []);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="relative w-full">
        <Button variant="outline" role="combobox" aria-expanded={open} className="text-ellipsis justify-between w-full">
          {selectedItems.length > 0 ? (
            <div className="w-full text-ellipsis overflow-hidden text-left">
              {selectedItems.map((item) => {
                return (
                  <Badge className="mr-2" key={item}>
                    {item}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span className="w-full opacity-50 text-left">支持按不同语言组合界面</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command className="w-full">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {Langue.map((fruit) => (
                <CommandItem key={fruit.value} onSelect={() => toggleItem(fruit.value)}>
                  <Check className={cn("mr-2 h-4 w-4", selectedItems.includes(fruit.value) ? "opacity-100" : "opacity-0")} />
                  {fruit.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
