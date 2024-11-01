import { UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn";

import { Text } from "../Text";

import { EventScript } from "@go-blite/events";
import { ButtonProps } from "./type";

export const Button: UserComponent<ButtonProps> = props => {
  const { text, variant = "default", size = "default", color, background, margin, events } = props.baseStyle;
  const customStyle = props.customStyle;

  /*
   * 如果是构建部署环境，那么需要从window找到当前的脚本handler
   */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (events?.onClick) {
      const handler = (window[events.onClick as keyof typeof window] as EventScript)?.handler;
      if (handler) {
        handler({ target: e.currentTarget, eventName: events.onClick, data: "携带的数据" });
      }
    }
  };

  return (
    <ShadcnButton
      onClick={handleClick}
      style={{
        background: `${background}`,
        margin: `${margin}px`,
        ...customStyle
      }}
      variant={variant}
      size={size}
      className="rounded-sm"
    >
      <Text text={text} color={color} />
    </ShadcnButton>
  );
};
