"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface CascadeSelectProps {
  value?: string[];
  items: { label: string; value: string | number | boolean }[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}
export const CascadeSelect: React.FC<CascadeSelectProps> = (props) => {
  const { items = [], onChange, placeholder = "请选择", value } = props;
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<string[]>(value || []);

  React.useEffect(() => {
    setSelectedItems(value || []);
  }, [value]);

  const toggleItem = React.useCallback(
    (item: string) => {
      setSelectedItems((current) => {
        const safeCurrentArray = Array.isArray(current) ? current : [];
        const result = safeCurrentArray.includes(item) ? safeCurrentArray.filter((i) => i !== item) : [...safeCurrentArray, item];
        onChange?.(result);
        return result;
      });
    },
    [onChange]
  );
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
            <span className="w-full opacity-50 text-left">{placeholder}</span>
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
              {items.map((fruit) => (
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
};
