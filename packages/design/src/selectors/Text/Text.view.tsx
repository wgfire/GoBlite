import { useNode, useEditor, UserComponent } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import { TextSettings } from "./TextSettings";
import { TextProps } from "./type";
import { ElementBoxView } from "@/components/ElementBox";

export const Text: UserComponent<Partial<TextProps>> = props => {
  const { style, text, customStyle } = props;
  const { shadow } = style || {};
  const { id, setProp } = useNode();
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));
  return (
    <ElementBoxView
      data-id={id}
      id={id}
      style={{
        ...customStyle
      }}
    >
      <ContentEditable
        html={text || ""}
        disabled={!enabled}
        onChange={e => {
          setProp(prop => (prop.text = e.target.value), 500);
        }}
        tagName="h2"
        style={{
          ...style,
          textShadow: `0px 0px 2px rgba(0,0,0,${shadow || 0})`,
          width: "max-content"
        }}
      />
    </ElementBoxView>
  );
};

Text.craft = {
  custom: {
    displayName: "Text"
  },
  props: {
    style: {
      fontSize: "16",
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
    settings: TextSettings
  }
};
