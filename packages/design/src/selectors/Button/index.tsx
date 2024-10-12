import { useNode, UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn/button";
import { ButtonSettings } from "./ButtonSettings";
export interface ButtonProps {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  background?: Record<"r" | "g" | "b" | "a", number>;
  color?: Record<"r" | "g" | "b" | "a", number>;
  buttonStyle?: "full" | "outline";
  margin?: [string, string, string, string];
}
export const Button: UserComponent<ButtonProps> = ({ text, variant = "default", size = "default" }) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  return (
    <ShadcnButton ref={ref => connect(drag(ref as HTMLElement))} variant={variant} size={size}>
      {text}
    </ShadcnButton>
  );
};

Button.craft = {
  displayName: "Button",
  props: {
    background: { r: 255, g: 255, b: 255, a: 0.5 },
    color: { r: 92, g: 90, b: 90, a: 1 },
    buttonStyle: "full",
    text: "Button",
    margin: ["5", "0", "5", "0"]
  },
  related: {
    toolbar: ButtonSettings
  }
};
