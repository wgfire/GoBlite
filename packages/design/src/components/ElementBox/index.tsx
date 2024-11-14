/**
 * 元素框 作为组件的容器，可以设置元素的位置、动画
 * @returns
 */

export type ElementBoxProps = {
  children: React.ReactNode;
  id: string;
  style: React.CSSProperties;
  display?: "grid" | "flex";
  animation?: Animation[];
};
const gridStyle = {
  gridArea: "1 / 1 / 2 / 2",
  alignSelf: "start",
  justifySelf: "start"
};

const ElementBox: React.FC<React.PropsWithChildren<ElementBoxProps>> = props => {
  const { id, children, style = {} } = props;
  return (
    <div data-id={id} style={{ ...gridStyle, ...style }}>
      {children}
    </div>
  );
};

export default ElementBox;
