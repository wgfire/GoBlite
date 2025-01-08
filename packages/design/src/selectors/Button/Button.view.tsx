import { useNode, UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn";
import { ButtonSettings } from "./ButtonSettings";
import eventScripts from "@go-blite/events";
import ContentEditable from "react-contenteditable";
import { ButtonProps } from "./type";
import { ElementBoxView } from "@/components/ElementBox";

export const Button: UserComponent<ButtonProps> = ({ style, customStyle, events, ...props }) => {
  const {
    id,
    connectors: { connect, drag }
  } = useNode();
  const { background, margin, color } = style;
  const { text, variant, size } = props;

  /*
   * 如果是构建部署环境，那么需要从window找到当前的脚本handler
   */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (events?.onClick) {
      const handler = eventScripts[events.onClick.name]?.handler;

      if (handler) {
        handler({ target: e.currentTarget, eventName: events.onClick.name, data: "携带的数据" });
      }
    }
  };

  return (
    <ElementBoxView
      id={id}
      data-id={id}
      style={{
        background: `${background}`,
        margin: `${margin}px`,
        position: "relative",
        zIndex: 1,
        ...customStyle
      }}
    >
      <ShadcnButton
        onClick={handleClick}
        ref={ref => connect(drag(ref as HTMLElement))}
        variant={variant}
        size={size}
        className="rounded-sm w-full h-full"
      >
        <ContentEditable html={text || ""} disabled={true} style={{ color }} tagName="h2" onChange={() => void 0} />
      </ShadcnButton>
    </ElementBoxView>
  );
};

Button.craft = {
  props: {
    style: {
      margin: 0,
      color: "rgba(255,255,255,1)"
    },
    variant: "default",
    size: "default",
    text: "Button",

    customStyle: {}
  },
  custom: {
    displayName: "Button"
  },
  related: {
    settings: ButtonSettings
  }
};
