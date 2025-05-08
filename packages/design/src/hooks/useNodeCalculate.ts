import { FreshNode, useEditor } from "@craftjs/core";
import { resolveComponent } from "@/utils/resolveComponent"; // You'll need to create this utility

/**
 * 拿到页面的所有节点，然后计算哪个节点距离顶部最远，吧他插入到这个节点的下方，如果没有节点，top值就是0
 */
export const useNodeCalculate = () => {
  const {
    query,
    actions: { add }
  } = useEditor();

  /**拿到距离顶部最远的节点 */
  const calculateMaxTop = () => {
    const nodeIds = query.getNodes();

    let maxTop = 0;

    // Iterate through all nodes
    Object.keys(nodeIds).forEach(id => {
      const dom = document.querySelector(`[data-id="${id}"]`);
      if (dom) {
        const rect = dom.getBoundingClientRect();
        // Add scrollY to get absolute position
        const absoluteTop = rect.top + window.scrollY;
        maxTop = Math.max(maxTop, absoluteTop);
      }
    });

    return maxTop;
  };
  /** 根据传递的node信息 添加一节点对象到页面中*/
  const addNodeSetAttribute = (nodeData: object) => {
    const maxTop = calculateMaxTop();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(nodeData).forEach(([, nodeInfo]: [string, any]) => {
      const ComponentType = resolveComponent(nodeInfo.resolvedName);
      if (!ComponentType) {
        console.warn(`Component ${nodeInfo.resolvedName} not found`);
        return;
      }

      const freshNode: FreshNode = {
        data: {
          type: ComponentType,
          displayName: nodeInfo.displayName,
          props: {
            ...nodeInfo.props,
            customStyle: {
              top: `${maxTop + 20}px`, // Add 20px offset from the lowest element
              maxWidth: "100%"
            }
          },
          nodes: [],
          parent: "ROOT" // Add to root canvas
        }
      };

      const node = query.parseFreshNode(freshNode).toNode();
      console.log(node, "node");
      add(node, "ROOT");
    });
  };

  return {
    addNodeSetAttribute,
    calculateMaxTop
  };
};
