import { Input } from "@go-blite/shadcn/input";
import { Label } from "@go-blite/shadcn/label";

import { defaultProps } from "./types";
import { useSettings } from "./Context";

export interface ItemInputProps<T> extends defaultProps<T> {
  type?: string;
}

export function ItemName<T>({ label, placeholder, type, value }: ItemInputProps<T>) {
  const { setCustom } = useSettings<T & { displayName: string }>();
  const inputValue = value;
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={inputValue as string}
        onChange={e => {
          setCustom(p => {
            p.displayName = e.target.value;
          });
        }}
      />
    </div>
  );
}