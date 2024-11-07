import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@go-blite/shadcn";
import { X } from "lucide-react";

export interface ContextMenuHocProps {
  Settings: React.ReactNode;
  position: { x: number; y: number };
  onClose: () => void;
}

export const ContextMenuHoc = React.memo((props: ContextMenuHocProps) => {
  const { Settings, position } = props;
  return (
    <Card style={{ position: "absolute", left: position.x, top: position.y }}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Context Menu
          <X onClick={props.onClose} className="cursor-pointer" size={16} />
        </CardTitle>
      </CardHeader>
      <CardContent>{Settings}</CardContent>
    </Card>
  );
});
