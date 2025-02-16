import { PluginAPI } from "tailwindcss/types/config.js";

/**
 * Typography plugin for Tailwind CSS
 * Creates custom text style classes based on the project's typography scale
 */
const typographyPlugin = function ({ addUtilities }: PluginAPI) {
  const typographyUtilities = {
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
  };

  addUtilities(typographyUtilities);
};

export default typographyPlugin;
