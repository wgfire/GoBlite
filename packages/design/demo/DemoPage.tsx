import React, { useMemo } from "react";
import { Design } from "../src/editor/Design";
import { DesignProvider, useDesignContext } from "../src/context";

const DemoContent: React.FC = () => {
  const Login = () => <div>Login</div>;

  const initialProps = useMemo(
    () => ({
      schema: undefined,
      resolver: {
        Login
      },
      assets: [],
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
