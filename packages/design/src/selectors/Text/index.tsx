import { useNode, useEditor } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import { TextSettings } from "./TextSettings";
import { Resizer } from "@/components/Resizer";

export type TextProps = {
  fontSize: string;
  textAlign: string;
  fontWeight: string;
  color: string;
  shadow: number;
  text: string;
  margin: number;
  padding: number;
  customStyle: React.CSSProperties;
};

export const Text = (props: Partial<TextProps>) => {
  const { fontSize, textAlign, fontWeight, color, shadow, text, margin, padding, customStyle } = props;
  const {
    id,
    connectors: { connect },
    setProp
  } = useNode();
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));
  return (
    <Resizer
      propKey={{ width: "width", height: "height" }}
      data-id={id}
      style={{
        margin: `${margin}px`,
        ...customStyle
      }}
    >
      <ContentEditable
        innerRef={connect}
        html={text || ""}
        disabled={!enabled}
        onChange={e => {
          setProp(prop => (prop.text = e.target.value), 500);
        }}
        tagName="h2"
        style={{
          padding: `${padding}px`,
          color: `${color}`,
          fontSize: `${fontSize}px`,
          textShadow: `0px 0px 2px rgba(0,0,0,${shadow || 0})`,
          fontWeight,
          textAlign
        }}
      />
    </Resizer>
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
    text: "Text",
    customStyle: {}
  },
  related: {
    settings: TextSettings
  }
};
