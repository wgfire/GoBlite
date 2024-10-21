import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@go-blite/shadcn/select";
import { Label } from "@go-blite/shadcn/label";

import clsx from "clsx";
import { defaultProps } from "./types";
import { useSettings } from "./Context";

export interface ItemSelectProps<T> extends defaultProps<T> {
  options: { value: string; label: string }[];
}

export const ItemSelect = <T,>({ label, options, className, propKey }: ItemSelectProps<T>) => {
  const { setProp, value } = useSettings<T>();
  const selectValue = propKey ? value[propKey as keyof T] : "";
  const onChange = (value: string) => {
    setProp(p => {
      p[propKey as keyof T] = value as T[keyof T];
    });
  };
  return (
    <div className={clsx("space-y-2", className)}>
      <Label htmlFor={label} className="text-sm text-gray-400">
        {label}
      </Label>
      <Select value={selectValue as string} onValueChange={onChange}>
        <SelectTrigger id={label}>
          <SelectValue placeholder={`${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
