import { Button } from "@go-blite/shadcn";
import { useSettings } from "./Context";
import { Section } from "./Section";
import { defaultProps } from "./types";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart
} from "lucide-react";
import { get, set } from "lodash-es";

export type GridLayoutProps<T> = defaultProps<T> & {
  justifyKey: string;
  alignKey: string;
};

export const GridLayout = <T,>({ label = "快速排列", justifyKey, alignKey }: GridLayoutProps<T>) => {
  const { value, setProp } = useSettings<T>();
  const justifyContent = get(value, justifyKey) as string;
  const alignItems = get(value, alignKey) as string;

  const setJustifyContent = (value: string) => {
    setProp(draft => {
      set(draft as object, justifyKey, value);
      set(draft as object, "customStyle.transform", "none");
    });
  };
  const setAlignItems = (value: string) => {
    setProp(draft => {
      set(draft as object, alignKey, value);
      set(draft as object, "customStyle.transform", "none");
    });
  };
  return (
    <Section defaultOpen title={<div className="flex items-center justify-between gap-2">{label}</div>}>
      <div className="grid grid-cols-6 gap-2">
        <Button size="icon" variant="outline" onClick={() => setJustifyContent("flex-start")}>
          <AlignHorizontalJustifyStart
            className={`h-4 w-4 ${justifyContent === "flex-start" ? "text-blue-500" : ""}`}
          />
        </Button>
        <Button size="icon" variant="outline" onClick={() => setJustifyContent("center")}>
          <AlignHorizontalJustifyCenter className={`h-4 w-4 ${justifyContent === "center" ? "text-blue-500" : ""}`} />
        </Button>
        <Button size="icon" variant="outline" onClick={() => setJustifyContent("flex-end")}>
          <AlignHorizontalJustifyEnd className={`h-4 w-4 ${justifyContent === "flex-end" ? "text-blue-500" : ""}`} />
        </Button>
        <Button size="icon" variant="outline" onClick={() => setAlignItems("flex-start")}>
          <AlignVerticalJustifyStart className={`h-4 w-4 ${alignItems === "flex-start" ? "text-blue-500" : ""}`} />
        </Button>
        <Button size="icon" variant="outline" onClick={() => setAlignItems("center")}>
          <AlignVerticalJustifyCenter className={`h-4 w-4 ${alignItems === "center" ? "text-blue-500" : ""}`} />
        </Button>
        <Button size="icon" variant="outline" onClick={() => setAlignItems("flex-end")}>
          <AlignVerticalJustifyEnd className={`h-4 w-4 ${alignItems === "flex-end" ? "text-blue-500" : ""}`} />
        </Button>
      </div>
    </Section>
  );
};
