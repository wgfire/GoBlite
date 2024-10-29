import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn";
import { ButtonSettings } from "./ButtonSettings";
import { Text } from "../Text";
import { useTranslate } from "@/hooks/useTranslate";
import { CSSProperties, useEffect } from "react";
import eventScripts, { EventScript } from "@go-blite/events";
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
  customStyle,
  events
}: ButtonProps) => {
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp }
  } = useNode();

  const { translateX, translateY } = useTranslate(id);

  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));
  /*
   * 如果是构建部署环境，那么需要从window找到当前的脚本handler
   */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (events?.onClick) {
      const handler = enabled
        ? eventScripts[events.onClick]?.handler
        : (window[events.onClick as keyof typeof window] as EventScript)?.handler;
      if (handler) {
        handler({ target: e.currentTarget, eventName: events.onClick, data: "携带的数据" });
      }
    }
  };
  useEffect(() => {
    setProp((p: ButtonProps) => {
      p.customStyle!.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  }, [translateX, translateY]);

  return (
    <ShadcnButton
      onClick={handleClick}
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
