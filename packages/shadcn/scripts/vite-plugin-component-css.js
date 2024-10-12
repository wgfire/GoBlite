import { generateAllCSS } from "./build-css.js";
export default function componentCSSPlugin() {
  return {
    name: "vite-plugin-component-css",
    async writeBundle() {
      await generateAllCSS();
    }
  };
}
