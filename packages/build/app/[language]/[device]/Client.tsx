"use client";
import React from "react";
import "@go-blite/design/style";
import { DesignProvider, Preview } from "@go-blite/design";

const DesignPage: React.FC<{ initialData }> = ({ initialData }) => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <DesignProvider
        initialProps={{
          schema: initialData,
          publish: true
        }}
      >
        <Preview />
      </DesignProvider>
    </div>
  );
};

export default DesignPage;
