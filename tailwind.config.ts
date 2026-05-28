import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mint: "#14b8a6",
        coral: "#fb7185",
        sky: "#38bdf8",
        amber: "#f59e0b",
        violet: "#8b5cf6",
      },
    },
  },
  plugins: [],
};

export default config;
