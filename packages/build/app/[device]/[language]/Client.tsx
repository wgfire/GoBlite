"use client";
import React, { useMemo } from "react";
import "@go-blite/design/style";
import { DesignProvider, Preview } from "@go-blite/design";

const DesignPage: React.FC<{ initialData: object }> = ({ initialData }) => {
  console.log(initialData, "构建数据");

  const initialProps = useMemo(
    () => ({
      schema: initialData,
      publish: true
    }),
    []
  );
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <DesignProvider initialProps={initialProps}>
        <Preview />
      </DesignProvider>
    </div>
  );
};
export default DesignPage;
