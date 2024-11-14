import { Button } from "@go-blite/shadcn";
import { useSettings } from "./Context";
import { ItemSelect } from "./ItemSelect";
import { Section } from "./Section";
import { defaultProps, PropPath } from "./types";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart
} from "lucide-react";
import { get, set } from "lodash-es";

export type FlexLayoutProps<T> = defaultProps<T> & {
  justifyKey: string;
  alignKey: string;
};

export const FlexLayout = <T,>({ label = "弹性布局", justifyKey, alignKey }: FlexLayoutProps<T>) => {
  const { value, setProp } = useSettings<T>();
  const justifyContent = get(value, justifyKey) as string;
  const alignItems = get(value, alignKey) as string;

  const setJustifyContent = (value: string) => {
    setProp(draft => {
      set(draft as object, justifyKey, value);
    });
  };
  const setAlignItems = (value: string) => {
    setProp(draft => {
      set(draft as object, alignKey, value);
    });
  };
  return (
    <Section defaultOpen title={<div className="flex items-center justify-between gap-2">{label}</div>}>
      <ItemSelect<T>
        propKey={"style.flexDirection" as PropPath<T>}
        options={[
          { label: "水平", value: "row" },
          { label: "垂直", value: "column" },
          { label: "水平反向", value: "row-reverse" },
          { label: "垂直反向", value: "column-reverse" }
        ]}
      />
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
