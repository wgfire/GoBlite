import type { Config } from "tailwindcss";
const config: Config = {
  mode: "jit",
  presets: [require("@go-blite/shadcn/tailwind.config")],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        box: "var(--box)",
        douyin: {
          pink: "#FE2C55",
          red: "#FF0050",
          yellow: "#FFFC00"
        }
      }
    }
  },
  plugins: []
};
export default config;
