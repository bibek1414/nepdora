import { MetadataRoute } from "next";
import { SERVICE_CATEGORIES } from "@/constants/nepal-cities";
import { ALL_COMPETITORS } from "@/constants/competitors";
import { SITE_URL } from "@/lib/seo";
import { industries } from "@/lib/seo-data";
import { INTEGRATIONS } from "@/constants/integrations";
import { GLOSSARY_TERMS } from "@/constants/glossary";

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
    { path: "/pricing", priority: 0.9 },
    { path: "/blog", priority: 0.9 },
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
    { path: "/ecommerce", priority: 0.9 },
    { path: "/showcase", priority: 0.9 },
    { path: "/integrations", priority: 0.9 },
    { path: "/industries", priority: 0.9 },
    { path: "/switch", priority: 0.8 },
  ];

  const basePages = baseRoutes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));

  // Integration pages
  const integrationPages = INTEGRATIONS.map(i => ({
    url: `${baseUrl}/integrations/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Industry deep-dive pages
  const industryPages = industries.map(slug => ({
    url: `${baseUrl}/industries/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Switch pages
  const switchPages = ALL_COMPETITORS.map(c => ({
    url: `${baseUrl}/switch/from-${c.slug}-to-nepdora`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Glossary pages
  const glossaryPages = GLOSSARY_TERMS.map(t => ({
    url: `${baseUrl}/glossary/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Industry root pages (Old style, keeping for SEO)
  const industryRootPages = industries.map(industry => ({
    url: `${baseUrl}/${industry}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
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
    ...industryRootPages,
    ...dynamicIndustryCities,
    ...cityPages,
    ...integrationPages,
    ...industryPages,
    ...switchPages,
    ...glossaryPages,
  ];
}
