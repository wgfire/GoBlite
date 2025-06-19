/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 元素框 作为组件的容器，可以设置元素的位置、动画
 * @returns
 */

import { Moveables, ResizerProps } from "../Resizer/Resizer";
import { useRef, forwardRef } from "react";
import { useParentLayoutMode } from "@/hooks/useParentLayoutMode";

export type ElementBoxProps = {
  children: React.ReactNode;
  id: string;
  style: React.CSSProperties;
  display?: "grid" | "flex";
  animation?: Animation[];
} & Omit<ResizerProps, "target">;

// 绝对定位模式的网格样式（原有逻辑）
const absoluteGridStyle = {
  gridArea: "1 / 1 / 2 / 2",
  alignSelf: "start",
  justifySelf: "start"
};

// 流式布局模式的样式
const flowGridStyle = {
  gridArea: "auto", // 让网格自动分配位置
  alignSelf: "stretch", // 拉伸填充单元格高度，
  justifySelf: "stretch", // 拉伸填充单元格宽度
  minWidth: 0, // 防止内容溢出
  minHeight: 0 // 防止内容溢出
};

export const ElementBoxView: React.FC<ElementBoxProps> = props => {
  const { id, children, style = {} } = props;

  // 生成唯一的DOM ID，避免重复
  const uniqueDomId = `${id}-view`;

  const layoutMode = useParentLayoutMode(id);

  // 根据布局模式选择样式
  const gridStyle = layoutMode === "absolute" ? absoluteGridStyle : flowGridStyle;

  return (
    <div data-id={id} id={uniqueDomId} style={{ ...gridStyle, ...style }}>
      {children}
    </div>
  );
};

export const ElementBox = forwardRef<HTMLDivElement, ElementBoxProps>((props, ref) => {
  const { id, children, style = {}, ...moveProps } = props;
  const targetRef = useRef<HTMLDivElement | null>(null);

  const detectedLayoutMode = useParentLayoutMode(id);

  // 优先使用检测到的父容器布局模式
  const layoutMode = detectedLayoutMode;

  // 生成唯一的DOM ID，避免重复
  const uniqueDomId = `${id}-dom`;

  // 根据布局模式选择样式
  const gridStyle = layoutMode === "absolute" ? absoluteGridStyle : flowGridStyle;

  return (
    <>
      <div
        data-id={id}
        id={uniqueDomId}
        style={{ ...gridStyle, ...style }}
        ref={dom => {
          targetRef.current = dom;
          if (typeof ref === "function") {
            ref(dom);
          } else if (ref) {
            ref.current = dom;
          }
        }}
      >
        {children}
      </div>
      <Moveables target={targetRef} {...moveProps}></Moveables>
    </>
  );
});
export default ElementBox;
