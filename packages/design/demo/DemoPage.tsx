import React, { useMemo } from "react";
import { Design } from "../src/editor/Design";
import { DesignProvider, useDesignContext } from "../src/context";
import { DesignContextProps } from "@/context/Provider";
const mockSchema = {
  ROOT: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fillSpace: "no",
      padding: 10,
      margin: 0,
      background: {
        r: 255,
        g: 255,
        b: 255,
        a: 1
      },
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      },
      shadow: 0,
      radius: 0,
      width: "100%",
      height: "auto"
    },
    custom: {
      displayName: "App"
    },
    hidden: false,
    nodes: ["PFCsYSLefc"],
    linkedNodes: {}
  },
  PFCsYSLefc: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fillSpace: "no",
      padding: 0,
      margin: 0,
      background: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.1
      },
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      },
      shadow: 0,
      radius: 0,
      width: "300px",
      height: "300px"
    },
    custom: {
      displayName: "Container"
    },
    parent: "ROOT",
    hidden: false,
    nodes: [],
    linkedNodes: {}
  }
};
const DemoContent: React.FC = () => {
  const Login = () => <div>Login</div>;

  const initialProps = useMemo<DesignContextProps>(
    () => ({
      schema: mockSchema,
      resolver: {
        Login: Login
      },
      assets: [
        {
          name: "Login-200/300",
          url: "https://picsum.photos/200/300",
          type: "Image"
        },
        {
          name: "content-1000/400",
          url: "https://picsum.photos/1000/400",
          type: "Image"
        },
        {
          name: "content1-1000/400",
          url: "https://picsum.photos/1000/400",
          type: "Image"
        },
        {
          name: "content2-1000/400",
          url: "https://picsum.photos/1000/400",
          type: "Image"
        }
      ],
      publish: false
    }),
    []
  );

  const { resolver, schema } = useDesignContext(initialProps);

  console.log({ resolver, schema }, "Design context data");

  return <Design />;
};

export const DemoPage: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <DesignProvider>
        <DemoContent />
      </DesignProvider>
    </div>
  );
};
