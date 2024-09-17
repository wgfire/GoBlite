"use client";

import * as React from "react";
import { CalendarIcon, Check, ChevronsUpDown, RocketIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FaceIcon, PersonIcon, EnvelopeClosedIcon, GearIcon } from "@radix-ui/react-icons";

export function CascadeSelect() {
  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
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
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {selectedItems.length > 0 ? `${selectedItems.length} selected` : "Select fruits..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {fruits.map((fruit) => (
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
