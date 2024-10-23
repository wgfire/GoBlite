import { Input } from "@go-blite/shadcn";
import { Label } from "@go-blite/shadcn";

import { defaultProps } from "./types";
import { useSettings } from "./Context";

export interface ItemInputProps<T> extends defaultProps<T> {
  type?: string;
}

export function ItemInput<T>({ label, placeholder, type, propKey }: ItemInputProps<T>) {
  const { value, setProp } = useSettings<T>();
  const inputValue = propKey ? (value[propKey as keyof T] as string) : undefined;
  return (
    <div className="space-y-2">
      <Label className="text-gray-400">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={inputValue as string}
        onChange={e => {
          console.log(e.target.value);
          if (propKey) {
            setProp(p => {
              (p[propKey as keyof T] as string) = e.target.value;
            });
          }
        }}
      />
    </div>
  );
}
