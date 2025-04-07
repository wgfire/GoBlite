/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef9ff",
          100: "#dcf3ff",
          200: "#b3e7ff",
          300: "#66d3ff",
          400: "#1ab8ff",
          500: "#009deb",
          600: "#007dc7",
          700: "#0065a2",
          800: "#005686",
          900: "#003b5c",
          950: "#00253d",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        accent: {
          50: "#eefbf3",
          100: "#d6f5e0",
          200: "#b0eac5",
          300: "#7dd8a2",
          400: "#4abd7a",
          500: "#2ca35f",
          600: "#1e844c",
          700: "#1a6a3f",
          800: "#195536",
          900: "#16462e",
          950: "#07271a",
        },
        dark: {
          100: "#d5d5d5",
          200: "#ababab",
          300: "#808080",
          400: "#565656",
          500: "#2b2b2b",
          600: "#222222",
          700: "#1a1a1a",
          800: "#111111",
          900: "#090909",
          950: "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url("/src/assets/hero-bg.jpg")',
        "cta-pattern": 'linear-gradient(to right, rgba(0, 125, 199, 0.9), rgba(0, 157, 235, 0.8)), url("/src/assets/cta-bg.jpg")',
      },
      boxShadow: {
        glow: "0 0 20px rgba(26, 184, 255, 0.4)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
