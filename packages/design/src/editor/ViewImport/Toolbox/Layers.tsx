import { Layers as CLayers } from "@craftjs/layers";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@go-blite/shadcn";
import { LayoutTemplate } from "lucide-react";
export const Layers = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="flex items-center justify-center">
                <LayoutTemplate className="w-4 h-4 mr-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">图层</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent side="right" className="translate-x-2 translate-y-2 h-[70vh]">
        <CLayers expandRootOnLoad></CLayers>
      </PopoverContent>
    </Popover>
  );
};
