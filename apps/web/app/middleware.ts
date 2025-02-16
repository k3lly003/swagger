import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Define supported locales
export const supportedLocales = ["en", "fr"];
export const defaultLocale = "en";

// Function to get the preferred locale from the request
function getLocale(request: NextRequest): string {
  // Negotiator expects plain object, so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  // Use negotiator and intl-localematcher to get the best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, supportedLocales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle the case when visiting the root path with no locale
  if (pathname === "/" || pathname === "") {
    // Default to English when visiting the root
    const newUrl = new URL("/en/", request.url);
    return NextResponse.redirect(newUrl);
  }

  // Check if pathname is missing a locale
  const pathnameHasLocale = supportedLocales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) ||
      pathname === `/${locale}` ||
      pathname === `/${locale}/`,
  );

  // If it doesn't have a locale, add one based on the user's preference
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    // Add a trailing slash for consistency
    const newPath = pathname.endsWith("/")
      ? `/${locale}${pathname}`
      : `/${locale}${pathname}/`;
    const newUrl = new URL(newPath, request.url);

    // Preserve the search params
    newUrl.search = request.nextUrl.search;

    return NextResponse.redirect(newUrl);
  }

  // Handle `/en` without trailing slash by redirecting to `/en/`
  if (supportedLocales.some((locale) => pathname === `/${locale}`)) {
    const newUrl = new URL(`${pathname}/`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all pathnames except those starting with:
  // - /_next (Next.js internals)
  // - /api (API routes)
  // - /images, /fonts, etc. (static assets)
  matcher: ["/", "/((?!api|_next|images|fonts|favicon.ico).*)"],
};
