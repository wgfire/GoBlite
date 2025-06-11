import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@go-blite/shadcn";
import { Label } from "@go-blite/shadcn";
import { get, set } from "lodash-es";
import clsx from "clsx";
import { defaultProps } from "./types";
import { useSettings } from "./Context";

export interface ItemSelectProps<T> extends defaultProps<T> {
  options: { value: string; label: string; disabled?: boolean }[];
}

export const ItemSelect = <T,>({
  label,
  options,
  className,
  propKey,
  onChange: externalOnChange,
  value
}: ItemSelectProps<T>) => {
  const { setProp, value: ctxVal } = useSettings<T>();
  const selectValue = propKey ? (get(ctxVal, propKey) as string) : (value as string);
  const handleChange = (val: string) => {
    if (externalOnChange) {
      externalOnChange(val as any);
    } else {
      if (propKey) {
        setProp(p => {
          set(p as object, propKey, val);
        });
      }
    }
  };
  return (
    <div className={clsx("space-y-2", className)}>
      <Label className="text-sm text-gray-400">{label}</Label>
      <Select value={selectValue as string} onValueChange={handleChange}>
        <SelectTrigger>
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
