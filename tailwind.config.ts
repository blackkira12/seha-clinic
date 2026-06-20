import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        safe: {
          bg: "#ecfdf5",
          text: "#047857",
          border: "#a7f3d0",
        },
        warn: {
          bg: "#fffbeb",
          text: "#b45309",
          border: "#fde68a",
        },
        danger: {
          bg: "#fef2f2",
          text: "#b91c1c",
          border: "#fecaca",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
