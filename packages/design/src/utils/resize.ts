/* eslint-disable @typescript-eslint/no-explicit-any */
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
  console.log("originalTransform", originalTransform);
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
