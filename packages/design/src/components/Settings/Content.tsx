import { memo, ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
}

export const Content = memo(({ children }: ContentProps) => {
  return <div className="space-y-4">{children}</div>;
});
