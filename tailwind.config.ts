import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2937",
        mint: "#1fbf9a",
        coral: "#f97363",
      },
    },
  },
  plugins: [],
};

export default config;
