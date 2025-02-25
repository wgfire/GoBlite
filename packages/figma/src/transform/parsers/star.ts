import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";

/**
 * 星形节点解析器
 */
export class StarNodeParser extends BaseNodeParser<StarNode> {
  protected parseSpecificProps(node: StarNode, parsedNode: ParsedNode): void {
    // 基本属性
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 星形特有属性
    if (node.pointCount) {
      parsedNode.pointCount = node.pointCount;
    }

    if (typeof node.innerRadius === "number") {
      parsedNode.innerRadius = node.innerRadius;
    }

    // 保存原始信息到 JSON 输出，方便后续处理
    parsedNode.starData = {
      pointCount: node.pointCount,
      innerRadius: node.innerRadius
    };
  }
}
