import { useState, useRef, useEffect } from "react";
import { Label, Input } from "@go-blite/shadcn";
import { ColorResult, TwitterPicker } from "react-color";

import { defaultProps } from "./types";
import { useSettings } from "./Context";
import { get, set } from "lodash-es";

export const ItemColor = <T,>({ label, propKey }: defaultProps<T>) => {
  const { value, setProp } = useSettings<T>();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [inputColor, setInputColor] = useState("");
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const background = propKey ? (get(value, propKey) as string) : undefined;

  useEffect(() => {
    if (background) {
      setInputColor(background);
    }
  }, [background]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorChange = (color: ColorResult) => {
    const newColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    setInputColor(newColor);
    setProp(p => {
      set(p as object, propKey as string, newColor);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputColor(newValue);
    setProp(p => {
      set(p as object, propKey as string, newValue);
    });
  };

  return (
    <div className="space-y-2">
      <Label className="flex-shrink-0 text-sm flex items-center">{label}</Label>
      <div className="flex items-center">
        <Input
          type="text"
          value={inputColor}
          onChange={handleInputChange}
          className="flex-grow mr-2"
          placeholder="rgba(255,255,255,1) 或 linear-gradient(...)"
        />
        <div
          className="w-8 h-8 rounded cursor-pointer border border-ring"
          style={{ background: inputColor }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        ></div>
      </div>
      {showColorPicker && (
        <div className="absolute z-10" ref={colorPickerRef}>
          <TwitterPicker color={background as string} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};
