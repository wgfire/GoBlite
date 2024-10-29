import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@go-blite/shadcn";
import { Label } from "@go-blite/shadcn";
import { set } from "lodash-es";
import clsx from "clsx";
import { defaultProps } from "./types";
import { useSettings } from "./Context";

export interface ItemSelectProps<T> extends defaultProps<T> {
  options: { value: string; label: string; disabled?: boolean }[];
}

export const ItemSelect = <T,>({ label, options, className, propKey }: ItemSelectProps<T>) => {
  const { setProp, value } = useSettings<T>();
  const selectValue = propKey ? value[propKey as keyof T] : "";
  const onChange = (value: string) => {
    if (propKey) {
      setProp(p => {
        set(p as object, propKey, value);
      });
    }
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
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
