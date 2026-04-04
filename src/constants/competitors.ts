export interface Competitor {
  name: string;
  slug: string;
}

export interface CompetitorCategory {
  title: string;
  competitors: Competitor[];
}

export const COMPETITOR_CATEGORIES: CompetitorCategory[] = [
  {
    title: "General Website Builders",
    competitors: [
      { name: "Wix", slug: "wix" },
      { name: "Webflow", slug: "webflow" },
      { name: "Squarespace", slug: "squarespace" },
      { name: "WordPress", slug: "wordpress" },
      { name: "Weebly", slug: "weebly" },
      { name: "Duda", slug: "duda" },
      { name: "Site123", slug: "site123" },
      { name: "Jimdo", slug: "jimdo" },
      { name: "PageCloud", slug: "pagecloud" },
      { name: "Ucraft", slug: "ucraft" },
      { name: "Simvoly", slug: "simvoly" },
      { name: "Tilda", slug: "tilda" },
      { name: "Carrd", slug: "carrd" },
      { name: "Dorik", slug: "dorik" },
      { name: "Framer", slug: "framer" },
      { name: "Typedream", slug: "typedream" },
    ],
  },
  {
    title: "E-commerce Builders",
    competitors: [
      { name: "Shopify", slug: "shopify" },
      { name: "Blanxer", slug: "blanxer" },
      { name: "BigCommerce", slug: "bigcommerce" },
      { name: "WooCommerce", slug: "woocommerce" },
      { name: "Ecwid", slug: "ecwid" },
      { name: "Squarespace Commerce", slug: "squarespace-commerce" },
    ],
  },
  {
    title: "No-Code / Builder Platforms",
    competitors: [
      { name: "Bubble", slug: "bubble" },
      { name: "Adalo", slug: "adalo" },
      { name: "Builder.io", slug: "builderio" },
      { name: "Webstudio", slug: "webstudio" },
    ],
  },
  {
    title: "AI Website Builders",
    competitors: [
      { name: "Hostinger Website Builder", slug: "hostinger-website-builder" },
      { name: "Zyro", slug: "zyro" },
      { name: "10Web", slug: "10web" },
      { name: "Durable", slug: "durable" },
    ],
  },
  {
    title: "CMS / Page Builder Tools",
    competitors: [
      { name: "Elementor", slug: "elementor" },
      { name: "Brizy", slug: "brizy" },
      { name: "Divi", slug: "divi" },
      { name: "Gutenberg", slug: "gutenberg" },
    ],
  },
];

export const ALL_COMPETITORS = COMPETITOR_CATEGORIES.flatMap(
  category => category.competitors
);
