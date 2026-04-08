import React from "react";
import { Zap, LucideIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

interface StandardMarketingHeroProps {
  badgeText: string;
  badgeIcon?: LucideIcon;
  title: React.ReactNode;
  description: string;
  breadcrumbs?: { label: string; href: string }[];
  centered?: boolean;
}

export const StandardMarketingHero: React.FC<StandardMarketingHeroProps> = ({
  badgeText,
  badgeIcon: BadgeIcon = Zap,
  title,
  description,
  breadcrumbs,
  centered = false,
}) => {
  return (
    <section className="border-b border-slate-100 bg-white py-24">
      <div className="container mx-auto max-w-6xl px-4">
        {breadcrumbs && (
          <div
            className={`mb-12 flex ${centered ? "justify-center" : "justify-start"}`}
          >
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <div className={centered ? "mx-auto text-center" : "max-w-3xl"}>
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600`}
          >
            <BadgeIcon className="h-4 w-4 text-sky-500" />
            <span>{badgeText}</span>
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
            {title}
          </h1>
          <p
            className={`text-xl leading-relaxed font-medium text-slate-500 ${centered ? "mx-auto max-w-2xl" : ""}`}
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};
