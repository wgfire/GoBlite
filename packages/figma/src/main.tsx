import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AutoParser from "./pages/autoParser/index.tsx";
import "./index.css";
import { PluginProvider } from "./context/index.tsx";

document.addEventListener("DOMContentLoaded", function () {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <PluginProvider>
        <AutoParser />
      </PluginProvider>
    </StrictMode>
  );
});
