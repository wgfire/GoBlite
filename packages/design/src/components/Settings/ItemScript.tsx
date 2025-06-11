import React, { useState } from "react";
import { Button } from "@go-blite/shadcn";
import { Label } from "@go-blite/shadcn";
import { get, set } from "lodash-es";
import { useSettings } from "./Context";
import CodeEditorDialog from "@/components/CodeEditor/CodeEditorDialog";
import { defaultProps } from "./types";

export interface ItemScriptProps<T> extends defaultProps<T> {
  /** 编辑器标题 */
  title?: string;
  /** 初始语言，默认 javascript */
  language?: "javascript" | "css" | "html" | "json";
  /** 按钮文案 */
  buttonText?: string;
  /** 标签文案 */
  label?: React.ReactNode;
}

/**
 * 用于在 Settings 面板中编辑脚本字符串，结果直接写入指定 propKey。
 * 依赖 CodeEditorDialog 组件。
 */
export function ItemScript<T>({
  propKey,
  title = "编辑脚本",
  language = "javascript",
  buttonText = "编写脚本",
  label = "脚本",
  className
}: ItemScriptProps<T>) {
  const { value, setProp } = useSettings<T>();
  const scriptCfg = propKey ? (get(value, propKey) as any) : undefined;
  const scriptValue = scriptCfg?.type === "script" ? (scriptCfg.value as string) : "";
  const [open, setOpen] = useState(false);
  const hasScript = Boolean(scriptValue && scriptValue.trim().length);

  const handleConfirm = (code: string) => {
    if (propKey) {
      setProp(p => {
        set(p as object, propKey as string, { type: "script", name: "脚本", value: code });
      });
    }
    setOpen(false);
  };

  return (
    <div className={className ?? "space-y-2"}>
      {label && (
        <div className="flex items-center gap-2">
          <Label className="text-sm text-gray-400">{label}</Label>
          {hasScript && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 text-destructive"
              title="清除脚本"
              onClick={() => {
                if (propKey) {
                  setProp(p => {
                    set(p as object, propKey as string, undefined);
                  });
                }
              }}
            >
              ×
            </Button>
          )}
        </div>
      )}
      <Button
        variant={hasScript ? "default" : "outline"}
        className={hasScript ? "bg-green-500 hover:bg-green-600 text-white" : undefined}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {hasScript ? "编辑脚本" : buttonText}
      </Button>
      <CodeEditorDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        initialValue={scriptValue ?? ""}
        language={language}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
