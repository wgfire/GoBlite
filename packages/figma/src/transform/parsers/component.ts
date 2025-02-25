/**
 * 组件节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode, ParsedComponentNode } from "../types";

/**
 * 组件节点解析器类
 */
export class ComponentNodeParser extends BaseNodeParser<ComponentNode> {
  /**
   * 解析组件节点特有属性
   * @param node 组件节点
   * @param parsedNode 解析后的节点数据
   */
  protected parseSpecificProps(node: ComponentNode, parsedNode: ParsedNode): void {
    const componentNode = parsedNode as ParsedComponentNode;

    // 尺寸
    componentNode.width = node.width;
    componentNode.height = node.height;

    // 扩展样式
    if (componentNode.style) {
      // 尺寸
      componentNode.style.width = `${node.width}px`;
      componentNode.style.height = `${node.height}px`;
    }

    // 添加组件特有的属性
    componentNode.componentId = node.id;
  }
}
