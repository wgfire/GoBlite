import React from "react";
import { BusinessComponents } from "../context/Provider";

// 导入编辑模式组件
import { Container as ContainerEdit } from "./Container/Container.edit";
import { Text as TextEdit } from "./Text/Text.edit";
import { Button as ButtonEdit } from "./Button/Button.edit";
import { Image as ImageEdit } from "./Image/Image.edit";
import { App as AppEdit } from "./App/App.edit";
import { NonFarm as NonFarmEdit } from "./NonFarm/NonFarm.edit";

// 导入视图模式组件
import { Container as ContainerView } from "./Container/Container.view";
import { Text as TextView } from "./Text/Text.view";
import { Button as ButtonView } from "./Button/Button.view";
import { Image as ImageView } from "./Image/Image.view";
import { NonFarm as NonFarmView } from "./NonFarm/NonFarm.view";

import { App as AppView } from "./App/App.view";

// 导入图标
import { Box, Type, CircleDot, Image as ImageIcon, AppWindow } from "lucide-react";

export const internalBusinessComponents: BusinessComponents[] = [
  {
    name: "Container",
    icon: React.createElement(Box, { size: 20 }),
    editResolver: ContainerEdit,
    viewResolver: ContainerView,
    description: "容器",
    category: "基础组件"
  },
  {
    name: "Text",
    icon: React.createElement(Type, { size: 20 }),
    editResolver: TextEdit,
    viewResolver: TextView,
    description: "文本",
    category: "基础组件"
  },
  {
    name: "Button",
    icon: React.createElement(CircleDot, { size: 20 }), // 使用 CircleDot 作为按钮图标示例
    editResolver: ButtonEdit,
    viewResolver: ButtonView,
    description: "按钮",
    category: "基础组件"
  },
  {
    name: "Image",
    icon: React.createElement(ImageIcon, { size: 20 }),
    editResolver: ImageEdit,
    viewResolver: ImageView,
    description: "图片",
    category: "基础组件"
  },
  {
    name: "NonFarm",
    icon: React.createElement(AppWindow, { size: 20 }),
    editResolver: NonFarmEdit,
    viewResolver: NonFarmView,
    description: "非农",
    category: "业务组件"
  },
  {
    name: "App", // 'App' 通常作为根组件或特殊容器
    icon: React.createElement(AppWindow, { size: 20 }),
    editResolver: AppEdit,
    viewResolver: AppView
  }
];
