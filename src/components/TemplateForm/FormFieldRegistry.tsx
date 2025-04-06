"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FieldItem } from "@/template/types";

// 表单字段组件接口
export interface FormFieldComponentProps {
  field: FieldItem;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

// 文本输入组件
const TextFieldComponent: React.FC<FormFieldComponentProps> = ({ field, value, onChange, error }) => (
  <div>
    <Input
      id={field.id}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-slate-900/50 border-slate-700 text-white focus-visible:ring-cyan-500 focus-visible:ring-offset-0 ${error ? "border-red-400" : ""}`}
    />
  </div>
);

// 文本区域组件
const TextareaFieldComponent: React.FC<FormFieldComponentProps> = ({ field, value, onChange, error }) => (
  <div>
    <Textarea
      id={field.id}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-slate-900/50 border-slate-700 text-white min-h-[80px] focus-visible:ring-cyan-500 focus-visible:ring-offset-0 ${error ? "border-red-400" : ""}`}
    />
  </div>
);

// 下拉选择组件
const SelectFieldComponent: React.FC<FormFieldComponentProps> = ({ field, value, onChange, error }) => (
  <div className={`relative ${error ? "ring-1 ring-red-400 rounded-md" : ""}`}>
    <Select value={value} onValueChange={onChange} >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit">{value}</SelectValue>
      </SelectTrigger>
      <SelectContent className="z-[1000]">
        {field.options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {/* <Select
      id={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-md p-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
    >
      <option value="" disabled>
        选择一个选项
      </option>
   
    </Select> */}
    {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div> */}
  </div>
);

// 单选按钮组件
const RadioFieldComponent: React.FC<FormFieldComponentProps> = ({ field, value, onChange, error }) => (
  <div>
    <div className={error ? "ring-1 ring-red-400 rounded-md p-2" : ""}>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-row space-x-4 pt-1">
        {field.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${field.id}-${option.value}`}
              className="text-cyan-500 border-slate-600 data-[state=checked]:border-cyan-500 data-[state=checked]:text-cyan-500"
            />
            <Label htmlFor={`${field.id}-${option.value}`} className="text-sm text-slate-300 cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  </div>
);

// 组件注册表
const fieldComponentRegistry: Record<string, React.FC<FormFieldComponentProps>> = {
  text: TextFieldComponent,
  textarea: TextareaFieldComponent,
  select: SelectFieldComponent,
  radio: RadioFieldComponent,
};

// 获取字段组件的函数
export const getFieldComponent = (type: string): React.FC<FormFieldComponentProps> => {
  return fieldComponentRegistry[type] || TextFieldComponent;
};

// 通用表单字段包装器
export const FormField: React.FC<{
  field: FieldItem;
  value: string;
  onChange: (id: string, value: string) => void;
  error?: boolean;
}> = ({ field, value, onChange, error }) => {
  const FieldComponent = getFieldComponent(field.type);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={field.id} className="text-sm font-medium text-slate-300 flex items-center">
          {field.name}
          {field.required !== false && <span className="ml-1 text-red-400">*</span>}
        </label>
        {error && <span className="text-xs text-red-400">必填</span>}
      </div>

      <FieldComponent field={field} value={value || ""} onChange={(newValue) => onChange(field.id, newValue)} error={error} />
    </div>
  );
};
