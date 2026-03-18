import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f5efe6",
        shell: "#fffaf2",
        ink: "#111827",
        slate: "#334155",
        ember: "#ff7a18",
        teal: "#0f9d9a",
        navy: "#0f172a"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      boxShadow: {
        glow: "0 20px 60px rgba(15, 157, 154, 0.18)",
        card: "0 20px 80px rgba(15, 23, 42, 0.1)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
