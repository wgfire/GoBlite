import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";

/**
 * 组件集合节点解析器
 */
export class ComponentSetNodeParser extends BaseNodeParser<ComponentSetNode> {
  protected parseSpecificProps(node: ComponentSetNode, parsedNode: ParsedNode): void {
    // 基本属性
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 组件集合特有属性
    if (node.defaultVariant) {
      parsedNode.defaultVariantId = node.defaultVariant.id;
    }

    // 保存原始信息到 JSON 输出，方便后续处理
    parsedNode.componentSetData = {
      defaultVariantId: node.defaultVariant ? node.defaultVariant.id : null,
      variantGroupProperties: node.variantGroupProperties
    };
  }
}
