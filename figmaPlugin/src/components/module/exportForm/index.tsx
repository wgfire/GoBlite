import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceType, PageType, Device, Language } from "./types";
import { devicesData, languageData, pageTypeData } from "./const";
import { usePluginContext } from "@/context";
// import { ChevronRight } from "lucide-react";
import { CascadeMultiSelect } from "@/components/ui/cascadMSelect";
export interface FormValues {
  id: string;
  name: string;
  devices: Device[];
  format?: "PNG" | "JPG";
}

interface FormProps {
  defaultValues?: FormValues;
  values?: FormValues;
  onChange?: (values: FormValues) => void;
}

export const ExportForm: React.FC<FormProps> = ({ defaultValues, values, onChange }) => {
  const [formValues, setFormValues] = useState<FormValues>({ ...(defaultValues ?? ({} as FormValues)) });
  const { state } = usePluginContext();
  const { nodes: _nodes } = state;
  console.log(formValues, "values");
  const languageNodes = languageData.map((item) => {
    return {
      ...item,
      children: _nodes,
    };
  });
  useEffect(() => {
    if (values) {
      setFormValues((prev) => ({ ...prev, ...values }));
    }
  }, [values]);
  const initDevices = (): Device => {
    let type = DeviceType.PC;
    if (formValues.devices?.length !== 0) {
      const h5Exist = formValues.devices?.find((item) => item.type === DeviceType.H5);
      const ipadExist = formValues.devices?.find((item) => item.type === DeviceType.IPad);
      type = !ipadExist ? DeviceType.IPad : !h5Exist ? DeviceType.H5 : DeviceType.PC;
    }
    return {
      type,
      pageType: PageType.StaticImage,
      languagePageMap: {},
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
    const newDevices = initDevices();
    handleChange("devices", [...formValues.devices, newDevices]);
  };
  const deleteDevice = (type: string) => {
    if (formValues.devices?.length === 1) {
      alert("最少保留一个设备");
      return;
    }
    const newDevices = formValues.devices?.filter((item) => item.type !== type);
    handleChange("devices", [...newDevices]);
  };

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 w-full col-start-1 col-span-2">
          <Label htmlFor="pageId">页面ID</Label>
          <Input id="pageId" value={formValues.id} disabled />
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
                    <Select
                      value={device.type}
                      onValueChange={(value) => {
                        const updatedDevices = formValues.devices!.map((d, i) => (i === index ? { ...d, type: value as DeviceType } : d));
                        handleChange("devices", updatedDevices);
                      }}
                    >
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
                    <Select
                      value={device.pageType}
                      onValueChange={(value) => {
                        const updatedDevices = formValues.devices!.map((d, i) => (i === index ? { ...d, pageType: value as PageType } : d));
                        handleChange("devices", updatedDevices);
                      }}
                    >
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
                  <div className="space-y-2  col-start-1 col-span-2">
                    <Label htmlFor="i18n">多语言设置</Label>
                    <CascadeMultiSelect
                      items={languageNodes}
                      values={Object.values(formValues.devices[index].languagePageMap) as string[][]}
                      onSelect={(value) => {
                        console.log(value, "选中");
                        if (!value) return false;
                        const currentLanguage = {} as Device["languagePageMap"];
                        value.forEach((arr) => {
                          const setKey = arr[0] as Language;
                          currentLanguage[setKey] = arr;
                        });
                        const updatedDevices = formValues.devices!.map((d, i) => (i === index ? { ...d, languagePageMap: currentLanguage } : d));

                        handleChange("devices", updatedDevices);
                      }}
                    ></CascadeMultiSelect>
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
