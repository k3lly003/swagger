import { MetadataRoute } from "next";

// Define the site URL
const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

// Define shared routes
const sharedRoutes = [
  "",
  "/about",
  "/what-we-do",
  "/programs",
  "/projects",
  "/projects",
  "/newsroom",
  "/contact",
  "/faqs",
];

// Define localized routes
const localizedRoutes = (locale: string) =>
  sharedRoutes.map((route) => `/${locale}${route}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    // English routes
    ...localizedRoutes("en").map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/en" ? 1 : 0.8,
    })),
    // French routes
    ...localizedRoutes("fr").map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/fr" ? 0.9 : 0.7,
    })),
  ];

  // You can add dynamic routes here
  // const dynamicRoutes = await fetchDynamicRoutes();

  return staticRoutes;
}
