import React, { useEffect } from "react";
import { useEditor } from "@craftjs/core";
import clsx from "clsx";
import { Header } from "./Header";
// import { Sidebar } from "./Sidebar";
import { Toolbox } from "./Toolbox";
import { useDesignContext } from "@/context/useDesignContext";
import { Canvas } from "./Canvas";
import { Sidebar } from "./Sidebar";

interface ViewImportProps {
  children: React.ReactNode;
}

export const ViewImport: React.FC<ViewImportProps> = ({ children }) => {
  const {
    enabled,
    actions: { setOptions }
  } = useEditor(state => ({
    enabled: state.options.enabled
  }));
  const { currentInfo, showSidebar } = useDesignContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        window.parent.postMessage(
          {
            LANDING_PAGE_LOADED: true
          },
          "*"
        );

        setTimeout(() => {
          setOptions(options => {
            options.enabled = true;
          });
        }, 200);
      });
    }
  }, [setOptions]);
  console.log(currentInfo, "信息");

  return (
    <div className="viewport h-screen overflow-hidden">
      <div className={clsx("flex h-full flex-row w-full relative")}>
        <Toolbox />
        <div className="page-container flex flex-1 h-full flex-col overflow-hidden pb-3 bg-gray-100">
          <Header />
          <div
            className={clsx("blite-renderer flex-1 h-full transition overflow-auto mx-auto", {
              "bg-slate-300/30": enabled,
              "w-[430px]": currentInfo.device === "mobile",
              "w-[750px]": currentInfo.device === "tablet",
              "w-[100%]": currentInfo.device === "desktop"
            })}
          >
            <Canvas className="h-full w-full">{children}</Canvas>
          </div>
        </div>
        {showSidebar && <Sidebar />}
      </div>
    </div>
  );
};
