import { useEditor } from "@craftjs/core";
import { DeviceType } from "@/context/Provider";
import { useDesignContext } from "@/context/useDesignContext";
import { Button } from "@go-blite/shadcn";
import { useToast } from "@go-blite/shadcn/hooks/use-toast";
import { useSchemaOperations } from "@/hooks/useSchemaOperations";
import { DEVICES, languages } from "@/constant";
import { useCallback, useState } from "react";
import { BusinessEvents } from "@/utils/BusinessEvents";
import { Smartphone, Tablet, Monitor, ArrowLeft, ArrowRight, Eye, Upload, Loader, Trash, Save } from "lucide-react";
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
  const { toast } = useToast();
  const { clearCurrentSchema, saveCurrentSchema, findSchema } = useSchemaOperations();
  const { enabled, actions, query } = useEditor(state => ({
    enabled: state.options.enabled
  }));

  const designContext = useDesignContext();
  if (!designContext) {
    return null;
  }
  const { updateContext, currentInfo, device } = designContext;

  // 下载状态管理
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDeviceChange = (newDevice: DeviceType) => {
    saveCurrentSchema();
    updateContext(draft => {
      const newDeviceData = draft.device.find(d => d.type === newDevice);
      draft.currentInfo.device = newDevice;
      draft.schema = newDeviceData?.languagePageMap[draft.currentInfo.language]?.schema;
    });

    // 触发设备切换事件
    BusinessEvents.emit("onDeviceChange", { device: newDevice });
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

    // 触发语言切换事件
    BusinessEvents.emit("onLanguageChange", { language: newLanguage });
  };
  /**
   * 将当前设备端的数据同步到其他设备端
   */
  const syncResponse = () => {
    const syncSchema = query.getSerializedNodes();
    const syncDevice = DEVICES.filter(d => d !== currentInfo.device) as DeviceType[];
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

  // 处理上传/下载按钮点击
  const downloadHandle = useCallback(() => {
    try {
      setIsDownloading(true);
      BusinessEvents.emit("onDownload", { device: device });
    } catch (error) {
      console.error("触发下载事件失败:", error);
      toast({
        title: "操作失败",
        description: "触发下载事件时出错，请稍后重试。",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  }, [device]);

  const saveHandle = useCallback(() => {
    const { success, updatedDevice } = saveCurrentSchema(); // 调用修改后的函数
    if (success && updatedDevice) {
      BusinessEvents.emit("onSave", { data: { device: updatedDevice } }); // 使用更新后的 device
      localStorage.setItem("schema", JSON.stringify(updatedDevice));
      toast({
        title: "保存本地成功",
        description: "下次打开时，会自动加载。"
      });
    } else {
      // schema 为空或其他保存失败的情况
      toast({
        title: "保存操作未执行",
        description: "内容为空或无法保存。",
        variant: "default" // 或者 "warning"
      });
    }
  }, [saveCurrentSchema]);
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
          <Select value={currentInfo.language} onValueChange={handleLanguageChange} disabled>
            <SelectTrigger>
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
            clearCurrentSchema();
          }}
        >
          <Trash className="mr-1 h-3 w-3" />
          清空
        </Button>
        <Button
          size="sm"
          onClick={() => {
            saveCurrentSchema(true);
            const newMode = !enabled;
            actions.setOptions(options => (options.enabled = newMode));
            // 触发预览/编辑模式切换事件
            if (newMode) {
              BusinessEvents.emit("onPreviewExit", {});
            } else {
              BusinessEvents.emit("onPreview", {});
            }
          }}
        >
          <Eye className="mr-1 h-3 w-3" />
          {enabled ? "预览" : "编辑"}
        </Button>

        <Button size="sm" onClick={downloadHandle} disabled={isDownloading}>
          {isDownloading ? <Loader className="mr-1 h-3 w-3 animate-spin" /> : <Upload className="mr-1 h-3 w-3" />}
          上传
        </Button>
        <Button size="sm" onClick={saveHandle}>
          <Save className="mr-1 h-3 w-3" />
          保存
        </Button>
      </div>
    </div>
  );
};
