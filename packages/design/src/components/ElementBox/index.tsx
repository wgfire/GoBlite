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

export const ElementBox = forwardRef<HTMLDivElement, ElementBoxProps>((props, ref) => {
  const { id, children, style = {}, ...moveProps } = props;
  const targetRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        data-id={id}
        id={id}
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
