import React, { useMemo } from "react";
import { useEditor } from "@craftjs/core";
import { I18nTable } from "./I18nTable";
import { I18nExportWithCrowdin } from "./I18nExportWithCrowdin";

// 组件i18n信息接口
export interface ComponentI18n {
  id: string; // 组件ID
  displayName: string; // 组件显示名称
  i18n: {
    [propKey: string]: string; // 属性名: 翻译键
  };
}

// 导出的翻译数据接口
export interface ExportI18nData {
  [key: string]: string; // 翻译键: 翻译值
}

export const I18nManager: React.FC = () => {
  const { componentsWithI18n, exportData } = useEditor(state => {
    // 获取所有节点
    const nodes = state.nodes;
    // 提取包含i18n配置的组件
    const componentsWithI18n: ComponentI18n[] = [];
    const exportData: ExportI18nData = {};
    Object.keys(nodes).forEach(nodeId => {
      const node = nodes[nodeId];
      if (node.data.props?.i18n) {
        // 添加到组件列表
        componentsWithI18n.push({
          id: nodeId,
          displayName: node.data.custom?.displayName || node.data.type,
          i18n: node.data.props.i18n
        });
        // 添加到导出数据
        Object.entries(node.data.props.i18n).forEach(([propKey, translationKey]) => {
          // 使用组件类型+ID+属性名作为唯一键
          const uniqueKey = `${nodeId.substring(0, 8)}_${propKey}`;
          // 使用translationKey作为值，这样用户可以看到原始的翻译键
          exportData[uniqueKey] = (translationKey as string) || "";
        });
      }
    });
    return {
      componentsWithI18n,
      exportData
    };
  });

  // 计算总翻译键数量
  const totalKeys = useMemo(() => {
    return Object.keys(exportData).length;
  }, [exportData]);
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">多语言管理</h3>
        <div className="text-xs text-gray-500">共 {totalKeys} 个翻译键</div>
      </div>
      {componentsWithI18n.length > 0 ? (
        <>
          <I18nTable components={componentsWithI18n} />
          <I18nExportWithCrowdin data={exportData} />
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>当前页面没有配置多语言</p>
          <p className="text-xs mt-2">在组件设置中添加多语言配置</p>
        </div>
      )}
    </div>
  );
};
