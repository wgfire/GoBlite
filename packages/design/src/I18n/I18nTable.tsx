import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { ComponentI18n } from "./I18nManager";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@go-blite/shadcn";
import { Input } from "@go-blite/shadcn";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface I18nTableProps {
  components: ComponentI18n[];
}

export const I18nTable: React.FC<I18nTableProps> = ({ components }) => {
  const { updateNodeI18n } = useEditor((state, query) => {
    return {
      updateNodeI18n: (nodeId: string, propKey: string, translationKey: string) => {
        const node = state.nodes[nodeId];
        if (node) {
          (query as any).setProp(nodeId, (props: any) => {
            const i18n = props.i18n || {};
            i18n[propKey] = translationKey;
            props.i18n = i18n;
          });
        }
      }
    };
  });

  // 跟踪每个组件的展开状态
  const [expandedComponents, setExpandedComponents] = useState<Record<string, boolean>>({});

  // 切换组件的展开状态
  const toggleComponentExpand = (componentId: string) => {
    setExpandedComponents(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  };

  // 处理翻译键更新
  const handleTranslationKeyChange = (componentId: string, propKey: string, newValue: string) => {
    updateNodeI18n(componentId, propKey, newValue);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>组件</TableHead>
            <TableHead>配置</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map(component => {
            const isExpanded = expandedComponents[component.id] || false;
            const i18nEntries = Object.entries(component.i18n);

            return (
              <React.Fragment key={component.id}>
                <TableRow>
                  <TableCell>
                    <div
                      onClick={() => {
                        toggleComponentExpand(component.id);
                      }}
                      className="flex items-center cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center">
                          <ChevronDown
                            className={clsx(
                              "h-4 w-4 mr-2 transition-transform",
                              isExpanded ? "transform rotate-180" : ""
                            )}
                          />
                          {component.id.substring(0, 8)}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div
                      onClick={() => {
                        toggleComponentExpand(component.id);
                      }}
                      className="flex items-center cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{component.displayName}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{i18nEntries.length} 个</div>
                  </TableCell>
                </TableRow>
                <>
                  {isExpanded &&
                    i18nEntries.map(([propKey, translationKey], _index) => (
                      <TableRow key={`${component.id}-${propKey}`} className="bg-gray-50">
                        <TableCell colSpan={3} className="pl-8 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            {propKey}
                            <Input
                              value={translationKey as string}
                              onChange={e => handleTranslationKeyChange(component.id, propKey, e.target.value)}
                              className="h-7 text-sm"
                              placeholder="输入翻译键"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
