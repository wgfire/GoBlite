import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export interface FormValues {
  id: string;
  name: string;
  pageType: "STATIC_IMAGE" | "GRAPHIC_SITE";
  format: "PNG" | "SVG" | "PDF" | "JPG";
  i18n: "en";
}

interface FormProps {
  defaultValues?: FormValues;
  values?: FormValues;
  onChange?: (values: FormValues) => void;
}

export const ExportForm: React.FC<FormProps> = ({ defaultValues, values, onChange }) => {
  const [formValues, setFormValues] = useState<FormValues>(
    defaultValues || {
      id: "",
      name: "",
      pageType: "STATIC_IMAGE",
      format: "PNG",
      i18n: "en",
    }
  );

  useEffect(() => {
    if (values) {
      setFormValues(values);
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
        <div className="space-y-2">
          <Label htmlFor="pageName">页面名称</Label>
          <Input id="pageName" placeholder="Enter page name" value={formValues.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pageTypes">页面类型</Label>
          <Select value={formValues.pageType} onValueChange={(value) => handleChange("pageType", value as FormValues["pageType"])}>
            <SelectTrigger id="pageTypes">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STATIC_IMAGE">静态图片</SelectItem>
              <SelectItem value="GRAPHIC_SITE" disabled>图文并茂</SelectItem>
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
            <Select value={formValues.i18n} onValueChange={(value) => handleChange("i18n", value as FormValues["i18n"])}>
              <SelectTrigger id="i18n">
                <SelectValue placeholder="Select i18n" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">En</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </form>
  );
};
