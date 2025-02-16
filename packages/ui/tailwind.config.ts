import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import defaultTheme from "tailwindcss/defaultTheme.js";
import type { PluginAPI } from "tailwindcss/types/config.js";

const config = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "../../packages/ui/src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-rubik)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // GanzAfrica color palette
        "primary-green": "#005C30",
        "secondary-green": "#009758",
        "lighter-green-100": "#80DFC8",
        "lighter-green-50": "#E5F9EE",
        "secondary-yellow": "#FFEF97",
        "yellow-lighter": "#FFF7F5",
        "yellow-grid": "#FEF937",
        "primary-orange": "#F8B712",
        "light-orange": "#FFEBE7",
        "orange-grid": "#FEF937",
        "dark-blue": "#073392",
        blue: "#2F88E1",
        "blue-lighter": "#E9EBF4",
        dark: "#1E1E1E",
        gray: "#808080",
        "text-gray": "#F0F0F0",
        "border-grey": "#d9d9d9",
        "gray-lighter": "#FFEEE",
        red: "#D42B1D",
        "red-darker": "#9C2018",
        "red-lighter": "#FFEE4E2",

        // Standard UI colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        // Adding the orange gradient as requested
        "orange-gradient":
          "linear-gradient(to bottom, #FEF597 4%, #F8B712 100%)",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        // Headings
        ".font-h1": {
          fontWeight: "700",
          fontSize: "39.81px",
          letterSpacing: "0.02em",
          lineHeight: "1.6",
        },
        ".font-h2": {
          fontWeight: "700",
          fontSize: "33.18px",
          letterSpacing: "0.02em",
          lineHeight: "1.6",
        },
        ".font-h3": {
          fontWeight: "700",
          fontSize: "27.65px",
          letterSpacing: "0.02em",
          lineHeight: "1.6",
        },
        ".font-h4": {
          fontWeight: "700",
          fontSize: "23.04px",
          letterSpacing: "0.02em",
          lineHeight: "1.6",
        },
        ".font-h5": {
          fontWeight: "700",
          fontSize: "19.2px",
          letterSpacing: "0.02em",
          lineHeight: "1.6",
        },
        ".font-h6": {
          fontWeight: "700",
          fontSize: "16px",
          letterSpacing: "0.02em",
          lineHeight: "1.6",
        },

        // Captions
        ".font-bold-caption": {
          fontWeight: "700",
          fontSize: "18px",
          letterSpacing: "0.02em",
          lineHeight: "24px",
        },
        ".font-medium-caption": {
          fontWeight: "500",
          fontSize: "18px",
          letterSpacing: "0.02em",
          lineHeight: "24px",
        },
        ".font-regular-caption": {
          fontWeight: "400",
          fontSize: "18px",
          letterSpacing: "0.02em",
          lineHeight: "24px",
        },

        // Paragraphs
        ".font-bold-paragraph": {
          fontWeight: "700",
          fontSize: "16px",
          letterSpacing: "0.02em",
          lineHeight: "26.3px",
        },
        ".font-medium-paragraph": {
          fontWeight: "500",
          fontSize: "16px",
          letterSpacing: "0.03em",
          lineHeight: "26.3px",
        },
        ".font-regular-paragraph": {
          fontWeight: "400",
          fontSize: "16px",
          letterSpacing: "0.02em",
          lineHeight: "26.3px",
        },

        // Small text
        ".font-medium-small": {
          fontWeight: "500",
          fontSize: "14px",
          letterSpacing: "0.02em",
          lineHeight: "21px",
        },
        ".font-regular-small": {
          fontWeight: "400",
          fontSize: "14px",
          letterSpacing: "0.02em",
          lineHeight: "21px",
        },
      });
    },
  ],
} satisfies Config;

export default config;
