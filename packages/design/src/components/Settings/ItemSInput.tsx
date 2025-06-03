import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@go-blite/shadcn";
import { Label } from "@go-blite/shadcn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@go-blite/shadcn";
import { Slider } from "@go-blite/shadcn";
import { useSettings } from "./Context";
import { defaultProps } from "./types";
import { get, set, debounce } from "lodash-es";

export interface ItemSInputProps<T> extends defaultProps<T> {
  units?: string[];
  min?: number;
  max?: number;
  step?: number;
  slider?: boolean;
}

const parseValueUnit = (
  strValue: string | undefined | null,
  allowedUnits: string[],
  defaultUnit: string
): { value: string | number; unit: string } => {
  if (strValue === "auto" && allowedUnits.includes("auto")) {
    return { value: "auto", unit: "auto" };
  }
  if (typeof strValue !== "string" || !strValue) {
    return { value: "", unit: defaultUnit };
  }

  const match = strValue.match(/^([+-]?\d*\.?\d+)\s*([a-zA-Z%]*)$/);
  if (match) {
    const num = parseFloat(match[1]);
    const u = match[2] || defaultUnit;
    if (allowedUnits.includes(u)) {
      return { value: num, unit: u };
    }
  }

  if (allowedUnits.includes(defaultUnit)) {
    return { value: strValue, unit: defaultUnit };
  }
  return { value: strValue, unit: allowedUnits[0] || "px" };
};

export function ItemSInput<T>({
  label,
  placeholder,
  propKey,
  units = ["px", "%"],
  min = 0,
  max = 100,
  step = 1,
  slider = true,
  className
}: ItemSInputProps<T>) {
  const { value: craftValue, setProp } = useSettings<T>();
  const initialRawValue = propKey ? (get(craftValue, propKey) as string | undefined) : undefined;
  const defaultUnit = units.includes("px") ? "px" : units[0] || "px";

  const [numericValue, setNumericValue] = useState<string | number>("");
  const [selectedUnit, setSelectedUnit] = useState<string>(defaultUnit);

  useEffect(() => {
    const parsed = parseValueUnit(initialRawValue, units, defaultUnit);
    setNumericValue(parsed.value);
    setSelectedUnit(parsed.unit);
  }, [initialRawValue, units, defaultUnit]);

  const debouncedSetProp = useCallback(
    debounce((valToSet: string) => {
      if (propKey) {
        setProp(p => {
          set(p as object, propKey as string, valToSet);
        });
      }
    }, 300),
    [propKey, setProp]
  );

  const handleSubmit = (currentVal: string | number, currentUnit: string) => {
    if (currentVal === "auto" && currentUnit === "auto") {
      debouncedSetProp("auto");
    } else if (typeof currentVal === "number" || (typeof currentVal === "string" && !isNaN(parseFloat(currentVal)))) {
      if (currentUnit !== "auto") {
        debouncedSetProp(`${currentVal}${currentUnit}`);
      }
    } else if (typeof currentVal === "string" && currentVal.trim() !== "") {
      debouncedSetProp(currentVal);
    }
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumVal = e.target.value;
    setNumericValue(newNumVal);
    if (selectedUnit === "auto" && newNumVal !== "auto") {
      const newUnit = defaultUnit;
      setSelectedUnit(newUnit);
      handleSubmit(newNumVal, newUnit);
    } else {
      handleSubmit(newNumVal, selectedUnit);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setSelectedUnit(newUnit);
    if (newUnit === "auto") {
      setNumericValue("auto");
      handleSubmit("auto", "auto");
    } else {
      let currentNum = typeof numericValue === "string" ? parseFloat(numericValue) : numericValue;
      if (numericValue === "auto" || isNaN(currentNum as number)) {
        currentNum = 0;
      }
      setNumericValue(currentNum);
      handleSubmit(currentNum, newUnit);
    }
  };

  const handleSliderChange = (sliderVal: number[]) => {
    const newNumVal = sliderVal[0];
    setNumericValue(newNumVal);
    handleSubmit(newNumVal, selectedUnit);
  };

  const isNumericInput = selectedUnit !== "auto";
  const displayValue = numericValue === "auto" ? "auto" : String(numericValue);

  return (
    <div className={`space-y-2 ${className || ""}`}>
      {label && <Label className="text-gray-400 text-sm">{label}</Label>}
      <div className="flex items-center space-x-2">
        <Input
          type={isNumericInput ? "number" : "text"}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleNumericChange}
          className="flex-grow"
          disabled={!isNumericInput && numericValue === "auto"}
        />
        <Select value={selectedUnit} onValueChange={handleUnitChange}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map(u => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {slider && isNumericInput && typeof numericValue === "number" && (
        <Slider
          min={min}
          max={max}
          step={step}
          value={[numericValue]}
          onValueChange={handleSliderChange}
          className="mt-2"
        />
      )}
    </div>
  );
}
