import { useNode, UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn/button";
import { ButtonSettings } from "./ButtonSettings";
import { Text } from "../Text";
import { useTranslate } from "@/hooks/useTranslate";

export interface ButtonProps {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  background?: Record<"r" | "g" | "b" | "a", number>;
  color?: Record<"r" | "g" | "b" | "a", number>;
  buttonStyle?: "full" | "outline";
  margin?: 0;
  events: {
    onLoad: string;
    onClick: string;
  };
}

export const Button: UserComponent<ButtonProps> = ({
  text,
  variant = "default",
  size = "default",
  color,
  background,
  margin
}: ButtonProps) => {
  const {
    id,
    connectors: { connect, drag }
  } = useNode();

  const { translateX, translateY } = useTranslate(id);

  return (
    <ShadcnButton
      id={id}
      style={{
        background: `${background ? `rgba(${Object.values(background)})` : ""}`,
        margin: `${margin}px`,
        transform: `translate(${translateX}px, ${translateY}px)`,
        position: "relative",
        zIndex: 1
      }}
      ref={ref => connect(drag(ref as HTMLElement))}
      variant={variant}
      size={size}
      className="rounded-sm"
    >
      <Text text={text} color={color} />
    </ShadcnButton>
  );
};

Button.craft = {
  props: {
    color: { r: 255, g: 255, b: 255, a: 1 },
    buttonStyle: "full",
    text: "Button",
    margin: 0
  },
  custom: {
    displayName: "Button"
  },
  related: {
    settings: ButtonSettings
  }
};
