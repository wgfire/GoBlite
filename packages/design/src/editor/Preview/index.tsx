import React from "react";
import { Editor, Frame, Resolver } from "@craftjs/core";
import { Container } from "../../selectors/Container";
import { Text } from "../../selectors/Text";
import { Button } from "../../selectors/Button";
import { Image } from "../../selectors/Image";
import { DesignProvider } from "../../context/Provider";

/**
 * 构建时使用此组件进行打包
 */
interface PreviewProps {
  schema: string;
  resolver?: Partial<Resolver>;
  publish?: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ schema, resolver = {} }) => {
  const defaultResolver = {
    Container,
    Text,
    Button,
    Image,
    ...resolver
  };

  return (
    <DesignProvider>
      <div className="w-full h-full">
        <Editor enabled={false} resolver={defaultResolver}>
          <Frame data={schema} />
        </Editor>
      </div>
    </DesignProvider>
  );
};
