import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@go-blite/shadcn/dialog";
import { Button } from "@go-blite/shadcn/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@go-blite/shadcn/tabs";

import CodeEditor from "./CodeEditor";
import { CodeEditorDialogProps, LanguageType } from "./types";

/**
 * 代码编辑器弹窗组件
 */
const CodeEditorDialog: React.FC<CodeEditorDialogProps> = ({
  open,
  onOpenChange,
  title = "编辑代码",
  initialValue = "",
  language = "javascript",
  theme = "light",
  onConfirm,
  onCancel,
  globals = {},
  customApis
}) => {
  // 当前编辑的代码
  const [code, setCode] = useState(initialValue);
  // 当前选中的语言
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>(language);

  // 处理确认
  const handleConfirm = () => {
    onConfirm?.(code);
    onOpenChange(false);
  };

  // 处理取消
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  // 处理语言切换
  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value as LanguageType);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] code-editor-dialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4 w-full">
          <Tabs
            defaultValue={currentLanguage}
            value={currentLanguage}
            onValueChange={handleLanguageChange}
            className="w-full"
          >
            <TabsList className="mb-2">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            <TabsContent value={currentLanguage} className="mt-0 w-full">
              <div className="w-full overflow-hidden border rounded-md code-editor-wrapper">
                <CodeEditor
                  language={currentLanguage}
                  initialValue={code}
                  theme={theme}
                  onChange={setCode}
                  height="400px"
                  autoFocus
                  globals={globals}
                  customApis={customApis}
                  className="w-full"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleConfirm}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CodeEditorDialog;
