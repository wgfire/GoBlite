import React, { useMemo } from "react";
import { Editor, Frame } from "@craftjs/core";
import { useDesignContext } from "@/context/useDesignContext";
import { Container } from "@/selectors/Container";
import { Text } from "@/selectors/Text";
import { Button } from "@/selectors/Button";
import { Image } from "@/selectors/Image";

export const Preview: React.FC = React.memo(() => {
  const defaultResolver = useMemo(
    () => ({
      Container,
      Text,
      Button,
      Image
    }),
    []
  );
  const initDesign = useMemo(
    () => ({
      resolver: defaultResolver,
      publish: true
    }),
    [defaultResolver]
  );

  const contextData = useDesignContext(initDesign);
  const { resolver, schema } = contextData;

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
