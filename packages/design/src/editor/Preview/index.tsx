import React, { useMemo } from "react";
import { Editor, Frame, Resolver, SerializedNodes } from "@craftjs/core";
import { Container } from "@/selectors/Container";
import { Text } from "@/selectors/Text/Text.view";
import { Button } from "@/selectors/Button/Button.edit";
import { Image } from "@/selectors/Image";

export interface PreviewProps {
  schema: SerializedNodes;
  resolver?: Resolver;
}
export const Preview: React.FC<PreviewProps> = React.memo(({ schema, resolver }) => {
  const defaultResolver = useMemo(
    () => ({
      Container,
      Text,
      Button,
      Image
    }),
    []
  );

  const mergedResolver = useMemo(
    () => ({
      ...defaultResolver,
      ...resolver
    }),
    [defaultResolver, resolver]
  );

  return (
    <Editor resolver={mergedResolver} enabled={false}>
      <Frame data={schema}></Frame>
    </Editor>
  );
});
