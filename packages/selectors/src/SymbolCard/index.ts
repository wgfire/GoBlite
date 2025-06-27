import { BusinessComponents } from "@go-blite/design";
import React from "react";
import { AppWindow } from "lucide-react";

// 导入组件
import { SymbolCardEdit } from "./SymbolCard.edit";
import { SymbolCardView } from "./SymbolCard.view";

export const SymbolCardComponents: BusinessComponents = {
  name: "SymbolCard",
  icon: React.createElement(AppWindow, { size: 20 }),
  editResolver: SymbolCardEdit,
  viewResolver: SymbolCardView,
  description: "品种",
  category: "业务组件"
};
