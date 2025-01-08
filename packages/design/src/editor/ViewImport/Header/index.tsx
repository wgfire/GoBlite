import { useEditor } from "@craftjs/core";
import { DeviceType } from "@/context/Provider";
import { useDesignContext } from "@/context/useDesignContext";
import { Button } from "@go-blite/shadcn";
import { Smartphone, Tablet, Monitor, ArrowLeft, ArrowRight, Eye, Download } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
} from "@go-blite/shadcn";
import { useSaveSchema } from "@/hooks/useSaveSchema";
import { Devices, languages } from "@/constant";

export const Header: React.FC = () => {
  const { enabled, actions, query } = useEditor(state => ({
    enabled: state.options.enabled
  }));

  const { updateContext, currentInfo, findSchema } = useDesignContext();
  const { saveCurrentSchema } = useSaveSchema();

  const handleDeviceChange = (newDevice: DeviceType) => {
    saveCurrentSchema();
    updateContext(draft => {
      const newDeviceData = draft.device.find(d => d.type === newDevice);
      draft.currentInfo.device = newDevice;
      draft.schema = newDeviceData?.languagePageMap[draft.currentInfo.language]?.schema;
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    saveCurrentSchema();
    updateContext(draft => {
      const currentDeviceData = draft.device.find(d => d.type === draft.currentInfo.device);
      const oldSchema = currentDeviceData?.languagePageMap[draft.currentInfo.language]?.schema;
      const newSchema = currentDeviceData?.languagePageMap[newLanguage]?.schema;
      draft.schema = newSchema ?? oldSchema;
      draft.currentInfo.language = newLanguage;
    });
  };
  /**
   * 将当前设备端的数据同步到其他设备端
   */
  const syncResponse = () => {
    const syncSchema = query.getSerializedNodes();
    const syncDevice = Devices.filter(d => d !== currentInfo.device) as DeviceType[];
    const syncLanguage = currentInfo.language;

    if (!syncSchema) return;

    syncDevice.forEach(device => {
      updateContext(draft => {
        const deviceData = draft.device.find(d => d.type === device);
        if (deviceData) {
          deviceData.languagePageMap[syncLanguage].schema = syncSchema;
        } else {
          draft.device.push({
            type: device,
            pageTemplate: draft.currentInfo.pageTemplate,
            languagePageMap: {
              [syncLanguage]: { schema: syncSchema }
            }
          });
        }
      });
    });
  };

  const DeviceButton = ({ device, icon: Icon }: { device: DeviceType; icon: React.ElementType }) => {
    const hasSchema = findSchema({ device });
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeviceChange(device)}
        className={`${currentInfo.device === device ? "bg-blue-100" : ""}`}
      >
        <Icon className={`h-4 w-4 ${hasSchema ? "text-blue-500" : "text-gray-500"}`} />
      </Button>
    );
  };
  const DownloadHandle = async () => {
    const result = await fetch("http://localhost:3001/api/build/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: "1228" })
    });
    console.log(result, "结果");
  };

  return (
    <div className="w-full h-12 z-50 relative px-4 flex items-center justify-between bg-card shadow-sm">
      {/* 左侧设备切换 */}
      <div className="space-x-2 items-center rounded-md p-[2px] px-4 shadow-md flex clear-child-borders">
        {/**多端数据同步 */}
        <Button variant="secondary" size="sm" onClick={() => syncResponse()}>
          同步
        </Button>
        <DeviceButton device="mobile" icon={Smartphone} />
        <DeviceButton device="tablet" icon={Tablet} />
        <DeviceButton device="desktop" icon={Monitor} />

        <div className="ml-10 clear-child-borders">
          <Select value={currentInfo.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="切换语言" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>切换语言</SelectLabel>
                {languages.map(lang => {
                  const hasSchema = findSchema({ device: currentInfo.device, language: lang.value });
                  return (
                    <SelectItem
                      key={lang.value}
                      value={lang.value}
                      className={`${hasSchema ? "text-blue-500" : "text-gray-500"}`}
                    >
                      {lang.label}
                    </SelectItem>
                  );
                })}
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
            saveCurrentSchema(true);
            actions.setOptions(options => (options.enabled = !enabled));
          }}
        >
          <Eye className="mr-1 h-3 w-3" />
          {enabled ? "预览" : "编辑"}
        </Button>
        <Button size="sm" onClick={DownloadHandle}>
          <Download className="mr-1 h-3 w-3" />
          下载
        </Button>
      </div>
    </div>
  );
};
