/**
 * @goblite/selectors 包主入口文件
 */

import { BusinessComponents } from "@go-blite/design";
import { NonFarmComponents } from "./NonFarm";

export * from "./hooks";

// 导出业务组件列表
export const businessComponents: BusinessComponents[] = [NonFarmComponents];
