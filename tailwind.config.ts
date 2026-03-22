import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // NFL Stat Guru PRD v1.0 (STRICT)
        "bg-base": "var(--bg-base)",
        "bg-card": "var(--bg-card)",
        "bg-card2": "var(--bg-card2)",
        "bg-hover": "var(--bg-hover)",
        border: "var(--border)",
        "border-md": "var(--border-md)",
        "border-lg": "var(--border-lg)",
        txt: "var(--txt)",
        "txt-2": "var(--txt-2)",
        "txt-3": "var(--txt-3)",
        "neon-green": "var(--neon-green)",
        "neon-orange": "var(--neon-orange)",
        "neon-blue": "var(--neon-blue)",
        "neon-purple": "var(--neon-purple)",
      },
      boxShadow: {
        "glow-g": "var(--shadow-glow-g)",
        "glow-o": "var(--shadow-glow-o)",
        "glow-b": "var(--shadow-glow-b)",
      },
      fontSize: {
        hero: "var(--text-hero)",
        h1: "var(--text-h1)",
        h2: "var(--text-h2)",
        h3: "var(--text-h3)",
        body: "var(--text-body)",
        sm: "var(--text-sm)",
        xs: "var(--text-xs)",
        stat: "var(--text-stat)",
      },
      borderRadius: {
        "gridiq-sm": "var(--radius-sm)",
        "gridiq-md": "var(--radius-md)",
        "gridiq-lg": "var(--radius-lg)",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        scroll: "scroll 35s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;

