import React from "react";
import { Button, Label } from "@go-blite/shadcn";
import { Input } from "@go-blite/shadcn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@go-blite/shadcn";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@go-blite/shadcn";
import { useSettings } from "./Context";
import { defaultProps } from "./types";

export interface ItemI18nProps<T> extends defaultProps<T> {
  propKeys: string[]; // 组件中可翻译的属性列表
}

export function ItemI18n<T>({ propKeys, label = "配置多语言" }: ItemI18nProps<T>) {
  const { value, setProp } = useSettings<T>();
  // 安全地获取i18n属性
  const i18nValue = (value as any)?.i18n || {};
  const [newKey, setNewKey] = React.useState("");
  const [selectedProp, setSelectedProp] = React.useState(propKeys[0] || "");

  const handleAddTranslation = () => {
    if (!newKey || !selectedProp) return;
    setProp(props => {
      // 安全地设置i18n属性
      const currentProps = props as any;
      const currentI18n = currentProps.i18n || {};
      currentProps.i18n = {
        ...currentI18n,
        [selectedProp]: newKey
      };
    });
    setNewKey("");
  };

  const handleRemoveTranslation = (propKey: string) => {
    setProp(props => {
      // 安全地设置i18n属性
      const currentProps = props as any;
      const currentI18n = currentProps.i18n || {};
      const newI18n = { ...currentI18n };
      delete newI18n[propKey];
      currentProps.i18n = newI18n;
    });
  };

  return (
    <div className="space-y-4">
      <Label className="flex-shrink-0 text-sm flex items-center text-gray-400">{label}</Label>
      {Object.keys(i18nValue).length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>属性</TableHead>
              <TableHead>翻译</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(i18nValue).map(([prop, key]) => (
              <TableRow key={prop}>
                <TableCell>{prop}</TableCell>
                <TableCell>{key as string}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveTranslation(prop)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-2 text-sm text-muted-foreground">尚未配置翻译键</div>
      )}
      <div className="flex items-center space-x-2">
        <div className="w-1/2">
          <Select value={selectedProp} onValueChange={setSelectedProp}>
            <SelectTrigger>
              <SelectValue placeholder="选择属性" />
            </SelectTrigger>
            <SelectContent>
              {propKeys.map(key => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="翻译"
          value={newKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKey(e.target.value)}
          className="w-2/3"
        />
        <Button variant="outline" size="icon" onClick={handleAddTranslation}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
