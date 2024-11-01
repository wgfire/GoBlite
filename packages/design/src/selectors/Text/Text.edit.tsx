import { useNode, UserComponent } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import { TextSettings } from "./TextSettings";
import { TextProps } from "./type";

export const Text: UserComponent<TextProps> = props => {
  const {
    connectors: { connect },
    setProp
  } = useNode();
  const { text, fontSize, textAlign, fontWeight, color, margin, padding, shadow } = props.baseStyle;

  return (
    <ContentEditable
      innerRef={connect}
      html={text || ""}
      disabled={false}
      onChange={e => {
        console.log(e, "xx");
        setProp(prop => (prop.baseStyle.text = e.target.value), 500);
      }}
      tagName="h2"
      style={{
        margin: `${margin}px`,
        padding: `${padding}px`,
        color: `${color}`,
        fontSize: `${fontSize}px`,
        textShadow: `0px 0px 2px rgba(0,0,0,${shadow || 0})`,
        fontWeight,
        textAlign
      }}
    />
  );
};

Text.craft = {
  custom: {
    displayName: "Text"
  },
  props: {
    baseStyle: {
      fontSize: "16",
      textAlign: "left",
      fontWeight: "500",
      color: "rgba(0,0,0,1)",
      margin: 0,
      padding: 0,
      shadow: 0,
      text: "Text"
    }
  },
  related: {
    settings: TextSettings
  }
};
