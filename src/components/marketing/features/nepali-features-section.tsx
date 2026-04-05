import { CreditCard, Globe, Smartphone, Search } from "lucide-react";

const features = [
  {
    Icon: CreditCard,
    title: "eSewa & Khalti Payment Gateway - Ready to Connect",
    description:
      "Accept payments from Nepal's most popular digital wallets. Connect your eSewa or Khalti merchant account and start receiving payments instantly - no complex setup required.",
  },
  {
    Icon: Globe,
    title: "Nepali Language & NPR Currency Support",
    description:
      "Display prices in Nepali Rupees, write content in Nepali script, and serve your local customers in their preferred language and currency from day one.",
  },
  {
    Icon: Smartphone,
    title: "Mobile-First Design - 90% of Nepal Browses on Phone",
    description:
      "Over 90% of Nepal's internet users browse on smartphones. Every Nepdora website is optimised for mobile - fast, touch-friendly, and beautiful on all screen sizes.",
  },
  {
    Icon: Search,
    title: "Built-in SEO Tools to Rank on Google Nepal",
    description:
      "Get found when customers search online. Automated meta tags, XML sitemap, schema markup, and page speed optimisation - all built in so you rank without hiring an SEO agency.",
  },
];

export function NepaliBusinessFeatures() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-0">
        <div className="mb-12">
          <h2 className="mb-3 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Everything a Nepali Business Needs - Built In
          </h2>
          <p className="text-center text-sm leading-relaxed sm:text-base">
            Nepdora is built specifically for Nepal. Local payments, Nepali
            language support, and mobile-first design - ready from day one.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {features.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="bg-secondary/60 flex gap-4 rounded-lg p-3 py-5"
            >
              <div className="shrink-0 pt-0.5">
                <Icon className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1.5 text-base leading-snug font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
