import { Slider } from "@go-blite/shadcn/slider";
import { Input } from "@go-blite/shadcn/input";
import { Label } from "@go-blite/shadcn/label";
import { defaultProps } from "./types";
import { useSettings } from "./Context";

export interface ItemSliderProps<T> extends defaultProps<T> {
  min: number;
  max: number;
  step: number;
}

export const ItemSlide = <T,>({ label, min, max, step, propKey }: ItemSliderProps<T>) => {
  const { setProp, value } = useSettings<T>();

  const slideValue = value[propKey as keyof T] ? (value[propKey as keyof T] as number) : 0;
  return (
    <div className="pt-[10px]">
      <Label htmlFor={label} className="text-sm text-gray-400">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Slider
          id={label}
          min={min}
          max={max}
          step={step}
          value={[slideValue]}
          onValueChange={value => {
            console.log(value, "value", propKey);
            setProp(p => {
              p[propKey as keyof T] = value[0] as T[keyof T];
            });
          }}
        />
        <Input
          type="number"
          className="w-[60px]"
          id={label}
          value={slideValue as number}
          onChange={e => {
            setProp(p => {
              p[propKey as keyof T] = e.target.value as T[keyof T];
            });
          }}
        />
      </div>
    </div>
  );
};
