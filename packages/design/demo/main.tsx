import React from "react";
import ReactDOM from "react-dom/client";
import { DemoPage } from "./DemoPage";
import "@go-blite/shadcn/style";
import "../src/styles/tailwind.css"; // 添加这一行

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <DemoPage />
  </React.StrictMode>
);
