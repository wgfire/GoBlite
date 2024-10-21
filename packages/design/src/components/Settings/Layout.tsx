import React, { memo, ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@go-blite/shadcn/tabs";

interface LayoutProps {
  tabs: string[];
  children: ReactNode;
}

export const Layout = memo(({ tabs, children }: LayoutProps) => {
  return (
    <Tabs defaultValue={tabs[0]} className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map(tab => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {React.Children.map(children, (child, index) => (
        <TabsContent key={tabs[index]} value={tabs[index]}>
          {child}
        </TabsContent>
      ))}
    </Tabs>
  );
});
