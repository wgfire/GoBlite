/**
 * 框架节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";

/**
 * Frame 节点解析器
 */
export class FrameNodeParser extends BaseNodeParser<FrameNode> {
  /**
   * 解析框架节点特有属性
   * @param node 框架节点
   * @param parsedNode 解析后的节点数据
   */
  protected parseSpecificProps(node: FrameNode, parsedNode: ParsedNode): void {
    // 基本属性
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 处理 Auto Layout
    if (node.layoutMode !== "NONE") {
      // 移除绝对定位，使用 flex 布局
      parsedNode.style.position = "relative";
      parsedNode.style.display = "flex";

      // 设置方向
      if (node.layoutMode === "HORIZONTAL") {
        parsedNode.style.flexDirection = "row";
      } else if (node.layoutMode === "VERTICAL") {
        parsedNode.style.flexDirection = "column";
      }

      // 处理间距
      if (typeof node.itemSpacing === "number") {
        parsedNode.style.gap = `${node.itemSpacing}px`;
      }

      // 处理填充
      if (typeof node.paddingLeft === "number") {
        parsedNode.style.paddingLeft = `${node.paddingLeft}px`;
      }

      if (typeof node.paddingRight === "number") {
        parsedNode.style.paddingRight = `${node.paddingRight}px`;
      }

      if (typeof node.paddingTop === "number") {
        parsedNode.style.paddingTop = `${node.paddingTop}px`;
      }

      if (typeof node.paddingBottom === "number") {
        parsedNode.style.paddingBottom = `${node.paddingBottom}px`;
      }

      // 处理主轴对齐方式
      if (node.primaryAxisAlignItems) {
        switch (node.primaryAxisAlignItems) {
          case "MIN":
            parsedNode.style.justifyContent = "flex-start";
            break;
          case "CENTER":
            parsedNode.style.justifyContent = "center";
            break;
          case "MAX":
            parsedNode.style.justifyContent = "flex-end";
            break;
          case "SPACE_BETWEEN":
            parsedNode.style.justifyContent = "space-between";
            break;
        }
      }

      // 处理交叉轴对齐方式
      if (node.counterAxisAlignItems) {
        switch (node.counterAxisAlignItems) {
          case "MIN":
            parsedNode.style.alignItems = "flex-start";
            break;
          case "CENTER":
            parsedNode.style.alignItems = "center";
            break;
          case "MAX":
            parsedNode.style.alignItems = "flex-end";
            break;
          // Figma API 中 counterAxisAlignItems 可能是 'MIN', 'CENTER', 'MAX' 或 'BASELINE'
          // 没有 'STRETCH' 值
        }
      }

      // 处理自动调整大小
      if (node.layoutGrow === 1) {
        parsedNode.style.flexGrow = "1";
      }

      // 处理子元素的布局位置
      if (parsedNode.children) {
        // 对于使用 Auto Layout 的 Frame，子元素不应该使用绝对定位
        parsedNode.children.forEach(child => {
          if (child.style && child.style.position === "absolute") {
            child.style.position = "relative";
          }
        });
      }
    }

    // 保存原始布局信息到 JSON 输出，方便后续处理
    parsedNode.layoutData = {
      layoutMode: node.layoutMode,
      primaryAxisAlignItems: node.primaryAxisAlignItems,
      counterAxisAlignItems: node.counterAxisAlignItems,
      paddingLeft: node.paddingLeft,
      paddingRight: node.paddingRight,
      paddingTop: node.paddingTop,
      paddingBottom: node.paddingBottom,
      itemSpacing: node.itemSpacing,
      layoutGrow: node.layoutGrow
    };
  }
}
