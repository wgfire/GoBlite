import { useEffect } from "react";
import DesignPage from "./components/DesignPage";

/**
 * 页面渲染组件
 * 接收计算好的 schema，并将其传递给 DesignPage 进行渲染。
 * @param {{currentSchema: object|null, translation: object|undefined}}
 */
const Page = ({ currentSchema, translation }) => {
  // 设置页面标题
  useEffect(() => {
    if (currentSchema && currentSchema["ROOT"]?.props?.h5Title) {
      document.title = currentSchema["ROOT"].props.h5Title;
    }
  }, [currentSchema]);

  // 加载和错误状态已由父组件处理，这里直接处理 schema 不存在的情况
  if (!currentSchema) {
    return <div>No schema available to display.</div>;
  }

  return <DesignPage initialData={{ schema: currentSchema, translation }} />;
};

export default Page;
