import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@go-blite/shadcn";
import { ChevronsUpDown } from "lucide-react";
import { Separator } from "@go-blite/shadcn";

interface SectionProps {
  title: string | ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const Section = ({ title, children, defaultOpen }: SectionProps) => {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <div className="w-full flex gap-2 justify-between items-center font-medium text-sm cursor-pointer">
          {title}
          <ChevronsUpDown className="h-4 w-4" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        {children}
        <Separator className="my-4" />
      </CollapsibleContent>
    </Collapsible>
  );
};
