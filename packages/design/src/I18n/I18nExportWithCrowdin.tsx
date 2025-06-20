import React, { useState } from "react";
import { ExportI18nData } from "./I18nManager";
import { Button, Input, Tabs, TabsContent, TabsList, TabsTrigger } from "@go-blite/shadcn";
import { Copy, Check, ChevronDown, Upload, Loader2, AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@go-blite/shadcn";
import clsx from "clsx";
import { useCrowdinUpload } from "./crowdin/hooks/useCrowdinUpload";

interface I18nExportWithCrowdinProps {
  data: ExportI18nData;
}

export const I18nExportWithCrowdin: React.FC<I18nExportWithCrowdinProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  // Crowdin配置
  const [fileName, setFileName] = useState("translations.json");
  const [projectId, setProjectId] = useState("");
  const [organization, setOrganization] = useState("");

  // 格式化JSON数据
  const formattedJson = JSON.stringify(data, null, 2);

  // 复制到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 下载JSON文件
  const handleDownload = () => {
    const blob = new Blob([formattedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 使用Crowdin上传hook
  const { uploadTranslation, isUploading, uploadError, uploadResult } = useCrowdinUpload();

  // 上传到Crowdin
  const handleUpload = async () => {
    if (!projectId) {
      alert("请填写项目ID");
      return;
    }

    try {
      await uploadTranslation(fileName, data);
    } catch (error) {
      // 错误已在hook中处理
    }
  };

  return (
    <div className="border rounded-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className="flex w-full items-center justify-between p-2 text-sm font-medium"
          onClick={e => {
            // 阻止事件冒泡，防止触发父级Collapsible
            e.stopPropagation();
          }}
        >
          <div className="flex items-center">
            <span>翻译数据导出</span>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 mr-2"
              onClick={e => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <ChevronDown className={clsx("h-4 w-4 transition-transform", isOpen ? "transform rotate-180" : "")} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">预览</TabsTrigger>
              <TabsTrigger value="crowdin">Crowdin上传</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <div className="p-4 bg-gray-50 max-h-60 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">{formattedJson}</pre>
              </div>
              <div className="flex justify-end p-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  下载JSON文件
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="crowdin" className="space-y-4 p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">文件名</label>
                <Input value={fileName} onChange={e => setFileName(e.target.value)} placeholder="translations.json" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">项目ID</label>
                <Input value={projectId} onChange={e => setProjectId(e.target.value)} placeholder="输入Crowdin项目ID" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">组织名称 (可选)</label>
                <Input
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  placeholder="输入Crowdin组织名称"
                />
              </div>

              <Button onClick={handleUpload} disabled={isUploading || !projectId} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    上传到Crowdin
                  </>
                )}
              </Button>

              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">上传失败</p>
                    <p className="text-sm text-red-700">{uploadError.message}</p>
                  </div>
                </div>
              )}

              {uploadResult && !uploadError && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">上传成功</p>
                    <p className="text-sm text-green-700">文件已成功上传到Crowdin项目</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
