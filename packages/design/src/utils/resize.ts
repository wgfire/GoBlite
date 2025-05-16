/* eslint-disable @typescript-eslint/no-explicit-any */

// import { SmartPosition } from "@/types/common";

// 获取元素的计算样式
export const getComputedValue = (element: HTMLElement, property: string): string => {
  return window.getComputedStyle(element)[property as any];
};
export const getComputedNumberValue = (element: HTMLElement, property: string): number => {
  return parseFloat(getComputedValue(element, property));
};
export const getContentDimension = (element: HTMLElement, property: string): number => {
  const computedStyle = window.getComputedStyle(element);
  const dimension = property.includes("width") ? element.clientWidth : element.clientHeight;

  // 减去padding
  if (property.includes("width")) {
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);
    return dimension - (paddingLeft + paddingRight);
  } else {
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingBottom = parseFloat(computedStyle.paddingBottom);
    return dimension - (paddingTop + paddingBottom);
  }
};
// 从值中提取单位
export const extractUnit = (value: string | number | undefined): string => {
  if (!value) return "px"; // 默认使用像素
  if (typeof value === "number") return "px";

  // 匹配常见的单位
  const match = value.match(/(px|%|vh|vw|em|rem)$/);
  return match ? match[1] : "px";
};
export const maintainUnit = (currentValue: number, element: HTMLElement, property: string, unit: string) => {
  // 如果当前值是百分比
  if (unit === "%") {
    const parentElement = element.parentElement;
    if (!parentElement) return currentValue;

    // 获取父元素的内容区域尺寸（不包含padding）
    const parentContentDimension = getContentDimension(parentElement, property);

    // 转换为百分比（相对于父元素的内容区域）
    return `${(currentValue / parentContentDimension) * 100}%`;
  }

  // 默认使用像素
  return `${currentValue}${unit}`;
};

const getElementRectWithoutTransform = (element: HTMLElement): DOMRect => {
  const style = window.getComputedStyle(element);
  const transform = style.transform;

  // 如果没有 transform，直接返回原始的 rect
  if (transform === "none") {
    return element.getBoundingClientRect();
  }

  // 临时移除 transform 以获取原始尺寸
  const originalTransform = element.style.transform;
  element.style.transform = "none";
  const rect = element.getBoundingClientRect();
  // 恢复原始 transform
  element.style.transform = originalTransform;

  return rect;
};
interface Position {
  left: string;
  top: string;
}

type Unit = "px" | "%";
export const calculateRelativePosition = (
  element: HTMLElement,
  parent: HTMLElement,
  unit: Unit = "%",
  preserveTransform: boolean = false
): Position => {
  const parentStyles = window.getComputedStyle(parent);
  const parentPaddingLeft = parseFloat(parentStyles.paddingLeft) || 0;
  const parentPaddingTop = parseFloat(parentStyles.paddingTop) || 0;

  // 计算父容器的内容区域尺寸
  const parentContentWidth = parent.clientWidth - parentPaddingLeft * 2;
  const parentContentHeight = parent.clientHeight - parentPaddingTop * 2;

  const elementRect = preserveTransform ? element.getBoundingClientRect() : getElementRectWithoutTransform(element);

  const parentRect = parent.getBoundingClientRect();

  // 计算相对于父容器内容区域的位置
  const relativeLeft = elementRect.left - parentRect.left - parentPaddingLeft;
  const relativeTop = elementRect.top - parentRect.top - parentPaddingTop;

  if (unit === "%") {
    return {
      left: `${(relativeLeft / parentContentWidth) * 100}%`,
      top: `${(relativeTop / parentContentHeight) * 100}%`
    };
  }

  return {
    left: `${relativeLeft}px`,
    top: `${relativeTop}px`
  };
};

/**
 * 计算元素的智能定位属性
 * 根据元素在容器中的位置，自动选择最合适的定位属性（left/right 和 top/bottom）
 *
 * @param element 要定位的元素
 * @param parent 父容器元素
 * @param unit 单位，支持 'px' 或 '%'
 * @param preserveTransform 是否保留元素的 transform 属性
 * @returns 包含最合适的水平和垂直定位属性及其值的对象
 */
// export const calculateSmartPosition = (
//   element: HTMLElement,
//   parent: HTMLElement,
//   unit: Unit = "px",
//   preserveTransform: boolean = false
// ): SmartPosition => {
//   const parentStyles = window.getComputedStyle(parent);
//   const parentPaddingLeft = parseFloat(parentStyles.paddingLeft) || 0;
//   const parentPaddingRight = parseFloat(parentStyles.paddingRight) || 0;
//   const parentPaddingTop = parseFloat(parentStyles.paddingTop) || 0;
//   const parentPaddingBottom = parseFloat(parentStyles.paddingBottom) || 0;

//   // 计算父容器的内容区域尺寸
//   const parentContentWidth = parent.clientWidth - (parentPaddingLeft + parentPaddingRight);
//   const parentContentHeight = parent.clientHeight - (parentPaddingTop + parentPaddingBottom);

//   const elementRect = preserveTransform ? element.getBoundingClientRect() : getElementRectWithoutTransform(element);
//   const parentRect = parent.getBoundingClientRect();

//   // 计算元素相对于父容器内容区域的位置
//   const relativeLeft = elementRect.left - parentRect.left - parentPaddingLeft;
//   const relativeRight = parentContentWidth - relativeLeft - elementRect.width;
//   const relativeTop = elementRect.top - parentRect.top - parentPaddingTop;
//   const relativeBottom = parentContentHeight - relativeTop - elementRect.height;

//   // 确定水平方向使用 left 还是 right
//   const useLeft = relativeLeft <= relativeRight;

//   // 确定垂直方向使用 top 还是 bottom
//   const useTop = relativeTop <= relativeBottom;

//   // 根据单位格式化值
//   const formatValue = (value: number): string => {
//     if (unit === "%") {
//       // 转换为百分比
//       const percentWidth = (value / parentContentWidth) * 100;
//       const percentHeight = (value / parentContentHeight) * 100;
//       return useLeft ? `${percentWidth.toFixed(2)}%` : `${percentHeight.toFixed(2)}%`;
//     }
//     return `${Math.round(value)}px`;
//   };

//   // 构建返回结果
//   const result: SmartPosition = {
//     horizontal: {
//       property: useLeft ? "left" : "right",
//       value: formatValue(useLeft ? relativeLeft : relativeRight)
//     },
//     vertical: {
//       property: useTop ? "top" : "bottom",
//       value: formatValue(useTop ? relativeTop : relativeBottom)
//     }
//   };

//   return result;
// };

/**
 * 智能计算元素在父容器中的最佳定位属性（支持px、%、vw、vh单位）
 * 总是返回四个定位属性，未使用的属性设为0以便清除之前的设置
 * @param elementRect 元素的边界矩形
 * @param parentRect 父容器的边界矩形
 * @param unit 定位单位 ('px' | '%' | 'vw' | 'vh')
 * @param thresholdRatio 切换属性的阈值比例 (0-1)
 * @returns 包含四个定位属性的对象（left, right, top, bottom）
 */
export const calculateSmartPosition = (
  elementRect: DOMRect,
  parentRect: DOMRect,
  unit: "px" | "%" | "vw" | "vh" = "px",
  thresholdRatio: number = 0.1
) => {
  const parentWidth = parentRect.width;
  const parentHeight = parentRect.height;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 计算元素中心点相对于父容器的位置
  const elementCenterX = elementRect.left + elementRect.width / 2 - parentRect.left;
  const elementCenterY = elementRect.top + elementRect.height / 2 - parentRect.top;

  // 格式化值函数
  const formatValue = (value: number): string => {
    if (unit === "%") {
      // 百分比单位基于父容器尺寸
      const base =
        elementCenterX < parentWidth * thresholdRatio || elementCenterX > parentWidth * (1 - thresholdRatio)
          ? parentWidth
          : parentHeight;
      return `${(value / base) * 100}%`;
    } else if (unit === "vw" || unit === "vh") {
      // 视口单位基于视口尺寸
      const base = unit === "vw" ? viewportWidth : viewportHeight;
      return `${(value / base) * 100}${unit}`;
    }
    // 默认像素单位
    return `${value}px`;
  };

  // 计算水平方向属性
  let leftValue = "0";
  let rightValue = "0";

  if (elementCenterX < parentWidth * thresholdRatio) {
    // 靠近左侧，使用left
    leftValue = formatValue(elementRect.left - parentRect.left);
    rightValue = "0";
  } else if (elementCenterX > parentWidth * (1 - thresholdRatio)) {
    // 靠近右侧，使用right
    leftValue = "0";
    rightValue = formatValue(parentRect.right - elementRect.right);
  } else {
    // 中间位置，默认使用left
    leftValue = formatValue(elementRect.left - parentRect.left);
    rightValue = "0";
  }

  // 计算垂直方向属性
  let topValue = "0";
  let bottomValue = "0";

  if (elementCenterY < parentHeight * thresholdRatio) {
    // 靠近顶部，使用top
    topValue = formatValue(elementRect.top - parentRect.top);
    bottomValue = "0";
  } else if (elementCenterY > parentHeight * (1 - thresholdRatio)) {
    // 靠近底部，使用bottom
    topValue = "0";
    bottomValue = formatValue(parentRect.bottom - elementRect.bottom);
  } else {
    // 中间位置，默认使用top
    topValue = formatValue(elementRect.top - parentRect.top);
    bottomValue = "0";
  }

  return {
    left: leftValue,
    right: rightValue,
    top: topValue,
    bottom: bottomValue
  };
};
