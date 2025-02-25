/**
 * 椭圆节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode, ParsedEllipseNode } from "../types";

/**
 * 椭圆节点解析器类
 */
export class EllipseNodeParser extends BaseNodeParser<EllipseNode> {
  /**
   * 解析椭圆节点特有属性
   * @param node 椭圆节点
   * @param parsedNode 解析后的节点数据
   */
  protected parseSpecificProps(node: EllipseNode, parsedNode: ParsedNode): void {
    const ellipseNode = parsedNode as ParsedEllipseNode;

    // 尺寸
    ellipseNode.width = node.width;
    ellipseNode.height = node.height;

    // 扩展样式
    if (ellipseNode.style) {
      // 尺寸
      ellipseNode.style.width = `${node.width}px`;
      ellipseNode.style.height = `${node.height}px`;

      // 椭圆形状
      ellipseNode.style.borderRadius = "50%";
    }
  }
}
