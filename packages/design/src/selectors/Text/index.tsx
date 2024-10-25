import { useNode, useEditor } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import { TextSettings } from "./TextSettings";

export type TextProps = {
  fontSize: string;
  textAlign: string;
  fontWeight: string;
  color: string;
  shadow: number;
  text: string;
  margin: number;
  padding: number;
};

export const Text = ({ fontSize, textAlign, fontWeight, color, shadow, text, margin, padding }: Partial<TextProps>) => {
  const {
    connectors: { connect },
    setProp
  } = useNode();
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));
  return (
    <ContentEditable
      innerRef={connect}
      html={text || ""}
      disabled={!enabled}
      onChange={e => {
        setProp(prop => (prop.text = e.target.value), 500);
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
    fontSize: "16",
    textAlign: "left",
    fontWeight: "500",
    color: "rgba(0,0,0,1)",
    margin: 0,
    padding: 0,
    shadow: 0,
    text: "Text"
  },
  related: {
    settings: TextSettings
  }
};
