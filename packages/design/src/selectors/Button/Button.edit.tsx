import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn";
import { ButtonSettings } from "./ButtonSettings";
import eventScripts from "@go-blite/events";
import ContentEditable from "react-contenteditable";
import { ButtonProps } from "./type";
import { ButtonSettingsFast } from "./ButtonSettingsFast";
import ElementBox from "@/components/ElementBox";
import { useUpdateEffect } from "ahooks";
import { executeUserScript } from "@/utils/script/scriptRunner";

export const defaultProps: Partial<ButtonProps> = {
  style: {
    width: "100%",
    height: "100%"
  },
  customStyle: {
    width: 64,
    height: 35,
    margin: 0,
    color: "rgba(255,255,255,1)",
    borderRadius: 10,
    fontSize: 14
  },
  variant: "default",
  size: "default",
  text: "Button",
  useSafeArea: true
};

export const Button: UserComponent<Partial<ButtonProps>> = ({ style, customStyle, events, ...props }) => {
  const {
    id,
    actions: { setProp },
    connectors: { connect }
  } = useNode();
  const { color } = style!;
  const { text, variant, size } = props;

  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));

  useUpdateEffect(() => {
    // 当variant变化时，清空color值
    if (variant) {
      setProp((prop: ButtonProps) => {
        prop.style.color = undefined;
        prop.style.backgroundColor = undefined;
      });
    }
  }, [variant]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enabled) return;
    if (events?.onClick?.type === "builtin") {
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
    } else {
      executeUserScript(events?.onClick?.value || "", {
        window,
        element: e.currentTarget,
        event: e.nativeEvent as Event
      });
    }
  };

  return (
    <ElementBox
      ref={node => node && connect(node)}
      id={id}
      data-id={id}
      style={{
        position: "relative",
        ...customStyle
      }}
    >
      <ShadcnButton
        onClick={handleClick}
        variant={variant}
        size={size}
        style={{
          ...style,
          fontSize: parseInt(style?.fontSize as string) + "px"
        }}
        className="rounded-sm"
      >
        <ContentEditable
          html={text || ""}
          disabled={!enabled}
          style={{ color }}
          onChange={e => {
            setProp((prop: ButtonProps) => {
              prop.text = e.target.value;
            });
          }}
          tagName="h2"
        />
      </ShadcnButton>
    </ElementBox>
  );
};

Button.craft = {
  props: defaultProps,
  custom: {
    displayName: "Button"
  },
  related: {
    settings: ButtonSettings,
    fastSettings: ButtonSettingsFast
  }
};
