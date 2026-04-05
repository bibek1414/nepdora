import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    tagline: "Get started with no commitment",
    price: "NPR 0",
    period: "",
    priceNote: "Free forever",
    featured: false,
    comingSoon: false,
    cta: "Start for Free",
    href: "/pricing",
    features: [
      "1 Website",
      "Nepdora Subdomain",
      "Basic Templates",
      "Mobile-Responsive",
      "SSL Certificate",
      "Community Support",
    ],
  },
  {
    name: "Business",
    tagline: "Everything your business needs to grow online",
    price: "NPR 10,000",
    period: "/year",
    priceNote: "",
    featured: true,
    comingSoon: false,
    cta: "Get Started",
    href: "/pricing",
    features: [
      "1 Professional Website",
      "Custom Domain Support",
      "eSewa & Khalti Payments",
      "Mobile-First Design",
      "Built-in SEO Tools",
      "Nepali Language & NPR Support",
      "Analytics Dashboard",
      "Priority Support",
    ],
  },
  {
    name: "Pro",
    tagline: "AI-powered tools for ambitious businesses",
    price: "NPR 20,000",
    period: "/year",
    priceNote: "",
    featured: false,
    comingSoon: true,
    cta: "Notify Me",
    href: "/pricing",
    aiFeatures: true,
    features: [
      "Everything in Business",
      "AI Content Generator",
      "AI SEO Optimizer",
      "Multiple Websites",
      "Advanced Ecommerce",
      "Team Collaboration",
      "Custom Integrations",
      "Dedicated Support",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Custom solutions for large organisations",
    price: "Custom",
    period: "",
    priceNote: "Talk to our team",
    featured: false,
    comingSoon: false,
    cta: "Contact Sales",
    href: "https://wa.me/9779866316114",
    features: [
      "Everything in Pro",
      "Unlimited Websites",
      "SLA Guarantee",
      "White-label Option",
      "On-premise Hosting",
      "Dedicated Account Manager",
    ],
  },
];

export function HomePricingSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            How Much Does It Cost to Build a Website in Nepal?
          </h2>
          <p className="mx-auto text-sm leading-relaxed text-slate-600 sm:text-base">
            Transparent NPR pricing . Start free or go full-featured for NPR
            10,000/year.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map(plan => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-6 transition-all ${
                plan.featured
                  ? "bg-secondary shadow-2xl"
                  : "bg-white shadow-sm ring-1 ring-slate-100 hover:shadow-md"
              } ${plan.comingSoon ? "opacity-80" : ""}`}
            >
              {plan.featured && (
                <span className="bg-primary absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[10px] text-white shadow">
                  Most Popular
                </span>
              )}

              {plan.comingSoon && (
                <span className="bg-primary absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[10px] text-white shadow">
                  Coming Soon
                </span>
              )}

              <div className="mb-5">
                <div className="mb-0.5 flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  {(plan as { aiFeatures?: boolean }).aiFeatures && (
                    <span className="flex items-center gap-0.5 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                      AI
                    </span>
                  )}
                </div>
                <p className="text-xs leading-snug text-slate-500">
                  {plan.tagline}
                </p>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-slate-500">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {plan.priceNote}
                </p>
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="text-xs leading-relaxed text-slate-600">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                target={plan.href.startsWith("https") ? "_blank" : undefined}
                rel={
                  plan.href.startsWith("https")
                    ? "noopener noreferrer"
                    : undefined
                }
                className={`block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-all ${
                  plan.featured
                    ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800"
                    : plan.comingSoon
                      ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          All paid plans include free SSL, hosting, and a 14-day trial. No
          credit card required.{" "}
          <Link
            href="/pricing"
            className="font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
          >
            View full pricing
          </Link>
        </p>
      </div>
    </section>
  );
}
