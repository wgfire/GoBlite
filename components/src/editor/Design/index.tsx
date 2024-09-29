import { Editor, Element, Frame, Resolver } from "@craftjs/core";
import { RenderNode } from "../RenderNode";
import { Viewport } from "../Viewport";
import { NextSeo } from "next-seo";
import { Container, Text, Button, Video, Image } from "../../selectors";
import { PlatformProvider } from "../../context";

export interface DesignProps {
  resolver?: Resolver;
  onRender?: React.ComponentType<{
    render: React.ReactElement;
  }>;
  schema?: any;
}
export const Design: React.FC<DesignProps> = (props) => {
  const resolvers = {
    Container,
    Text,
    Button,
    Video,
    Image,
    ...(props.resolver ?? {}),
  };

  return (
    <PlatformProvider >
      <div className="h-full">
        <NextSeo title="Go-Blite design" description="简单、高效的静态设计器平台" />
        <Editor resolver={resolvers} enabled={false} onRender={RenderNode}>
          <Viewport>
            <Frame data={props.schema}>
              <Element
                canvas
                is={Container}
                width="100%"
                background={{ r: 255, g: 255, b: 255, a: 1 }}
                padding={["10", "10", "10", "10"]}
                custom={{ displayName: "App" }}
              ></Element>
            </Frame>
          </Viewport>
        </Editor>
      </div>
    </PlatformProvider>
  );
};
