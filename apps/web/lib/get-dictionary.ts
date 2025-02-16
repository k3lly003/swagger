// @ts-nocheck


import "server-only";

// Define supported locales
const supportedLocales = ["en", "fr"];

// Dictionary type for TypeScript
export type Dictionary = typeof import("../locales/en/common.json");

// We use a dynamic import statement with the webpack magic comment to optimize bundling
const dictionaries = {
  en: () =>
    import("../locales/en/common.json").then((module) => module.default),
  fr: () =>
    import("../locales/fr/common.json").then((module) => module.default),
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  // Fallback to default locale if the requested one isn't supported
  const requestedLocale = supportedLocales.includes(locale) ? locale : "en";

  try {
    return await dictionaries[requestedLocale as keyof typeof dictionaries]();
  } catch (error) {
    console.error(
      `Failed to load dictionary for locale: ${requestedLocale}`,
      error,
    );
    // Fallback to English
    return await dictionaries.en();
  }
}
