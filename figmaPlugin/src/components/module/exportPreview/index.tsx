import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Device, DeviceType, Language } from "../exportForm/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ExportPreviewType, Preview } from "../Preview";

export interface ExportPreviewProps<T> {
  currentTab: DeviceType;
  onChange: (type: DeviceType, language?: Language) => void;
  devices: T[];
  previewData?: ExportPreviewType[];
}
export const ExportPreview = <T extends Device>(props: ExportPreviewProps<T>) => {
  const { currentTab, devices, onChange, previewData } = props;
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">导出预览</h3>
      <Tabs
        value={currentTab}
        onValueChange={(e) => {
          const type = e as unknown as DeviceType;
          onChange(type);
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          {devices.map((el, index) => {
            return <ExportPreview.TabTriggerWithSelect el={el} index={index} onChange={onChange}></ExportPreview.TabTriggerWithSelect>;
          })}
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">{previewData && <Preview data={previewData} width={400}></Preview>}</div>
      </div>
    </div>
  );
};

const TabTriggerWithSelect = (props: { el: Device; index: number; onChange: (type: DeviceType, language?: Language) => void }) => {
  const { el, index, onChange } = props;
  const [localLanguage, setLocalLanguage] = useState<Language>();
  return (
    <TabsTrigger key={el.type} value={el.type} className="space-x-2">
      <span>{"页面配置-" + (index + 1)}</span>
      <Select
        key={el.type}
        value={localLanguage || Object.keys(el.languagePageMap)[0]}
        onValueChange={(e: Language) => {
          setLocalLanguage(e);
          onChange(el.type, e);
        }}
      >
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
};
ExportPreview.TabTriggerWithSelect = TabTriggerWithSelect;
