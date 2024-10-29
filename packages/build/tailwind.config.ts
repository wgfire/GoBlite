import type { Config } from "tailwindcss";
const config: Config = {
  presets: [require("@go-blite/shadcn/tailwind.config")],
  mode: "jit",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {}
  },
  plugins: []
};
export default config;
