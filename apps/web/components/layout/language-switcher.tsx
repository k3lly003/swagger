"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";

// Supported languages configuration with display names and flags
const languages = [
  { code: "en", name: "English", flag: "/images/flags/en.svg" },
  { code: "fr", name: "Français", flag: "/images/flags/fr.svg" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1];

  // Find current language object with fallback to English
  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) ?? languages[0]!;

  // Handle language change
  const handleLanguageChange = (locale: string) => {
    // Extract the path without the locale prefix
    const segments = pathname.split("/");
    // Remove first segment (empty string before first slash) and the locale
    const pathWithoutLocale = segments.slice(2).join("/");

    // Create new path with the new locale and trailing slash
    const newPathname =
      locale === "en"
        ? pathWithoutLocale
          ? `/${locale}/${pathWithoutLocale}`
          : "/"
        : pathWithoutLocale
          ? `/${locale}/${pathWithoutLocale}`
          : `/${locale}/`;

    router.push(newPathname);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.code}
            width={20}
            height={20}
            className="rounded-sm"
          />
          <span className="font-medium uppercase">{currentLanguage.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 ${currentLocale === language.code ? "font-bold" : ""}`}
          >
            <Image
              src={language.flag}
              alt={language.code}
              width={20}
              height={15}
              className="rounded-sm"
            />
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
