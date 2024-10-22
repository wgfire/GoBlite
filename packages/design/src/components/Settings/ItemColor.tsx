import { useState } from "react";
import { Label } from "@go-blite/shadcn/label";
import { Color, ColorResult, TwitterPicker } from "react-color";

import { defaultProps } from "./types";
import { useSettings } from "./Context";
export const ItemColor = <T,>({ label, propKey }: defaultProps<T>) => {
  const { value, setProp } = useSettings<T>();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const background = propKey ? (value[propKey as keyof T] as Color) : undefined;

  return (
    <div>
      <Label>{label}</Label>
      <div
        className="w-full h-8 rounded cursor-pointer border border-ring"
        style={{ backgroundColor: background ? `rgba(${Object.values(background)})` : "transparent" }}
        onClick={() => setShowColorPicker(!showColorPicker)}
      ></div>
      {showColorPicker && (
        <div className="absolute z-10">
          <TwitterPicker
            color={background}
            onChange={(color: ColorResult) =>
              setProp(p => {
                (p[propKey as keyof T] as Color) = color.rgb;
              })
            }
          />
        </div>
      )}
    </div>
  );
};
