import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const hsl = (v: string) => `hsl(var(--${v}))`;

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        heading: ["Outfit", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: hsl("border"),
        input: hsl("input"),
        ring: hsl("ring"),
        background: hsl("background"),
        foreground: hsl("foreground"),
        primary: { DEFAULT: hsl("primary"), foreground: hsl("primary-foreground") },
        secondary: { DEFAULT: hsl("secondary"), foreground: hsl("secondary-foreground") },
        muted: { DEFAULT: hsl("muted"), foreground: hsl("muted-foreground") },
        accent: { DEFAULT: hsl("accent"), foreground: hsl("accent-foreground") },
        destructive: { DEFAULT: hsl("destructive"), foreground: hsl("destructive-foreground") },
        card: { DEFAULT: hsl("card"), foreground: hsl("card-foreground") },
        navy: { DEFAULT: hsl("navy"), light: hsl("navy-light") },
        "super-dream": hsl("super-dream"),
        dream: hsl("dream"),
        standard: hsl("standard"),
        regular: hsl("regular"),
        expert: hsl("expert"),
        advanced: hsl("advanced"),
        pro: hsl("pro"),
        beginner: hsl("beginner"),
        sidebar: {
          DEFAULT: hsl("sidebar-background"),
          foreground: hsl("sidebar-foreground"),
          accent: hsl("sidebar-accent"),
          border: hsl("sidebar-border"),
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        glow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37,99,235,0.0)", opacity: "1" },
          "50%": { boxShadow: "0 0 10px 2px rgba(37,99,235,0.45)", opacity: "0.85" },
        },
      },
      animation: { glow: "glow 2s ease-in-out infinite" },
    },
  },
  plugins: [animate],
} satisfies Config;
