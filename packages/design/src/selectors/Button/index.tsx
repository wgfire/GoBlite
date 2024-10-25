import { useNode, UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn";
import { ButtonSettings } from "./ButtonSettings";
import { Text } from "../Text";
import { useTranslate } from "@/hooks/useTranslate";
import { CSSProperties, useEffect } from "react";

export interface ButtonProps {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  background?: string;
  color?: string;
  customStyle?: CSSProperties;
  margin?: 0;
  events?: {
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
  margin,
  customStyle
}: ButtonProps) => {
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp }
  } = useNode();

  const { translateX, translateY } = useTranslate(id);

  useEffect(() => {
    setProp((p: ButtonProps) => {
      p.customStyle!.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  }, [translateX, translateY]);

  return (
    <ShadcnButton
      id={id}
      style={{
        background: `${background}`,
        margin: `${margin}px`,
        transform: `translate(${translateX}px, ${translateY}px)`,
        position: "relative",
        zIndex: 1,
        ...customStyle
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
    color: "rgba(255,255,255,1)",
    variant: "default",
    size: "default",
    text: "Button",
    margin: 0,
    customStyle: {}
  },
  custom: {
    displayName: "Button"
  },
  related: {
    settings: ButtonSettings
  }
};
