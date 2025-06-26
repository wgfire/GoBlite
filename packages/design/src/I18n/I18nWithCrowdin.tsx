import React, { useState } from "react";
import { ExportI18nData } from "./I18nManager";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@go-blite/shadcn";

import { Copy, Check, ChevronDown, Upload, Download, Loader2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@go-blite/shadcn";
import clsx from "clsx";
import { useDesignContext } from "@/context/useDesignContext";
import { languages } from "../constant";
import { BusinessEvents } from "@/utils";

interface I18nExportWithCrowdinProps {
  data: ExportI18nData;
}

export const I18nWithCrowdin: React.FC<I18nExportWithCrowdinProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const { currentInfo } = useDesignContext();

  // Crowdin配置
  const [languageId, setLanguageId] = useState(currentInfo?.language);

  // 格式化JSON数据
  const formattedJson = JSON.stringify(data, null, 2);

  // 下载翻译
  const [selectedLanguage, setSelectedLanguage] = useState(currentInfo?.language);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
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
    a.download = selectedLanguage + "-translations.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 上传翻译到Crowdin
  const handleUpload = async () => {
    try {
      setUploadLoading(true);
      // 添加回调函数作为第三个参数
      BusinessEvents.emit(
        "onI18nUpload",
        {
          i18nData: data
        },
        (success, result) => {
          setUploadLoading(false);
          if (success) {
            console.log("上传成功，返回结果:", result);
          } else {
            console.error("上传失败，错误信息:", result);
          }
        }
      );
    } catch (err) {
      console.error("上传失败:", err);
    }
  };
  // 处理下载
  const handleDownloadTranslation = async () => {
    if (!selectedLanguage) {
      console.error("请先选择一个需要下载的语言");
      return;
    }
    try {
      setDownloadLoading(true);
      BusinessEvents.emit(
        "onI18nDownload",
        {
          language: selectedLanguage
        },
        (success, result) => {
          setDownloadLoading(false);
          if (success) {
            console.log("下载成功，返回结果:", result);
          } else {
            console.error("下载失败，错误信息:", result);
          }
        }
      );
    } catch (err) {
      console.error("下载失败:", err);
    }
  };
  return (
    <div className="h-full space-y-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md px-[10px]">
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
              <TabsTrigger value="crowdin">上传翻译</TabsTrigger>
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
              {/* <div className="space-y-2">
                <label className="text-sm font-medium">项目ID</label>
                <Input value={projectId} onChange={e => setProjectId(e.target.value)} placeholder="输入Crowdin项目ID" />
              </div> */}

              <div className="space-y-2">
                <label className="text-sm font-medium">语言ID</label>
                <Input
                  value={languageId}
                  readOnly
                  onChange={e => setLanguageId(e.target.value)}
                  placeholder="例如: zh-CN"
                />
              </div>

              <Button onClick={handleUpload} className="w-full" disabled={uploadLoading}>
                {uploadLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {uploadLoading ? "上传中..." : "上传翻译"}
              </Button>
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>

      <div className="space-y-4 rounded-md border p-4">
        <h4 className="text-sm font-medium">翻译数据下载</h4>
        <p className="text-sm text-muted-foreground">从 Crowdin 下载指定语言的最新翻译文件。</p>
        <div className="flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择语言" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang: { value: string; label: string }) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTranslation}
            disabled={!selectedLanguage || downloadLoading}
          >
            {downloadLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {downloadLoading ? "下载中..." : "下载"}
          </Button>
        </div>
      </div>
    </div>
  );
};
