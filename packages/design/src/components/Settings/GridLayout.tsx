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
import { parseCSSTransformMatrix } from "@/utils/transform";

export type GridLayoutProps<T> = defaultProps<T> & {
  justifyKey: string;
  alignKey: string;
};

export const GridLayout = <T,>({ label = "快速排列", justifyKey, alignKey }: GridLayoutProps<T>) => {
  const { value, setProp } = useSettings<T>();
  const justifyContent = get(value, justifyKey) as string;
  const alignItems = get(value, alignKey) as string;

  /**
   * 处理水平对齐设置
   * 当设置水平对齐时，清除 left 值并处理 transform 中的平移部分
   */
  const setJustifyContent = (value: string) => {
    setProp(draft => {
      // 设置网格对齐属性
      set(draft as object, justifyKey, value);

      // 清除 left 值，避免与网格对齐冲突
      set(draft as object, "customStyle.left", "");

      // 处理 transform，保留非平移部分
      const transform = get(draft as object, "customStyle.transform");
      if (transform) {
        const { remainingMatrix } = parseCSSTransformMatrix(transform);
        set(draft as object, "customStyle.transform", remainingMatrix);
      }

      // 设置网格定位属性
      set(
        draft as object,
        "customStyle.justifySelf",
        value === "flex-start" ? "start" : value === "flex-end" ? "end" : value
      );
    });
  };

  /**
   * 处理垂直对齐设置
   * 当设置垂直对齐时，清除 top 值并处理 transform 中的平移部分
   */
  const setAlignItems = (value: string) => {
    setProp(draft => {
      // 设置网格对齐属性
      set(draft as object, alignKey, value);

      // 清除 top 值，避免与网格对齐冲突
      set(draft as object, "customStyle.top", "");

      // 处理 transform，保留非平移部分
      const transform = get(draft as object, "customStyle.transform");
      if (transform) {
        const { remainingMatrix } = parseCSSTransformMatrix(transform);
        set(draft as object, "customStyle.transform", remainingMatrix);
      }

      // 设置网格定位属性
      set(
        draft as object,
        "customStyle.alignSelf",
        value === "flex-start" ? "start" : value === "flex-end" ? "end" : value
      );
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
