"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export interface MarketingPlan {
  name: string;
  tagline: string;
  price: string;
  period: string;
  priceNote?: string;
  featured?: boolean;
  comingSoon?: boolean;
  cta: string;
  href: string;
  features: string[];
  aiFeatures?: boolean;
}

interface MarketingPricingCardProps {
  plan: MarketingPlan;
  isCurrentPlan?: boolean;
}

export function MarketingPricingCard({
  plan,
  isCurrentPlan,
}: MarketingPricingCardProps) {
  return (
    <article
      className={`relative flex flex-col rounded-2xl p-6 transition-all ${
        isCurrentPlan
          ? "bg-slate-50 shadow-xl ring-2 ring-slate-900"
          : plan.featured
            ? "bg-secondary shadow-2xl"
            : "bg-white shadow-sm ring-1 ring-slate-100 hover:shadow-md"
      } ${plan.comingSoon ? "opacity-80" : ""}`}
    >
      {isCurrentPlan ? (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow">
          Current Plan
        </span>
      ) : plan.featured ? (
        <span className="bg-primary absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[10px] text-white shadow">
          Most Popular
        </span>
      ) : null}

      {plan.comingSoon && !isCurrentPlan && (
        <span className="bg-primary absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[10px] text-white shadow">
          Coming Soon
        </span>
      )}

      <div className="mb-5">
        <div className="mb-0.5 flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
          {plan.aiFeatures && (
            <span className="flex items-center gap-0.5 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
              AI
            </span>
          )}
        </div>
        <p className="text-xs leading-snug text-slate-500">{plan.tagline}</p>
      </div>

      <div className="mb-5">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-slate-900">
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-sm text-slate-500">{plan.period}</span>
          )}
        </div>
        {plan.priceNote && (
          <p className="mt-0.5 text-[11px] text-slate-400">{plan.priceNote}</p>
        )}
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
        href={isCurrentPlan ? "/admin/settings/subscription" : plan.href}
        target={plan.href.startsWith("https") ? "_blank" : undefined}
        rel={plan.href.startsWith("https") ? "noopener noreferrer" : undefined}
        className={`block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-all ${
          isCurrentPlan
            ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800"
            : plan.featured
              ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800"
              : plan.comingSoon
                ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        {isCurrentPlan ? "Manage Subscription" : plan.cta}
      </Link>
    </article>
  );
}
