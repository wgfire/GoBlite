/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNode } from "@craftjs/core";
import { Slider } from "@go-blite/shadcn/slider";
import { RadioGroup } from "@go-blite/shadcn/radio-group";
import { ToolbarDropdown } from "./ToolbarDropdown";
import { ToolbarTextInput } from "./ToolbarTextInput";

// 定义一个通用类型来表示可能的属性值
type PropValue = string | number | boolean | object;

export type ToolbarItemProps<T extends PropValue = PropValue> = {
  prefix?: string;
  label?: string;
  full?: boolean;
  propKey?: string;
  index?: number;
  children?: React.ReactNode;
  type: string;
  onChange?: (value: T) => T;
};

export const ToolbarItem = <T extends PropValue>({
  full = false,
  propKey,
  type,
  onChange,
  index,
  ...props
}: ToolbarItemProps<T>) => {
  const { actions, propValue } = useNode(node => ({
    propValue: node.data.props[propKey as string] as T | T[]
  }));

  const value = Array.isArray(propValue) ? propValue[index as number] : propValue;

  const handleChange = (newValue: T) => {
    actions.setProp((props: Record<string, PropValue>) => {
      if (Array.isArray(propValue) && typeof index === "number") {
        (props[propKey as string] as T[])[index] = onChange ? onChange(newValue) : newValue;
      } else {
        props[propKey as string] = onChange ? onChange(newValue) : newValue;
      }
    });
  };

  return (
    <div className={`mb-2 ${full ? "w-full" : "w-1/2"}`}>
      {["text", "color", "bg", "number"].includes(type) ? (
        <ToolbarTextInput {...props} type={type} value={value as string | number} onChange={handleChange} />
      ) : type === "slider" ? (
        <>
          {props.label && <h4 className="text-sm text-gray-400">{props.label}</h4>}
          <Slider value={[parseInt(value as string) || 0]} onValueChange={newValue => handleChange(newValue[0] as T)} />
        </>
      ) : type === "radio" ? (
        <>
          {props.label && <h4 className="text-sm text-gray-400">{props.label}</h4>}
          <RadioGroup value={value as string} onValueChange={handleChange as (value: string) => void}>
            {props.children}
          </RadioGroup>
        </>
      ) : type === "select" ? (
        <ToolbarDropdown value={value as string} onChange={handleChange} {...props} />
      ) : null}
    </div>
  );
};
