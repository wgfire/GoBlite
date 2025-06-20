import { Slider } from "@go-blite/shadcn";
import { Input } from "@go-blite/shadcn";
import { Label } from "@go-blite/shadcn";
import { defaultProps } from "./types";
import { useSettings } from "./Context";
import { get, set } from "lodash-es";

export interface ItemSliderProps<T> extends defaultProps<T> {
  min: number;
  max: number;
  step: number;
}

export const ItemSlide = <T,>({ label, min, max, step, propKey }: ItemSliderProps<T>) => {
  const { setProp, value } = useSettings<T>();

  const slideValue = propKey ? (get(value, propKey) as number) : 0;

  return (
    <div className="pt-[10px]">
      <Label className="text-sm text-gray-400">{label}</Label>
      <div className="flex items-center gap-2">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[slideValue]}
          onValueChange={value => {
            setProp(p => {
              set(p as object, propKey as string, value[0] as T[keyof T]);
            });
          }}
        />
        <Input
          type="number"
          className="w-[60px]"
          value={slideValue as number}
          onChange={e => {
            setProp(p => {
              set(p as object, propKey as string, e.target.value as T[keyof T]);
            });
          }}
        />
      </div>
    </div>
  );
};
