import React, { useEffect } from "react";
import { useEditor } from "@craftjs/core";
import clsx from "clsx";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Toolbox } from "./Toolbox";

interface ViewImportProps {
  children: React.ReactNode;
}

export const ViewImport: React.FC<ViewImportProps> = ({ children }) => {
  const {
    enabled,
    connectors,
    actions: { setOptions }
  } = useEditor(state => ({
    enabled: state.options.enabled
  }));

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

  return (
    <div className="viewport h-full">
      <div className={clsx("flex h-full overflow-hidden flex-row w-full")}>
        <Toolbox />
        <div className="page-container flex flex-1 h-full flex-col overflow-hidden">
          <Header />
          <div
            className={clsx("craftjs-renderer flex-1 h-full w-full transition overflow-auto ", {
              "bg-slate-300/30": enabled
            })}
            ref={ref => ref && connectors.select(connectors.hover(ref, "root"), "root")}
          >
            <div className="relative">{children}</div>
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};
