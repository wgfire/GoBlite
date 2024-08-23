import { Editor, Frame, Element } from "@craftjs/core";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { NextSeo } from "next-seo";
import React from "react";

import { Viewport, RenderNode } from "@platform/components/editor";
import { Container, Text } from "@platform/components/selectors";
import { Button } from "@platform/components/selectors/Button";
import { Custom1, OnlyButtons } from "@platform/components/selectors/Custom1";
import { Custom2, Custom2VideoDrop } from "@platform/components/selectors/Custom2";
import { Custom3, Custom3BtnDrop } from "@platform/components/selectors/Custom3";
import { Video } from "@platform/components/selectors/Video";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["acumin-pro", "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
            Custom1,
            Custom2,
            Custom2VideoDrop,
            Custom3,
            Custom3BtnDrop,
            OnlyButtons,
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
                width="800px"
                height="auto"
                background={{ r: 255, g: 255, b: 255, a: 1 }}
                padding={["40", "40", "40", "40"]}
                custom={{ displayName: "App" }}
              >
                <Element
                  canvas
                  is={Container}
                  flexDirection="row"
                  width="100%"
                  height="auto"
                  padding={["40", "40", "40", "40"]}
                  margin={["0", "0", "40", "0"]}
                  custom={{ displayName: "Introduction" }}
                >
                  <Element canvas is={Container} width="40%" height="100%" padding={["0", "20", "0", "20"]} custom={{ displayName: "Heading" }}>
                    <Text fontSize="23" fontWeight="400" text="Craft.js is a React framework for building powerful &amp; feature-rich drag-n-drop page editors."></Text>
                  </Element>
                  <Element canvas is={Container} width="60%" height="100%" padding={["0", "20", "0", "20"]} custom={{ displayName: "Description" }}>
                    <Text
                      fontSize="14"
                      fontWeight="400"
                      text="Everything you see here, including the editor, itself is made of React components. Craft.js comes only with the building blocks for a page editor; it provides a drag-n-drop system and handles the way user components should be rendered, updated and moved, among other things. <br /> <br /> You control the way your editor looks and behave."
                    ></Text>
                  </Element>
                </Element>
              </Element>
            </Frame>
          </Viewport>
        </Editor>
      </div>
    </ThemeProvider>
  );
}

export default App;
