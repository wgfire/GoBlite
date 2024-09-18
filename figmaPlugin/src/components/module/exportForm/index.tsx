import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CascadeSelect } from "@/components/ui/cascadeSelect";
export interface FormValues {
  id: string;
  name: string;
  renders?: Render[];
  format?: "PNG" | "JPG";
}
// 设备对象接口
interface Render {
  type: DeviceType; // 设备类型，如PC，iPad，H5
  pageType: PageType; // 页面类型，如静态图片，图文并茂
  languagePageMap: Map<Language, Object>;
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
  English = "en",
  Chinese = "cn",
  Spanish = "es", //可以扩展其他语言
}

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
const pageTypeData: { label: string; value: PageType }[] = [
  {
    label: "静态图片",
    value: PageType.StaticImage,
  },
  {
    label: "图文并茂",
    value: PageType.GraphicSite,
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

  type Field = keyof FormValues;

  const handleChange = <K extends Field>(field: K, value: FormValues[K]) => {
    const newValues = { ...formValues, [field]: value };
    setFormValues(newValues);
    onChange?.(newValues);
  };

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
        <div className="space-y-2 w-full ">
          <Label htmlFor="deviceType">设备类型</Label>
          <Select value={formValues.renders} onValueChange={(value) => handleChange("renders", value as unknown as FormValues["renders"])}>
            <SelectTrigger id="deviceType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STATIC_IMAGE">Pc</SelectItem>
              <SelectItem value="GRAPHIC_SITE" >
                Ipad
              </SelectItem>
              <SelectItem value="GRAPHIC_SITE" >
                H5
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 w-full ">
          <Label htmlFor="pageType">页面类型</Label>
          <Select>
            <SelectTrigger id="pageType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PageType.StaticImage}>静态站点</SelectItem>
              <SelectItem value={PageType.GraphicSite} disabled>
                图文并茂
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                <SelectItem value="SVG">SVG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="i18n">多语言设置</Label>
            <CascadeSelect></CascadeSelect>
          </div>
        </div>
      </div>
    </form>
  );
};
