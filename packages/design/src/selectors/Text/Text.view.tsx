import { useNode, useEditor, UserComponent } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import { TextSettings } from "./TextSettings";
import { TextProps } from "./type";
import { ElementBoxView } from "@/components/ElementBox";
import { useI18n } from "@/hooks";

export const Text: UserComponent<Partial<TextProps>> = props => {
  const { style, customStyle, i18n = {} } = props;
  const { shadow } = style || {};
  const { id } = useNode();
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));
  const { text } = i18n;
  const { getText } = useI18n(id, ["text"]);

  const textValue = getText("text") || text;

  return (
    <ElementBoxView
      data-id={id}
      id={id}
      style={{
        ...customStyle
      }}
    >
      <ContentEditable
        html={textValue || ""}
        disabled={!enabled}
        onChange={() => {}}
        tagName="h2"
        style={{
          ...style,
          fontSize: parseInt(style?.fontSize as string) + "px",
          textShadow: `0px 0px 2px rgba(0,0,0,${shadow || 0})`,
          width: "100%"
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
