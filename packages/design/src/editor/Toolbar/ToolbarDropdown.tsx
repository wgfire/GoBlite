import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@go-blite/shadcn/select";

export interface ToolbarDropdownProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactElement<SelectItemProps>[];
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({ title, value, onChange, children }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        {React.Children.map(children, child => {
          if (React.isValidElement<SelectItemProps>(child)) {
            return (
              <SelectItem key={child.props.value} value={child.props.value}>
                {child.props.children}
              </SelectItem>
            );
          }
          return null;
        })}
      </SelectContent>
    </Select>
  );
};
