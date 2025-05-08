import "./App.css";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@go-blite/shadcn/tabs";
import { Button } from "@go-blite/shadcn/button";
import { ExportService, ServiceData } from "./components/module/exportService";
import { ExportForm, FormValues } from "./components/module/exportForm";
import { usePluginContext } from "./context/usePluginContext";
import { DeviceType, Language, PageType } from "./components/module/exportForm/types";
import { debounce } from "lodash-es";
import { ExportPreview } from "./components/module/exportPreview";
import { ExportPreviewType } from "./components/module/Preview";
import { writeTextToClipboard } from "./lib/clipboard";
import ParseHandler from "./components/ParseHandler";

export interface initDataProps {
  fileKey: string;
  id: string;
  name: string;
  width: number;
  height: number;
  allChildren?: { label: string; value: string }[];
  previewData?: { label: string; value: string }[];
}
const defaultValues: FormValues = {
  id: "",
  name: "",
  format: "PNG",
  devices: [
    {
      type: DeviceType.PC,
      pageType: PageType.StaticImage,
      languagePageMap: {}
    }
  ]
};
export default function App() {
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [activeTab, setActiveTab] = useState("config");
  const [_pageData, setPageData] = useState<initDataProps>({ id: "", name: "", width: 0, height: 0, fileKey: "" });
  const [previewData, setPreviewData] = useState<ExportPreviewType[]>();
  const [formValues, setFormValues] = useState<FormValues>(defaultValues);
  const [previewTab, setPreviewTab] = useState({
    device: formValues.devices[0].type,
    language: Language.EN
  });
  const { setState } = usePluginContext();

  const exportHandel = () => {
    if (serviceData?.address) {
      window.open(serviceData?.address + "/" + formValues.id);
    } else {
      alert("请先配置线上服务");
    }
  };
  console.log(formValues, "formValues", _pageData.fileKey);
  const initTakeOverData = (data: initDataProps) => {
    const devices = defaultValues.devices;
    devices[0].languagePageMap[Language.EN] = {
      ids: ["EN", ...data.previewData!.map(el => el.value)],
      nodes: [],
      schema: {}
    };
    setPageData(data);
    setFormValues({ ...defaultValues, id: data.id, name: data.name, devices: devices });
    setState(prev => ({ ...prev, nodes: data.allChildren! }));
  };
  const onmessage = () => {
    window.onmessage = event => {
      const { type, data } = event.data.pluginMessage;
      if (type === "init") {
        initTakeOverData(data);
      }
      if (type === "FigmaPreview") {
        setPreviewData(data);
        const current = formValues.devices.find(el => el.type === previewTab.device)!;
        const key = previewTab.language ?? (Object.keys(current!.languagePageMap)[0] as Language);
        current.languagePageMap[key]!.nodes = data;
      }
      if (type === "copyClipboard") {
        writeTextToClipboard(data);
      }
    };
  };
  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "init" } }, "*");
    onmessage();
  }, []);

  const previewChange = debounce((type: DeviceType, _language?: Language) => {
    const current = formValues.devices.find(el => el.type === type);
    const key = _language ?? (Object.keys(current!.languagePageMap)[0] as Language);

    const nodeIds = current?.languagePageMap[key]?.ids?.slice(1);
    console.log(type, "type", nodeIds);
    if (nodeIds) {
      setPreviewTab({
        device: type,
        language: key
      });
      parent.postMessage({ pluginMessage: { type: "FigmaPreview", data: nodeIds } }, "*");
    } else {
      console.log("无多语言");
    }
  }, 500);

  // 解析Figma节点为HTML
  const parseToHtml = () => {
    if (_pageData.id) {
      parent.postMessage({ pluginMessage: { type: "parseToHtml", data: [_pageData.id] } }, "*");
    }
  };

  // 解析Figma节点为JSON
  const parseToJson = () => {
    if (_pageData.id) {
      parent.postMessage({ pluginMessage: { type: "parseToJson", data: [_pageData.id] } }, "*");
    }
  };

  // 导出节点中的所有图像
  const exportImages = () => {
    if (_pageData.id) {
      parent.postMessage({ pluginMessage: { type: "exportImages", data: [_pageData.id] } }, "*");
    }
  };

  return (
    <div className="flex bg-background">
      {/* 添加ParseHandler组件处理复制到剪贴板等操作 */}
      <ParseHandler />

      <textarea id="clipboard-helper" style={{ position: "absolute", left: "-9999px" }}></textarea>
      {/* Sidebar */}
      <div className="w-64 border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Go Blite Figma </h2>
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={parseToHtml}>
                解析为HTML
              </Button>
              <Button variant="outline" onClick={parseToJson}>
                解析为JSON
              </Button>
              <Button variant="outline" onClick={exportImages}>
                导出图像
              </Button>
              <Button onClick={exportHandel}>导出</Button>
            </div>
          </div>

          {/**config */}
          {activeTab === "config" && (
            <>
              {
                <ExportForm
                  defaultValues={defaultValues}
                  values={formValues}
                  onChange={data => {
                    console.log(data, "表单数据");
                    setFormValues(data);
                  }}
                ></ExportForm>
              }
              <ExportPreview
                previewData={previewData}
                onChange={previewChange}
                currentTab={previewTab.device}
                devices={formValues.devices}
              ></ExportPreview>
            </>
          )}

          {activeTab === "service" && (
            <ExportService
              onServiceDataChange={data => {
                console.log(data);
                setServiceData(data);
              }}
            ></ExportService>
          )}
        </div>
      </div>
    </div>
  );
}
