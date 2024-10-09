import { useState, useCallback, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@go-blite/shadcn/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@go-blite/shadcn/command";
import { Button } from "@go-blite/shadcn/button";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

interface TreeNode {
  label: string;
  value: string;
  children?: ReadonlyArray<TreeNode>;
}

interface CascadeMultiSelectProps {
  items?: ReadonlyArray<TreeNode>;
  values?: ReadonlyArray<ReadonlyArray<string>>;
  onSelect: (values: Array<Array<string>>) => void;
}

export function CascadeMultiSelect({ items = [], values = [], onSelect }: CascadeMultiSelectProps) {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayValue = useMemo(() => {
    if (values.length === 0) return "配置多语言及节点";
    return values.map(arr => arr[0]).join(", ");
  }, [values]);

  const findChildrenValues = useCallback(
    (value: string) => {
      return values
        .filter(arr => arr[0] === value)
        .map(arr => arr.slice(1))
        .flat();
    },
    [values]
  );

  const handleSelect = useCallback(
    (value: string, parentValue: string | null) => {
      const newValues = values.map(arr => [...arr]); // 深拷贝数组
      const parentIndex = newValues.findIndex(arr => arr[0] === parentValue);

      if (parentValue) {
        if (parentIndex !== -1) {
          const childIndex = newValues[parentIndex].indexOf(value);
          if (childIndex !== -1) {
            newValues[parentIndex] = newValues[parentIndex].filter(v => v !== value);
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
        const existingIndex = newValues.findIndex(arr => arr[0] === value);
        if (existingIndex !== -1) {
          newValues.splice(existingIndex, 1);
        } else {
          newValues.push([value]);
        }
      }
      console.log(newValues, "选中语言");
      onSelect(newValues);
    },
    [values, onSelect]
  );

  const isSelected = useCallback(
    (value: string, parentValue: string | null) => {
      if (parentValue) {
        return values.some(arr => arr[0] === parentValue && arr.includes(value));
      }
      return values.some(arr => arr[0] === value);
    },
    [values]
  );

  const TreeNodeComponent = useCallback(
    ({ nodes, parentValue }: { nodes: ReadonlyArray<TreeNode>; parentValue: string | null }) => {
      return (
        <>
          {nodes.map(node => (
            <CommandItem key={node.value}>
              <div className="flex items-center w-full">
                <div
                  className="flex items-center flex-1 mr-2"
                  onClick={e => {
                    handleSelect(node.value, parentValue);
                    e.stopPropagation();
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${isSelected(node.value, parentValue) ? "opacity-100" : "opacity-0"}`}
                  />
                  <span>{node.label}</span>
                </div>
                {node.children && node.children.length > 0 && (
                  <Popover
                    open={openPopover === node.value}
                    onOpenChange={open => setOpenPopover(open ? node.value : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="link"
                        size="sm"
                        className={`ml-auto ${findChildrenValues(node.value).length > 0 && "bg-blue-100"}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-0" align="start" data-side="bottom">
                      <Command>
                        <CommandInput placeholder="节点搜索" />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            {TreeNodeComponent({
                              nodes: node.children,
                              parentValue: node.value
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </CommandItem>
          ))}
        </>
      );
    },
    [findChildrenValues, handleSelect, isSelected, openPopover]
  );

  return (
    <Popover
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open);
        if (!open) setOpenPopover(null); // Reset openPopover when main Popover closes
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between" aria-haspopup="listbox">
          {getDisplayValue}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command className="border">
          <CommandInput placeholder="多语言搜索" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {/**不使用jsx组件调用 可以避免优化不当产生多个组件实例 */}
            <CommandGroup>{items && TreeNodeComponent({ nodes: items, parentValue: null })}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
