import { useEditor } from "@craftjs/core";
import { DeviceType } from "@/context/Provider";
import { useDesignContext } from "@/context/useDesignContext";
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

const languages = [
  { value: "en", label: "EN" },
  { value: "zh", label: "Zh" },
  { value: "vn", label: "VN" },
  { value: "kr", label: "KR" },
  { value: "id", label: "ID" }
];

export const Header: React.FC = () => {
  const { enabled, actions, query } = useEditor(state => ({
    enabled: state.options.enabled
  }));

  const { updateContext, currentInfo, findSchema } = useDesignContext();

  /**
   * 保存当前的schema信息
   */
  const saveCurrentSchema = () => {
    const currentSchema = query.getSerializedNodes();
    updateContext(draft => {
      const currentDevice = draft.device.find(device => device.type === draft.currentInfo.device);
      if (currentDevice) {
        currentDevice.languagePageMap[draft.currentInfo.language] = {
          ...currentDevice.languagePageMap[draft.currentInfo.language],
          schema: currentSchema
        };
      } else {
        // 第一次点击
        draft.device.push({
          type: draft.currentInfo.device,
          pageTemplate: draft.currentInfo.pageTemplate,
          languagePageMap: {
            [draft.currentInfo.language]: { schema: currentSchema }
          }
        });
      }
    });
  };

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
      draft.currentInfo.language = newLanguage;
      draft.schema = currentDeviceData?.languagePageMap[newLanguage]?.schema;
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

  return (
    <div className="w-full h-12 z-50 relative px-4 flex items-center justify-between bg-card shadow-sm">
      {/* 左侧设备切换 */}
      <div className="space-x-2 items-center rounded-md p-[2px] shadow-md flex clear-child-borders">
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
            saveCurrentSchema();
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
