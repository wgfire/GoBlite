import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";

/**
 * 连接器节点解析器
 */
export class ConnectorNodeParser extends BaseNodeParser<ConnectorNode> {
  protected parseSpecificProps(node: ConnectorNode, parsedNode: ParsedNode): void {
    // 基本属性
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 连接器特有属性
    if (node.connectorStart) {
      parsedNode.connectorStart = node.connectorStart;
    }

    if (node.connectorEnd) {
      parsedNode.connectorEnd = node.connectorEnd;
    }

    // 保存原始信息到 JSON 输出，方便后续处理
    parsedNode.connectorData = {
      connectorStart: node.connectorStart,
      connectorEnd: node.connectorEnd,
      connectorLineType: node.connectorLineType
    };
  }
}
