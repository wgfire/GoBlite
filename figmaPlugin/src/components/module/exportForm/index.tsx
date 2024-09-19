import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CascadeSelect } from "@/components/ui/cascadeSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export interface FormValues {
  id: string;
  name: string;
  devices?: Device[];
  format?: "PNG" | "JPG";
}
// 设备对象接口
interface Device {
  type: DeviceType; // 设备类型，如PC，iPad，H5
  pageType: PageType; // 页面类型，如静态图片，图文并茂
  languagePageMap: Partial<Record<Language, object[]>>;
}

enum DeviceType {
  PC = "pc",
  IPad = "ipad",
  H5 = "h5",
}
// 页面类型枚举
enum PageType {
  StaticImage = "STATIC_IMAGE",
  GraphicSite = "GRAPHIC_SITE",
}

// 语言类型枚举
enum Language {
  ZH = "ZH",
  EN = "EN",
  KR = "KR",
  TH = "TH",
  VN = "VN",
  MY = "MY",
  IN = "IN",
  ID = "ID",
  PH = "PH",
  PT = "PT",
}

const languageData: { label: string; value: Language }[] = [
  { value: Language.ZH, label: "中文" },
  { value: Language.EN, label: "英文" },
  { value: Language.KR, label: "韩文" },
  { value: Language.TH, label: "泰文" },
  { value: Language.VN, label: "越南文" },
  { value: Language.MY, label: "马来文" },
  { value: Language.IN, label: "印尼文" },
  { value: Language.ID, label: "印度文" },
  { value: Language.PH, label: "菲律宾文" },
  { value: Language.PT, label: "葡萄牙" },
];
const devicesData: { label: keyof typeof DeviceType; value: DeviceType }[] = [
  {
    label: "PC",
    value: DeviceType.PC,
  },
  {
    label: "IPad",
    value: DeviceType.IPad,
  },
  {
    label: "H5",
    value: DeviceType.H5,
  },
];
const pageTypeData: { label: string; value: PageType; disabled?: boolean }[] = [
  {
    label: "静态图片",
    value: PageType.StaticImage,
  },
  {
    label: "图文并茂",
    value: PageType.GraphicSite,
    disabled: true,
  },
];

interface FormProps {
  defaultValues: FormValues;
  values?: FormValues;
  onChange?: (values: FormValues) => void;
}

export const ExportForm: React.FC<FormProps> = ({ defaultValues, values, onChange }) => {
  const [formValues, setFormValues] = useState<FormValues>({
    format: "PNG",
    ...defaultValues,
  });
  console.log(formValues, "values", defaultValues);
  useEffect(() => {
    if (values) {
      setFormValues((prev) => ({ ...prev, ...values }));
    }
  }, [values]);
  const initDevices = (): Device => {
    let type = DeviceType.PC;
    const h5Exist = formValues.devices?.find((item) => item.type === DeviceType.H5);
    const ipadExist = formValues.devices?.find((item) => item.type === DeviceType.IPad);
    type = !ipadExist ? DeviceType.IPad : !h5Exist ? DeviceType.H5 : DeviceType.PC;
    return {
      type,
      pageType: PageType.StaticImage,
      languagePageMap: {
        EN: [],
      },
    };
  };

  const handleChange = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    const newValues = { ...formValues, [field]: value };
    setFormValues(newValues);
    onChange?.(newValues);
  };

  const addDevice = () => {
    if (formValues.devices?.length === 3) {
      alert("最多只能添加3个设备");
      return;
    }
    const newDevice = initDevices();
    setFormValues((prev) => ({ ...prev, devices: [...prev.devices!, newDevice] }));
  };
  const deleteDevice = (type: string) => {
    if (formValues.devices?.length === 1) {
      alert("最少保留一个设备");
      return;
    }
    const newDevices = formValues.devices?.filter((item) => item.type !== type);
    setFormValues((prev) => ({ ...prev, devices: newDevices }));
  };
  useEffect(() => {
    const init = initDevices();
    console.log(init.languagePageMap, "init");
    setFormValues((prev) => ({ ...prev, devices: [init] }));
  }, []);

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 w-full col-start-1 col-span-2">
          <Label htmlFor="pageId">页面ID</Label>
          <Input id="pageId" value={formValues.id} disabled onChange={(e) => handleChange("id", e.target.value)} />
        </div>
        <div className="space-y-2 w-full col-start-1 col-span-2">
          <Label htmlFor="pageName">页面名称</Label>
          <Input id="pageName" placeholder="Enter page name" value={formValues.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <Separator className="col-span-2" />
        <>
          {formValues.devices?.map((device, index) => {
            return (
              <Card className="space-y-2 col-span-2" key={device.type}>
                <CardHeader>
                  <CardTitle>
                    <div className="flex justify-between items-center">
                      页面配置-{index + 1}
                      <Button type="reset" variant="destructive" onClick={() => deleteDevice(device.type)}>
                        删除
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceType">设备类型</Label>
                    <Select>
                      <SelectTrigger id="pageType">
                        <SelectValue placeholder="选择设备类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {devicesData.map((item) => (
                          <SelectItem value={item.value} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pageType">页面类型</Label>
                    <Select>
                      <SelectTrigger id="pageType">
                        <SelectValue placeholder="选择页面类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {pageTypeData.map((item) => (
                          <SelectItem value={item.value} key={item.value} disabled={item.disabled}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="i18n">多语言设置</Label>
                    <Select>
                      <SelectTrigger id="i18n">
                        <SelectValue placeholder="选择多语言" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageData.map((item) => (
                          <SelectItem value={item.value} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="i18n">页面节点配置</Label>
                    <CascadeSelect items={[]}></CascadeSelect>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </>
        <Button className="col-start-2 col-end-auto justify-self-end max-w-max" type="button" onClick={addDevice}>
          添加
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">图片配置</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="format">导出格式</Label>
            <Select value={formValues.format} onValueChange={(value) => handleChange("format", value as FormValues["format"])}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PNG">PNG</SelectItem>
                <SelectItem value="JPG">JPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </form>
  );
};
