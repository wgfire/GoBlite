import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";

/**
 * 布尔运算节点解析器
 */
export class BooleanOperationNodeParser extends BaseNodeParser<BooleanOperationNode> {
  protected parseSpecificProps(node: BooleanOperationNode, parsedNode: ParsedNode): void {
    // 基本属性
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 布尔运算特有属性
    parsedNode.booleanOperation = node.booleanOperation;

    // 保存原始信息到 JSON 输出，方便后续处理
    parsedNode.booleanOperationData = {
      booleanOperation: node.booleanOperation
    };
  }
}
