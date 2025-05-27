import type { Config } from "tailwindcss";
const config: Config = {
  presets: [require("@go-blite/shadcn/tailwind.config")],
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
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
