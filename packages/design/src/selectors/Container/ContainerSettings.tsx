import { ROOT_NODE, useNode } from "@craftjs/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@go-blite/shadcn/tabs";

import { Input } from "@go-blite/shadcn/input";

import { ContainerProps } from ".";
import { Label } from "@go-blite/shadcn";

export const ContainerSettings = () => {
  const {
    actions: { setProp },
    width,
    height,
    background,
    padding,
    margin,
    custom,
    id
  } = useNode(node => ({
    id: node.id,
    width: node.data.props.width,
    height: node.data.props.height,
    background: node.data.props.background,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
    custom: node.data.custom
  }));
  console.log(background, padding, margin, custom, "background");
  //   const Toolbar = () => {
  //     return <div>Toolbar</div>;
  //   };

  return (
    <Tabs defaultValue="layout" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="layout">布局</TabsTrigger>
        <TabsTrigger value="color">颜色</TabsTrigger>
        <TabsTrigger value="behavior">行为</TabsTrigger>
      </TabsList>
      <TabsContent value="layout">
        <div className="flex flex-col gap-2">
          <Label>尺寸</Label>
          <div className="flex gap-2">
            <Input
              value={width}
              disabled={id === ROOT_NODE}
              placeholder="宽度"
              className="px-2"
              onChange={e =>
                setProp((props: ContainerProps) => {
                  console.log(e.target.value, "值");
                  props["width"] = e.target.value;
                })
              }
            />
            <Input
              value={height}
              placeholder="高度"
              disabled={id === ROOT_NODE}
              onChange={e => {
                setProp((props: ContainerProps) => {
                  console.log(e.target.value, "值");
                  props["height"] = e.target.value;
                });
              }}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="color"></TabsContent>
      <TabsContent value="behavior"></TabsContent>
    </Tabs>
  );
};
