import { useState, useEffect, useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];
}

interface CascadeMultiSelectProps {
  items?: TreeNode[];
  values?: string[][];
  onSelect: (current: string[], values: string[][]) => void;
}

export function CascadeMultiSelect({ items = [], values = [], onSelect }: CascadeMultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState<string[][]>(values || []);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    //setSelectedValues(values || []);
  }, [values]);

  const getDisplayValue = useCallback(() => {
    if (selectedValues.length === 0) return "配置多语言及节点";
    return selectedValues.map((arr) => arr[0]).join(", ");
  }, [selectedValues]);

  const findChildrenValues = useCallback(
    (value: string) => {
      return selectedValues
        .filter((arr) => arr[0] === value)
        .map((arr) => arr.slice(1))
        .flat();
    },
    [selectedValues]
  );

  const handleSelect = useCallback(
    (value: string, parentValue: string | null) => {
      const newValues = [...selectedValues];
      const parentIndex = newValues.findIndex((arr) => arr[0] === parentValue);
      if (parentValue) {
        if (parentIndex !== -1) {
          const childIndex = newValues[parentIndex].indexOf(value);
          if (childIndex !== -1) {
            newValues[parentIndex] = newValues[parentIndex].filter((v) => v !== value);
            if (newValues[parentIndex].length === 1) {
              newValues.splice(parentIndex, 1);
            }
          } else {
            newValues[parentIndex].push(value);
          }
        } else {
          newValues.push([parentValue, value]);
        }
      } else {
        const existingIndex = newValues.findIndex((arr) => arr[0] === value);
        if (existingIndex !== -1) {
          newValues.splice(existingIndex, 1);
        } else {
          newValues.push([value]);
        }
      }

      setSelectedValues(newValues);
      const current = newValues[parentIndex];
      onSelect(current, newValues);
    },
    [selectedValues, onSelect]
  );

  const isSelected = useCallback(
    (value: string, parentValue: string | null) => {
      if (parentValue) {
        return selectedValues.some((arr) => arr[0] === parentValue && arr.includes(value));
      }
      return selectedValues.some((arr) => arr[0] === value);
    },
    [selectedValues]
  );

  const renderTreeNodes = useCallback(
    (nodes: TreeNode[], parentValue: string | null = null) => {
      return nodes.map((node) => (
        <CommandItem
          key={node.value}
          // onSelect={(e) => {
          //   console.log("点击", e);
          //   handleSelect(node.value, parentValue);
          // }}
        >
          <div className="flex items-center  w-full">
            <div
              className="flex items-center flex-1 mr-2"
              onClick={(e) => {
                handleSelect(node.value, parentValue);
                e.stopPropagation();
              }}
            >
              <Check className={`mr-2 h-4 w-4 ${isSelected(node.value, parentValue) ? "opacity-100" : "opacity-0"}`} />
              <span>{node.label}</span>
            </div>
            {node.children && node.children.length > 0 && (
              <Popover open={openPopover === node.value} onOpenChange={(open) => setOpenPopover(open ? node.value : null)}>
                <PopoverTrigger asChild>
                  <Button variant="link" size="sm" className={`ml-auto ${findChildrenValues(node.value).length > 0 && "bg-blue-100"}`}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-0" align="start" data-side="bottom">
                  <Command>
                    <CommandInput placeholder="节点搜索" />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>{renderTreeNodes(node.children, node.value)}</CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CommandItem>
      ));
    },
    [findChildrenValues, handleSelect, isSelected, openPopover]
  );

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setOpenPopover(null); // Reset openPopover when main Popover closes
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between" aria-haspopup="listbox">
          {getDisplayValue()}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command className="border">
          <CommandInput placeholder="多语言搜索" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>{items && items.length > 0 && renderTreeNodes(items)}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
