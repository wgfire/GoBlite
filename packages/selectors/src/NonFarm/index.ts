import { BusinessComponents } from "@go-blite/design";
import React from "react";
import { AppWindow } from "lucide-react";

// 导入组件
import { NonFarm as NonFarmEdit } from "./NonFarm.edit";
import { NonFarm as NonFarmView } from "./NonFarm.view";

// 单独导出 useDateSubtr 钩子
export { useDateSubtr } from "./hooks/useDateSubtr";
export const NonFarmComponents: BusinessComponents = {
  name: "NonFarm",
  icon: React.createElement(AppWindow, { size: 20 }),
  editResolver: NonFarmEdit,
  viewResolver: NonFarmView,
  description: "非农",
  category: "业务组件"
};
