import { ItemSInput, ItemSInputProps } from "./ItemSInput";

export interface MarginsProps<T> extends Omit<ItemSInputProps<T>, "propKey" | "label" | "placeholder"> {
  label: string;
  propKeyPrefix: string;
}

const directionPlaceholders = {
  Top: "上",
  Right: "右",
  Bottom: "下",
  Left: "左"
};

export function Margins<T extends Record<string, any>>({
  propKeyPrefix,
  units,
  min,
  max,
  step,
  slider = false,
  className
}: MarginsProps<T>) {
  return (
    <div className={`flex flex-col items-center space-y-1 ${className || ""}`}>
      <ItemSInput<T>
        propKey={`${propKeyPrefix}Top` as any}
        placeholder={directionPlaceholders.Top}
        units={units}
        min={min}
        max={max}
        step={step}
        slider={slider}
        className="w-full max-w-[120px]"
      />
      <div className="flex items-center justify-center space-x-1 w-full">
        <ItemSInput<T>
          propKey={`${propKeyPrefix}Left` as any}
          placeholder={directionPlaceholders.Left}
          units={units}
          min={min}
          max={max}
          step={step}
          slider={slider}
          className="flex-1 max-w-[120px]"
        />
        <ItemSInput<T>
          propKey={`${propKeyPrefix}Right` as any}
          placeholder={directionPlaceholders.Right}
          units={units}
          min={min}
          max={max}
          step={step}
          slider={slider}
          className="flex-1 max-w-[120px]"
        />
      </div>
      <ItemSInput<T>
        propKey={`${propKeyPrefix}Bottom` as any}
        placeholder={directionPlaceholders.Bottom}
        units={units}
        min={min}
        max={max}
        step={step}
        slider={slider}
        className="w-full max-w-[120px]"
      />
    </div>
  );
}
