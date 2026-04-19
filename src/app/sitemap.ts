import { MetadataRoute } from "next";
import { SERVICE_CATEGORIES } from "@/constants/nepal-cities";
import { ALL_COMPETITORS } from "@/constants/competitors";
import { SITE_URL } from "@/lib/seo";
import { industries } from "@/lib/seo-data";
import { INTEGRATIONS } from "@/constants/integrations";
import { GLOSSARY_TERMS } from "@/constants/glossary";
import { SOLUTIONS_LIST } from "@/constants/solutions";
import { USE_CASES } from "@/constants/use-cases";
import { TEMPLATE_CATEGORIES } from "@/constants/templates";

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
    { path: "/tools/free-website-analyzer", priority: 0.8 },
    { path: "/free-website-builder", priority: 0.9 },
    { path: "/tools/invoice-maker", priority: 0.8 },
    { path: "/tools/business-name-generator-nepal", priority: 0.8 },
    { path: "/tools/domain-name-checker-nepal", priority: 0.8 },
    { path: "/tools/qr-code-generator", priority: 0.8 },
    { path: "/tools/seo-checker", priority: 0.8 },
    { path: "/tools/website-speed-test", priority: 0.8 },
    { path: "/tools/privacy-policy-generator-nepal", priority: 0.8 },
    { path: "/privacy-policy", priority: 0.5 },
    { path: "/terms", priority: 0.5 },
    { path: "/data-delete", priority: 0.3 },
    { path: "/partners", priority: 0.8 },
    { path: "/showcase", priority: 0.9 },
    { path: "/integrations", priority: 0.9 },
    { path: "/solutions", priority: 0.9 },
    { path: "/use-cases", priority: 0.9 },
    { path: "/compare", priority: 0.8 },
    { path: "/glossary", priority: 0.8 },
    { path: "/switch", priority: 0.8 },
    { path: "/website-builder-nepal", priority: 0.9 },
    { path: "/insights", priority: 0.8 },
    { path: "/experts", priority: 0.8 },
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

  // Industry root pages
  const industryRootPages = industries.map(industry => ({
    url: `${baseUrl}/${industry}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Solution Pages
  const solutionPages = SOLUTIONS_LIST.map(solution => ({
    url: `${baseUrl}/solutions/${solution.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Use Case Pages
  const useCasePages = USE_CASES.map(useCase => ({
    url: `${baseUrl}/use-cases/${useCase.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));


  // Compare pages (Direct Comparisons & Pricing)
  const comparePages = ALL_COMPETITORS.map(
    ({ slug }) => `${slug}-and-nepdora`
  ).map(slug => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Alternative pages (New pSEO)
  const alternativePages = ALL_COMPETITORS.map(
    ({ slug }) => `${slug}-nepal`
  ).map(slug => ({
    url: `${baseUrl}/alternative/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const dedicatedAlternativePages = [
    {
      url: `${baseUrl}/alternative/blanxer-nepal`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Insights pages
  const insightPages = [
    "how-to-start-online-business-in-nepal",
    "register-company-in-nepal-online",
    "pan-vs-vat-for-online-shops-nepal",
    "best-payment-gateways-nepal",
    "seo-guide-for-nepali-businesses",
  ].map(slug => ({
    url: `${baseUrl}/insights/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Template categories
  const templateCategories = TEMPLATE_CATEGORIES.map(slug => ({
    url: `${baseUrl}/templates/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));


  // Programmatic Industry & City pages
  const dynamicIndustryCities: MetadataRoute.Sitemap = [];
  industries.forEach(industry => {
    TOP_CITIES.forEach(city => {
      const citySlug = city.toLowerCase();
      dynamicIndustryCities.push({
        url: `${baseUrl}/${industry}/${citySlug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5, // Lowered priority for programmatic pages
      });
    });
  });

  return [
    ...basePages,
    ...solutionPages,
    ...useCasePages,
    ...comparePages,
    ...alternativePages,
    ...dedicatedAlternativePages,
    ...insightPages,
    ...templateCategories,
    ...industryRootPages,
    ...dynamicIndustryCities,
    ...integrationPages,
    ...switchPages,
    ...glossaryPages,
  ];
}
