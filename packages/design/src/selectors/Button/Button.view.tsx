import { useNode, UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn";
import { ButtonSettings } from "./ButtonSettings";
import eventScripts from "@go-blite/events";
import { executeUserScript } from "@/utils/script/scriptRunner";
import ContentEditable from "react-contenteditable";
import { ButtonProps } from "./type";
import { ElementBoxView } from "@/components/ElementBox";

export const Button: UserComponent<ButtonProps> = ({ style, customStyle, events, useSafeArea, ...props }) => {
  const {
    id,
    connectors: { connect, drag }
  } = useNode();
  const { color } = style;
  const { text, variant, size } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(events, "按钮点击事件", eventScripts);
    if (!events?.onClick) return;

    if (events.onClick.type === "builtin") {
      const eventValue = Object.values(eventScripts);
      const event = eventValue.find(item => {
        return item.name === events.onClick?.value;
      });
      if (event) {
        const handler = event.handler;

        if (handler) {
          handler({ target: e.currentTarget, eventName: event.name as string, data: "携带的数据" });
        }
      }
    } else if (events.onClick.type === "script") {
      executeUserScript(events.onClick.value, {
        window,
        element: e.currentTarget,
        event: e.nativeEvent as Event
      });
    }
  };

  return (
    <ElementBoxView
      id={id}
      data-id={id}
      style={{
        position: "relative",
        width: "max-content",
        zIndex: 1,
        ...customStyle,
        // 如果启用了安全区域，并且自定义样式中未设置marginBottom，则添加安全区域边距
        ...(!customStyle?.marginBottom && useSafeArea ? { marginBottom: "var(--safe-area-bottom)" } : {})
      }}
    >
      <ShadcnButton
        onClick={handleClick}
        ref={ref => connect(drag(ref as HTMLElement))}
        variant={variant}
        size={size}
        style={{
          ...style,
          fontSize: parseInt(style?.fontSize as string) + "px"
        }}
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
    // 默认不启用安全区域
    useSafeArea: false,
    customStyle: {}
  },
  custom: {
    displayName: "Button"
  },
  related: {
    settings: ButtonSettings
  }
};
