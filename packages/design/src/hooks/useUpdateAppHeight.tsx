import { useEffect, useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { debounce } from "lodash-es";

export const useUpdateAppHeight = (nodeId: string) => {
  const { actions, query } = useEditor();

  const updateHeight = useCallback(() => {
    const node = query.node(nodeId).get();
    if (!node) return;

    const element = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement;
    if (!element) return;

    const containerRect = element.getBoundingClientRect();
    let maxRequiredHeight = 0;

    // 获取所有子元素
    const children = element.children;
    Array.from(children).forEach(child => {
      if (!(child as HTMLElement).dataset?.id) return;

      const childElement = child as HTMLElement;
      const style = window.getComputedStyle(childElement);

      let actualTop: number;
      let actualHeight: number;

      if (style.position === "fixed") {
        // 对于 fixed 定位的元素，使用其数据属性存储的原始位置
        // 这些值应该在元素变为 fixed 之前就保存好
        const originalTop = childElement.dataset.originalTop;
        if (originalTop) {
          actualTop = originalTop.includes("%")
            ? (parseFloat(originalTop) / 100) * containerRect.height
            : parseFloat(originalTop);
        } else {
          // 如果没有原始位置，使用当前相对于容器的位置
          const childRect = childElement.getBoundingClientRect();
          actualTop = childRect.top - containerRect.top;
        }
        actualHeight = childElement.offsetHeight;
      } else {
        // 对于非 fixed 元素，正常计算
        const topValue = style.top;
        actualTop = topValue.includes("%")
          ? (parseFloat(topValue) / 100) * containerRect.height
          : parseFloat(topValue) || 0;
        actualHeight = childElement.offsetHeight;
      }

      // 计算这个元素所需的容器高度
      const elementRequiredHeight = actualTop + actualHeight;
      maxRequiredHeight = Math.max(maxRequiredHeight, elementRequiredHeight);
    });

    // 添加底部边距
    const finalHeight = maxRequiredHeight + 50;

    // 更新容器高度

    actions.setProp(nodeId, props => {
      props.style = {
        ...props.style,
        height: `${finalHeight}px`
        // minHeight: `${finalHeight}px`
      };
    });
  }, [nodeId, actions, query]);

  // 使用较短的防抖时间
  const debouncedUpdate = useCallback(
    debounce(updateHeight, 16, {
      leading: true,
      trailing: true,
      maxWait: 50
    }),
    [updateHeight]
  );

  useEffect(() => {
    const element = document.querySelector(`[data-id="${nodeId}"]`);
    if (!element) return;

    const mutationObserver = new MutationObserver(mutations => {
      const hasRelevantChange = mutations.some(
        mutation =>
          mutation.type === "attributes" &&
          (mutation.attributeName === "style" || mutation.attributeName === "data-original-top")
      );

      if (hasRelevantChange) {
        debouncedUpdate();
      }
    });

    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "data-original-top"]
    });

    // 初始化时执行一次更新
    debouncedUpdate();

    return () => {
      mutationObserver.disconnect();
      debouncedUpdate.cancel();
    };
  }, [nodeId, debouncedUpdate]);

  return updateHeight;
};
