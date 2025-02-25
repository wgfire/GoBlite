import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";

/**
 * 多边形节点解析器
 */
export class PolygonNodeParser extends BaseNodeParser<PolygonNode> {
  protected parseSpecificProps(node: PolygonNode, parsedNode: ParsedNode): void {
    // 基本属性
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 多边形特有属性
    if (node.pointCount) {
      parsedNode.pointCount = node.pointCount;
    }

    // 保存原始信息到 JSON 输出，方便后续处理
    parsedNode.polygonData = {
      pointCount: node.pointCount
    };
  }
}
