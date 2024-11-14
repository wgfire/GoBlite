import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { Button as ShadcnButton } from "@go-blite/shadcn";
import { ButtonSettings } from "./ButtonSettings";
import eventScripts from "@go-blite/events";
import { Resizer } from "@/components/Resizer";
import ContentEditable from "react-contenteditable";
import { ButtonProps } from "./type";
import { ButtonSettingsFast } from "./ButtonSettingsFast";
import { useEffect } from "react";
import ElementBox from "@/components/ElementBox";

export const defaultProps: Partial<ButtonProps> = {
  style: {
    margin: 0,
    color: "rgba(255,255,255,1)",
    borderRadius: 10,
    fontSize: 14
  },
  variant: "default",
  size: "default",
  text: "Button",

  customStyle: {}
};

export const Button: UserComponent<Partial<ButtonProps>> = ({ style, customStyle, events, ...props }) => {
  const {
    id,
    actions: { setProp }
  } = useNode();
  const { color } = style!;
  const { text, variant, size } = props;

  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));

  useEffect(() => {
    // 当variant变化时，清空color值
    setProp((prop: ButtonProps) => {
      prop.style.color = undefined;
      prop.style.backgroundColor = undefined;
    });
  }, [variant]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (events?.onClick) {
      const handler = eventScripts[events.onClick.name]?.handler;

      if (handler) {
        handler({ target: e.currentTarget, eventName: events.onClick.name, data: "携带的数据" });
      }
    }
  };

  return (
    <ElementBox
      id={id}
      data-id={id}
      style={{
        position: "relative",
        transform: customStyle?.transform || "translate(0,0)",
        width: "max-content"
      }}
    >
      <Resizer propKey={{ width: "width", height: "height" }}>
        <ShadcnButton
          onClick={handleClick}
          variant={variant}
          size={size}
          style={{
            ...style
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
      </Resizer>
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
