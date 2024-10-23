import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { Button } from "@go-blite/shadcn";
import { Smartphone, Tablet, Monitor, ArrowLeft, ArrowRight, Eye, Upload } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
} from "@go-blite/shadcn";

export const Header: React.FC = () => {
  const { enabled, actions, query } = useEditor(state => ({
    enabled: state.options.enabled
  }));

  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

  const handleDeviceChange = (newDevice: "mobile" | "tablet" | "desktop") => {
    setDevice(newDevice);
    // 这里可以添加切换设备视图的逻辑
  };

  return (
    <div className="w-full h-12 z-50 relative px-4 flex items-center justify-between bg-card shadow-sm">
      {/* 左侧设备切换 */}
      <div className="space-x-2 items-center rounded-md p-[2px] shadow-md flex clear-child-borders">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeviceChange("mobile")}
          className={device === "mobile" ? "bg-blue-100" : ""}
        >
          <Smartphone className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeviceChange("tablet")}
          className={device === "tablet" ? "bg-blue-100" : ""}
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeviceChange("desktop")}
          className={device === "desktop" ? "bg-blue-100" : ""}
        >
          <Monitor className="h-4 w-4" />
        </Button>

        <div className="ml-10 clear-child-borders">
          <Select defaultValue="zh" autoComplete="on">
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="切换语言" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>切换语言</SelectLabel>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="zh">zh</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 中间回退前进操作 */}
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={() => actions.history.undo()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => actions.history.redo()}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 右侧预览和部署按钮 */}
      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={() => {
            console.log("enabled", query.getSerializedNodes());
            actions.setOptions(options => (options.enabled = !enabled));
          }}
        >
          <Eye className="mr-1 h-3 w-3" />
          {enabled ? "预览" : "编辑"}
        </Button>
        <Button size="sm">
          <Upload className="mr-1 h-3 w-3" />
          部署
        </Button>
      </div>
    </div>
  );
};
