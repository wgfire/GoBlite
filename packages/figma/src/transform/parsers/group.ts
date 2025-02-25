/**
 * 组节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode, ParsedGroupNode } from "../types";

/**
 * 组节点解析器类
 */
export class GroupNodeParser extends BaseNodeParser<GroupNode> {
  /**
   * 解析组节点特有属性
   * @param node 组节点
   * @param parsedNode 解析后的节点数据
   */
  protected parseSpecificProps(node: GroupNode, parsedNode: ParsedNode): void {
    const groupNode = parsedNode as ParsedGroupNode;

    // 尺寸
    groupNode.width = node.width;
    groupNode.height = node.height;

    // 扩展样式
    if (groupNode.style) {
      // 尺寸
      groupNode.style.width = `${node.width}px`;
      groupNode.style.height = `${node.height}px`;

      // 组通常用于分组，不应该有自己的背景色和边框
      // 但保留定位信息
      groupNode.style.position = "relative";
    }
  }
}
