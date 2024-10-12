import React, { useMemo } from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import { RenderNode } from "../RenderNode";
import { ViewImport } from "../ViewImport";
import { Container } from "@/selectors/Container";
import { useDesignContext } from "@/context/useDesignContext";

export const Design: React.FC = React.memo(() => {
  const { resolver, schema, onRender, publish } = useDesignContext({ publish: true });

  console.log(resolver, publish, "xx");

  const renderCallback = useMemo(() => onRender || RenderNode, [onRender]);

  const frameElement = useMemo(
    () => (
      <Element
        canvas
        is={Container}
        width="100%"
        height="100%"
        background={{ r: 255, g: 255, b: 255, a: 1 }}
        padding={["10", "10", "10", "10"]}
        custom={{ displayName: "App" }}
      />
    ),
    []
  );

  return (
    <div className="h-full w-full">
      <Editor resolver={resolver} enabled={true} onRender={renderCallback}>
        <ViewImport>
          <Frame data={schema}>{frameElement}</Frame>
        </ViewImport>
      </Editor>
    </div>
  );
});

Design.displayName = "Design";
