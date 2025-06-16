import React from "react";
import { BusinessComponents } from "@go-blite/design";

// 导入编辑模式组件

import { NonFarm as NonFarmEdit } from "./NonFarm/NonFarm.edit";

// 导入视图模式组件

import { NonFarm as NonFarmView } from "./NonFarm/NonFarm.view";

// 导入图标
import { AppWindow } from "lucide-react";

export const businessComponents: BusinessComponents[] = [
  {
    name: "NonFarm",
    icon: React.createElement(AppWindow, { size: 20 }),
    editResolver: NonFarmEdit,
    viewResolver: NonFarmView,
    description: "非农",
    category: "业务组件"
  }
];
