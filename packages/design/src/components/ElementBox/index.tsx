/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 元素框 作为组件的容器，可以设置元素的位置、动画
 * @returns
 */

import { Moveables, ResizerProps } from "../Resizer/Resizer";
import { useRef, forwardRef } from "react";

export type ElementBoxProps = {
  children: React.ReactNode;
  id: string;
  style: React.CSSProperties;
  display?: "grid" | "flex";
  animation?: Animation[];
} & Omit<ResizerProps, "target">;
const gridStyle = {
  gridArea: "1 / 1 / 2 / 2",
  alignSelf: "start",
  justifySelf: "start"
};

export const ElementBoxView: React.FC<ElementBoxProps> = props => {
  const { id, children, style = {} } = props;

  // 生成唯一的DOM ID，避免重复
  const uniqueDomId = `${id}-view`;

  return (
    <div data-id={id} id={uniqueDomId} style={{ ...gridStyle, ...style }}>
      {children}
    </div>
  );
};

export const ElementBox = forwardRef<HTMLDivElement, ElementBoxProps>((props, ref) => {
  const { id, children, style = {}, ...moveProps } = props;
  const targetRef = useRef<HTMLDivElement | null>(null);

  // 生成唯一的DOM ID，避免重复
  const uniqueDomId = `${id}-dom`;

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
