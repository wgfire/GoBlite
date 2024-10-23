import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@go-blite/shadcn";
import { Selectors } from "./Selectors";
import { Assets } from "./Assets";

export type SelectType = "selectors" | "assets";

export const Toolbox: React.FC = () => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));

  const [selected, setSelected] = useState<SelectType>("selectors");

  if (!enabled) return null;

  return (
    <div
      className="h-full flex flex-col bg-white shadow-md min-w-[150px] px-4 space-y-2 flex-shrink-0 flex-grow-[0] transition-all
        duration-300"
    >
      <div className="h-12 flex items-center">
        <Select value={selected} defaultValue="selectors" onValueChange={value => setSelected(value as SelectType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="切换组件/资源" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>切换组件/资源</SelectLabel>
              <SelectItem value="selectors">组件</SelectItem>
              <SelectItem value="assets">资源</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selected === "selectors" ? <Selectors /> : <Assets />}
    </div>
  );
};
