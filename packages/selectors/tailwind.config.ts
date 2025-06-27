import type { Config } from "tailwindcss";
const config: Config = {
  mode: "jit",
  presets: [require("@go-blite/shadcn/tailwind.config")],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {}
  },
  plugins: []
};
export default config;
