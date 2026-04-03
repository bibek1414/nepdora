import { MetadataRoute } from "next";
import { SERVICE_CATEGORIES } from "@/constants/nepal-cities";
import { ALL_COMPETITORS } from "@/constants/competitors";
import { SITE_URL } from "@/lib/seo";
import { industries } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const TOP_CITIES = [
    "kathmandu",
    "pokhara",
    "lalitpur",
    "bhaktapur",
    "biratnagar",
    "birgunj",
    "dharan",
    "butwal",
    "hetauda",
    "janakpur",
  ];

  // Base pages (High Priority)
  const baseRoutes = [
    { path: "", priority: 1.0 },
    { path: "/pricing", priority: 1.0 },
    { path: "/blog", priority: 1.0 },
    { path: "/templates", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    { path: "/features", priority: 0.8 },
    { path: "/faq", priority: 0.7 },
    { path: "/support", priority: 0.7 },
    { path: "/website-developer-nepal", priority: 0.9 },
    { path: "/free-website-analyzer", priority: 0.8 },
    { path: "/invoice-builder", priority: 0.8 },
    { path: "/website-templates", priority: 0.8 },
    { path: "/privacy-policy", priority: 0.5 },
    { path: "/terms", priority: 0.5 },
    { path: "/khalti-payment-gateway-nepal", priority: 0.9 },
    { path: "/esewa-integration-guide-nepal", priority: 0.9 },
    { path: "/website-registration-nepal", priority: 0.8 },
    { path: "/partners", priority: 0.8 },
  ];

  const basePages = baseRoutes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));

  // Solution Pages (Problem-Solution traffic)
  const solutionPages = [
    "accept-esewa-payments-online",
    "local-delivery-integration-pathao",
  ].map(slug => ({
    url: `${baseUrl}/solutions/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Category pages (Hubs)
  const categoryPages = SERVICE_CATEGORIES.map(category => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Feature pages
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

  // Compare pages (Direct Comparisons & Pricing)
  const comparePages = ALL_COMPETITORS.map(({ slug }) => `${slug}-and-nepdora`).map(
    slug => ({
      url: `${baseUrl}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // Alternative pages (New pSEO)
  const alternativePages = ALL_COMPETITORS.map(({ slug }) => `${slug}-nepal`).map(
    slug => ({
      url: `${baseUrl}/alternative/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  const dedicatedAlternativePages = [
    {
      url: `${baseUrl}/alternative/blanxer-nepal`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Learn pages
  const learnPages = [
    "how-to-start-online-business-in-nepal",
    "register-company-in-nepal-online",
    "pan-vs-vat-for-online-shops-nepal",
    "best-payment-gateways-nepal",
    "seo-guide-for-nepali-businesses",
  ].map(slug => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Template categories
  const templateCategories = [
    "restaurant",
    "ecommerce",
    "portfolio",
    "agency",
    "business",
    "educational",
    "travel",
    "grocery",
    "medical",
  ].map(slug => ({
    url: `${baseUrl}/templates/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Programmatic Industry & City pages (Lower priority to save crawl budget)
  const dynamicIndustryCities: MetadataRoute.Sitemap = [];

  industries.forEach(industry => {
    TOP_CITIES.forEach(city => {
      const citySlug = city.toLowerCase();
      // industry/city
      dynamicIndustryCities.push({
        url: `${baseUrl}/${industry}/${citySlug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
      // create-website-for/industry/city
      dynamicIndustryCities.push({
        url: `${baseUrl}/create-website-for/${industry}/${citySlug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      });
    });
  });

  // Original City pages
  const cityPages: MetadataRoute.Sitemap = [];
  SERVICE_CATEGORIES.forEach(category => {
    TOP_CITIES.forEach(city => {
      cityPages.push({
        url: `${baseUrl}/${category.slug}/${city.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    });
  });

  return [
    ...basePages,
    ...solutionPages,
    ...categoryPages,
    ...features,
    ...comparePages,
    ...alternativePages,
    ...dedicatedAlternativePages,
    ...learnPages,
    ...templateCategories,
    ...dynamicIndustryCities,
    ...cityPages,
  ];
}
