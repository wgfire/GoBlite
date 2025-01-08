import React, { useMemo } from "react";
import { Editor, Frame } from "@craftjs/core";
import { useDesignContext } from "@/context/useDesignContext";
import { Container } from "@/selectors/Container/Container.view";
import { Text } from "@/selectors/Text/Text.view";
import { Button } from "@/selectors/Button/Button.view";
import { Image } from "@/selectors/Image/Image.view";
import { App } from "@/selectors/App/App.view";

export const Preview: React.FC = React.memo(() => {
  const defaultResolver = useMemo(
    () => ({
      App,
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
