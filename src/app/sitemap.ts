import { MetadataRoute } from "next";
import { NEPAL_CITIES, SERVICE_CATEGORIES } from "@/constants/nepal-cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.nepdora.com";

  // Base pages
  const baseRoutes = [
    "",
    "/about",
    "/contact",
    "/features",
    "/templates",
    "/pricing",
    "/blog",
    "/faq",
    "/support",
    "/free-website-analyzer",
    "/invoice-builder",
    "/website-templates",
    "/privacy-policy",
    "/terms",
  ];

  const basePages = baseRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Category pages
  const categoryPages = SERVICE_CATEGORIES.map(category => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Feature pages (some common features)
  const features = [
    "esewa-integration",
    "khalti",
    "sms",
    "facebook-pixel",
    "dash",
    "pathao-parcel",
  ].map(slug => ({
    url: `${baseUrl}/features/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Compare pages
  const comparePages = [
    "shopify-and-nepdora",
    "webflow-and-nepdora",
    "wordpress-and-nepdora",
    "wix-and-nepdora",
  ].map(slug => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // City pages - Limit to a reasonable number if needed, but 1800 total is fine.
  // We include all city pages to ensure they discoverable.
  const cityPages: MetadataRoute.Sitemap = [];
  SERVICE_CATEGORIES.forEach(category => {
    // For performance and crawl budget, we might want to prioritize top cities,
    // but for indexing, including them all is better if content is unique enough.
    NEPAL_CITIES.forEach(city => {
      cityPages.push({
        url: `${baseUrl}/${category.slug}/${city.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    });
  });

  return [
    ...basePages,
    ...categoryPages,
    ...features,
    ...comparePages,
    ...cityPages,
  ];
}
