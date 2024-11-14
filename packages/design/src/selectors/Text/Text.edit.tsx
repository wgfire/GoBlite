import { useNode, useEditor, UserComponent } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import { TextSettings } from "./TextSettings";
// import { Resizer } from "@/components/Resizer";
import { TextProps } from "./type";
import { TextSettingsFast } from "./TextSettingFast";
import ElementBox from "@/components/ElementBox";

export const Text: UserComponent<Partial<TextProps>> = props => {
  const { style, text, customStyle } = props;
  const { shadow, fontSize } = style || {};
  const {
    id,
    connectors: { connect },
    setProp
  } = useNode();
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));
  console.log(fontSize, "fontSize", style);
  return (
    <ElementBox
      id={id}
      style={{
        transform: customStyle?.transform || "translate(0,0)",
        width: "max-content"
      }}
    >
      <ContentEditable
        innerRef={connect}
        html={text || ""}
        disabled={!enabled}
        onChange={e => {
          setProp(prop => (prop.text = e.target.value), 500);
        }}
        tagName="p"
        style={{
          ...style,
          textShadow: `0px 0px 2px rgba(0,0,0,${shadow || 0})`,
          width: "max-content"
        }}
      />
    </ElementBox>
  );
};

Text.craft = {
  custom: {
    displayName: "Text"
  },
  props: {
    style: {
      fontSize: 16,
      textAlign: "left",
      fontWeight: "500",
      color: "rgba(0,0,0,1)",
      margin: 0,
      padding: 0,
      shadow: 0
    },
    text: "Text",
    customStyle: {}
  },
  related: {
    settings: TextSettings,
    fastSettings: TextSettingsFast
  }
};
