import "./App.css";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./components/ui/button";
import { ExportService, ServiceData } from "./components/module/exportService";
import { ExportForm, FormValues } from "./components/module/exportForm";
import { usePluginContext } from "./context";
import { DeviceType, Language, PageType } from "./components/module/exportForm/types";
import { debounce } from "lodash-es";
import { ExportPreview } from "./components/module/exportPreview";
import { ExportPreviewType } from "./components/module/Preview";
export interface initDataProps {
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
      languagePageMap: {},
    },
  ],
};
export default function App() {
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [activeTab, setActiveTab] = useState("config");
  const [_pageData, setPageData] = useState<initDataProps>({ id: "", name: "", width: 0, height: 0 });
  const [previewData, setPreviewData] = useState<ExportPreviewType[]>();
  const [formValues, setFormValues] = useState<FormValues>(defaultValues);
  const [previewTab, setPreviewTab] = useState({
    device: formValues.devices[0].type,
    language: Language.EN,
  });
  const { setState } = usePluginContext();

  const exportHandel = () => {
    if (serviceData?.address) {
      window.open(serviceData?.address + "/" + formValues.id);
    } else {
      alert("请先配置线上服务");
    }
  };
  console.log(formValues, "formValues");
  const initTakeOverData = (data: initDataProps) => {
    const devices = defaultValues.devices;
    devices[0].languagePageMap[Language.EN] = {
      ids: ["EN", ...data.previewData!.map((el) => el.value)],
      nodes: [],
      schema: {},
    };
    setPageData(data);
    setFormValues({ ...defaultValues, id: data.id, name: data.name, devices: devices });
    setState((prev) => ({ ...prev, nodes: data.allChildren! }));
  };
  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "init" } }, "*");
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage;
      if (type === "init") {
        initTakeOverData(data);
      }
      if (type === "FigmaPreview") {
        setPreviewData(data);
        const current = formValues.devices.find((el) => el.type === previewTab.device)!;
        const key = previewTab.language ?? (Object.keys(current!.languagePageMap)[0] as Language);
        current.languagePageMap[key]!.nodes = data;
      }
    };
  }, []);

  const previewChange = debounce((type: DeviceType, _language?: Language) => {
    const current = formValues.devices.find((el) => el.type === type);
    const key = _language ?? (Object.keys(current!.languagePageMap)[0] as Language);

    const nodeIds = current?.languagePageMap[key]?.ids?.slice(1);
    console.log(type, "type", nodeIds);
    if (nodeIds) {
      setPreviewTab({
        device: type,
        language: key,
      });
      parent.postMessage({ pluginMessage: { type: "FigmaPreview", data: nodeIds } }, "*");
    } else {
      console.log("无多语言");
    }
  }, 500);

  return (
    <div className="flex h-screen bg-background">
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
            {<Button onClick={exportHandel}>导出</Button>}
          </div>

          {/**config */}
          {activeTab === "config" && (
            <>
              {
                <ExportForm
                  defaultValues={defaultValues}
                  values={formValues}
                  onChange={(data) => {
                    console.log(data, "表单数据");
                    setFormValues(data);
                  }}
                ></ExportForm>
              }
              {/* <div className="space-y-4">
                <h3 className="text-lg font-semibold">导出预览</h3>
                <Tabs
                  value={previewTab.device}
                  onValueChange={(e) => {
                    const type = e as unknown as DeviceType;
                    previewChange(type);
                  }}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    {formValues.devices.map((el, index) => {
                      return (
                        <TabsTrigger key={el.type} value={el.type} className="space-x-2">
                          <span>{"页面配置-" + (index + 1)}</span>
                          <Select key={el.type} value={previewTab.language} onValueChange={(e) => previewChange(el.type, e as unknown as Language)}>
                            <SelectTrigger className="border-solid">
                              <SelectValue placeholder="预览语言" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(el.languagePageMap).map((key) => {
                                return (
                                  <SelectItem value={key} key={key}>
                                    {key}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">{previewData && <Preview data={previewData} width={400}></Preview>}</div>
                </div>
              </div> */}
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
              onServiceDataChange={(data) => {
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
