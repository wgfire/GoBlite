/**
 * 矩形节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode, ParsedRectangleNode } from "../types";

/**
 * 矩形节点解析器类
 */
export class RectangleNodeParser extends BaseNodeParser<RectangleNode> {
  /**
   * 解析矩形节点特有属性
   * @param node 矩形节点
   * @param parsedNode 解析后的节点数据
   */
  protected parseSpecificProps(node: RectangleNode, parsedNode: ParsedNode): void {
    const rectangleNode = parsedNode as ParsedRectangleNode;

    // 尺寸
    rectangleNode.width = node.width;
    rectangleNode.height = node.height;

    // 圆角
    if (node.cornerRadius !== undefined && node.cornerRadius > 0) {
      rectangleNode.cornerRadius = node.cornerRadius;
    } else if (
      node.topLeftRadius !== undefined ||
      node.topRightRadius !== undefined ||
      node.bottomLeftRadius !== undefined ||
      node.bottomRightRadius !== undefined
    ) {
      // 处理不同角的圆角
      rectangleNode.topLeftRadius = node.topLeftRadius;
      rectangleNode.topRightRadius = node.topRightRadius;
      rectangleNode.bottomLeftRadius = node.bottomLeftRadius;
      rectangleNode.bottomRightRadius = node.bottomRightRadius;
    }

    // 扩展样式
    if (rectangleNode.style) {
      // 尺寸
      rectangleNode.style.width = `${node.width}px`;
      rectangleNode.style.height = `${node.height}px`;

      // 圆角
      if (node.cornerRadius !== undefined && node.cornerRadius > 0) {
        rectangleNode.style.borderRadius = `${node.cornerRadius}px`;
      } else if (
        node.topLeftRadius !== undefined ||
        node.topRightRadius !== undefined ||
        node.bottomLeftRadius !== undefined ||
        node.bottomRightRadius !== undefined
      ) {
        // 处理不同角的圆角
        rectangleNode.style.borderRadius = `${node.topLeftRadius || 0}px ${node.topRightRadius || 0}px ${node.bottomRightRadius || 0}px ${node.bottomLeftRadius || 0}px`;
      }
    }
  }
}
