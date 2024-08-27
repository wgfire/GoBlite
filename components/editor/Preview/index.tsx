/**
 * 落地页ssg渲染页面
 */
import { Frame, Editor, Resolver } from "@craftjs/core";
import { Container, Text, Button, Video, Image } from "../../selectors";
import { PlatformProvider } from "../../context";

export interface PreviewProps {
  schema: string;
  resolver?: Resolver;
  publish?: boolean;
}
export const Preview: React.FC<PreviewProps> = (props) => {
  console.log(props);
  const resolvers = {
    Container,
    Text,
    Button,
    Video,
    Image,
    ...(props.resolver ?? {}),
  };
  return (
    <PlatformProvider publish={props.publish ?? false}>
      <div className="w-full h-full">
        <Editor enabled={false} resolver={resolvers}>
          <Frame data={props.schema}></Frame>
        </Editor>
      </div>
    </PlatformProvider>
  );
};

export default Preview;
