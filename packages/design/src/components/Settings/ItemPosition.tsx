import { useEffect, useCallback } from "react";
import { useSettings } from "./Context";
import { ItemSInput } from "./ItemSInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from "@go-blite/shadcn";
import { get, set, debounce } from "lodash-es";

export interface ItemPositionProps {
  label?: string;
  propKeyPrefix: string;
  className?: string;
}

const positionOptions = [
  { label: "默认 (Static)", value: "static" },
  { label: "相对 (Relative)", value: "relative" },
  { label: "绝对 (Absolute)", value: "absolute" },
  { label: "固定 (Fixed)", value: "fixed" },
  { label: "粘性 (Sticky)", value: "sticky" }
];

const positionUnits = ["px", "%", "vw", "vh", "auto"];

export function ItemPosition<T = any>({ label, propKeyPrefix, className }: ItemPositionProps) {
  const { value: allProps, setProp } = useSettings<T>();

  const positionPropKey = `${propKeyPrefix}.position`;
  const currentPosition = get(allProps, positionPropKey) as string | undefined;

  const debouncedSetProp = useCallback(
    debounce((key: string, val: any) => {
      setProp(props => {
        set(props as object, key, val);
      });
    }, 300),
    [setProp]
  );

  const handlePositionChange = (newPosition: string) => {
    debouncedSetProp(positionPropKey, newPosition);

    if (newPosition === "sticky") {
      setProp(props => {
        const styleObj = get(props, propKeyPrefix);
        if (styleObj) {
          const newStyleObj = { ...styleObj };
          delete newStyleObj.gridArea;
          delete newStyleObj["grid-area"];
          set(props as object, propKeyPrefix, newStyleObj);
        }
      });
    }
  };

  useEffect(() => {
    if (currentPosition === "sticky") {
      const styleObj = get(allProps, propKeyPrefix);
      setProp(props => {
        const newStyle = { ...styleObj };
        delete newStyle.gridArea;
        set(props as object, propKeyPrefix, newStyle);
      });
    } else {
      setProp(props => {
        const styleObj = get(props, propKeyPrefix);
        if (styleObj) {
          const newStyleObj = { ...styleObj };
          newStyleObj["gridArea"] = "1/1/2/2";
          set(props as object, propKeyPrefix, newStyleObj);
        }
      });
    }
  }, [currentPosition, propKeyPrefix, setProp]);

  const showOffsetControls = currentPosition && currentPosition !== "static";

  return (
    <div className={`space-y-3 ${className || ""}`}>
      {label && <Label className="text-gray-400 text-sm mb-1 block">{label}</Label>}
      <Select value={currentPosition || "static"} onValueChange={handlePositionChange}>
        <SelectTrigger>
          <SelectValue placeholder="选择定位方式" />
        </SelectTrigger>
        <SelectContent>
          {positionOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showOffsetControls && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <ItemSInput<any>
              label="Top"
              // @ts-expect-error TODO: fix type
              propKey={`${propKeyPrefix}.top`}
              units={positionUnits}
              defaultValue="0px"
            />
            <ItemSInput<any> label="Left" propKey={`${propKeyPrefix}.left`} units={positionUnits} defaultValue="0px" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ItemSInput<any>
              label="Right"
              propKey={`${propKeyPrefix}.right`}
              units={positionUnits}
              defaultValue="auto"
            />
            <ItemSInput<any>
              label="Bottom"
              propKey={`${propKeyPrefix}.bottom`}
              units={positionUnits}
              defaultValue="auto"
            />
          </div>
        </>
      )}
    </div>
  );
}
