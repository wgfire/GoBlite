import { useNode, UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn";
import { ButtonSettings } from "./ButtonSettings";
import { Text } from "../Text/Text.edit";
import { useTranslate } from "@/hooks/useTranslate";
import { useEffect } from "react";
import eventScripts from "@go-blite/events";
import { ButtonProps } from "./type";

export const Button: UserComponent<ButtonProps> = props => {
  const { text, variant = "default", size = "default", color, background, margin, events } = props.baseStyle;
  const customStyle = props.customStyle;
  const {
    id,
    connectors: { connect, drag },
    actions: { setProp }
  } = useNode();

  const { translateX, translateY } = useTranslate(id);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (events?.onClick) {
      const handler = eventScripts[events.onClick]?.handler;

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
        ...customStyle
      }}
      ref={ref => connect(drag(ref as HTMLElement))}
      variant={variant}
      size={size}
      className="rounded-sm pointer-events-auto"
    >
      <Text baseStyle={{ text, color, shadow: 0, textAlign: "center" }} />
    </ShadcnButton>
  );
};

Button.craft = {
  props: {
    baseStyle: {
      color: "rgba(255,255,255,1)",
      variant: "default",
      size: "default",
      text: "Button",
      margin: 0
    },
    customStyle: {}
  },
  custom: {
    displayName: "Button"
  },
  related: {
    settings: ButtonSettings
  }
};
