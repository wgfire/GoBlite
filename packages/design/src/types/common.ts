/**
 * 智能定位属性接口
 * 根据元素在容器中的位置，自动选择最合适的定位属性（left/right 和 top/bottom）
 */
export interface SmartPosition {
  horizontal: {
    property: "left" | "right";
    value: string;
  };
  vertical: {
    property: "top" | "bottom";
    value: string;
  };
}
