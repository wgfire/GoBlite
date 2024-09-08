import "./App.css";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "./components/ui/button";
import { ExportService } from "./components/module/exportService";

export default function App() {
  const [activeTab, setActiveTab] = useState("config");

  const exportHandel = () => {
    window.open("https://www.bilibili.com/?spm_id_from=333.1007.0.0");
  };

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "init" } }, "*");
    window.onmessage = (event) => {
      console.log(event, "收到消息");
      const { type, data } = event.data.pluginMessage;
      if (type === "init") {
        console.log(`Figma Says: ${data}`);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Go Blity Figma </h2>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">导出配置</TabsTrigger>
              <TabsTrigger value="service">导出服务</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{activeTab === "config" ? "配置信息" : "配置服务"}</h1>
            {<Button onClick={exportHandel}>导出</Button>}
          </div>

          {/**config */}
          {activeTab === "config" && (
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 w-full col-start-1 col-span-2">
                  <Label htmlFor="pageName">页面ID</Label>
                  <Input id="pageId" value={5555} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pageName">页面名称</Label>
                  <Input id="pageName" placeholder="Enter page name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pageTypes">页面类型</Label>
                  <Input id="pageName" placeholder="Enter page name" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">图片配置</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">导出格式</Label>

                    {/* <Select>
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="svg">SVG</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select> */}
                  </div>
                </div>
              </div>
            </form>
          )}

          {activeTab === "service" && (
            <ExportService
              onServiceDataChange={(data) => {
                console.log(data);
              }}
            ></ExportService>
          )}
        </div>
      </div>
    </div>
  );
}
