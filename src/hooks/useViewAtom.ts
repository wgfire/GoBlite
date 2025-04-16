/**
 * 切换视图
 */

import { atom, useAtom } from "jotai";

// 将atom定义在hook外部，确保只创建一次
const currentViewAtom = atom<"editor" | "webcontainer" | "templateGallery">("editor");

export const useViewAtom = () => {
  const [currentView, setCurrentView] = useAtom(currentViewAtom);

  // 返回视图状态和切换方法
  return {
    currentView,
    setCurrentView,
  };
};
