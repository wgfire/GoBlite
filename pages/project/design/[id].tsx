import { Editor, Element, Frame } from "@craftjs/core";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { useEffect } from "react";

import { Viewport, RenderNode } from "@platform/components/editor";
import { Container, Text } from "@platform/components/selectors";
import { Button } from "@platform/components/selectors/Button";
import { Video } from "@platform/components/selectors/Video";
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.params;
  return { props: { designCode: id } };
};
export const Design = (props) => {
  console.log(props);
  useEffect(() => {
    console.log("我是设计页面");
  }, []);

  return (
    <div className="h-full h-screen">
      <NextSeo
        title="Craft.js"
        description="A React framework for building drag-n-drop page editors."
        canonical="https://craft.js.org/"
        twitter={{
          site: "craft.js.org",
          cardType: "summary_large_image",
        }}
      />
      <Editor
        resolver={{
          Container,
          Text,
          Button,
          Video,
        }}
        enabled={false}
        onRender={RenderNode}
      >
        <Viewport>
          <Frame>
            <Element
              canvas
              is={Container}
              width="80%"
              height="auto"
              background={{ r: 255, g: 255, b: 255, a: 1 }}
              padding={["40", "40", "40", "40"]}
              custom={{ displayName: "App" }}
            >
       
            </Element>
          </Frame>
        </Viewport>
      </Editor>
    </div>
  );
};

export default Design;
