import React, { useState, useEffect } from "react";
import { Input } from "@go-blite/shadcn/input";
import { Label } from "@go-blite/shadcn/label";

export type ToolbarTextInputProps = {
  prefix?: string;
  label?: string;
  type: string;
  onChange?: (value: string) => void;
  value: string;
};

export const ToolbarTextInput: React.FC<ToolbarTextInputProps> = ({
  onChange,
  value,
  prefix,
  label,
  type,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className="w-full">
      {label && <Label>{label}</Label>}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">{prefix}</span>
          </div>
        )}
        <Input
          type={type}
          value={internalValue || ""}
          onChange={e => setInternalValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              onChange?.(e.currentTarget.value);
            }
          }}
          onBlur={() => {
            onChange?.(internalValue);
          }}
          className={prefix ? "pl-7" : ""}
          {...props}
        />
      </div>
    </div>
  );
};
