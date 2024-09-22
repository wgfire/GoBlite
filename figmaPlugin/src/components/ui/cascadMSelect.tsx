import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];
}

interface CascadingMultiSelectProps {
  items?: TreeNode[];
  values?: string[][];
  onSelect: (values: string[][]) => void;
}

export default function CascadingMultiSelect({ items = [], values = [], onSelect }: CascadingMultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState<string[][]>(values || []);
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return "Select items...";
    return selectedValues.map((arr) => arr[0]).join(", ");
  };
  useEffect(() => {
    setSelectedValues(values || []);
  }, [values]);

  const handleSelect = (value: string, parentValue: string | null) => {
    let newValues = [...selectedValues];

    if (parentValue) {
      const parentIndex = newValues.findIndex((arr) => arr[0] === parentValue);
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
    onSelect(newValues);
  };

  const isSelected = (value: string, parentValue: string | null) => {
    if (parentValue) {
      return selectedValues.some((arr) => arr[0] === parentValue && arr.includes(value));
    }
    return selectedValues.some((arr) => arr[0] === value);
  };

  const renderTreeNodes = (nodes: TreeNode[], parentValue: string | null = null) => {
    return nodes.map((node) => (
      <CommandItem key={node.value} onSelect={() => handleSelect(node.value, parentValue)}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Check className={`mr-2 h-4 w-4 ${isSelected(node.value, parentValue) ? "opacity-100" : "opacity-0"}`} />
            <span>{node.label}</span>
          </div>
          {node.children && node.children.length > 0 && (
            <Popover open={openPopover === node.value} onOpenChange={(open) => setOpenPopover(open ? node.value : null)}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0" align="start">
                <Command>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>{renderTreeNodes(node.children, node.value)}</CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CommandItem>
    ));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-between">
          {getDisplayValue()}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandGroup>{items && items.length > 0 ? renderTreeNodes(items) : <CommandEmpty>No items to display</CommandEmpty>}</CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function CascadingMultiSelectWrapper({ items = [], onSelect }: CascadingMultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState<string[][]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (values: string[][]) => {
    setSelectedValues(values);
    onSelect(values);
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return "Select items...";
    return selectedValues.map((arr) => arr[0]).join(", ");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-between">
          {getDisplayValue()}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <CascadingMultiSelect items={items} values={selectedValues} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
