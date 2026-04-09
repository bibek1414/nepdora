import React from "react";
import { Zap, LucideIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { cn } from "@/lib/utils";

interface MarketingPageHeroProps {
  badgeText?: string;
  badgeIcon?: LucideIcon;
  title: React.ReactNode;
  description: string;
  breadcrumbs?: { label: string; href: string }[];
  centered?: boolean;
  className?: string;
}

export const MarketingPageHero: React.FC<MarketingPageHeroProps> = ({
  badgeText,
  badgeIcon: BadgeIcon = Zap,
  title,
  description,
  breadcrumbs,
  centered = false,
  className,
}) => {
  return (
    <section className={cn("border-b border-slate-100 bg-white py-16 sm:py-24", className)}>
      <div className="container mx-auto max-w-6xl px-4">
        {breadcrumbs && (
          <div
            className={cn(
              "mb-12 flex",
              centered ? "justify-center" : "justify-start"
            )}
          >
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <div className={cn(centered ? "mx-auto text-center" : "max-w-3xl")}>
          {badgeText && (
            <div
              className={cn(
                "mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600"
              )}
            >
              <BadgeIcon className="h-4 w-4 text-sky-500" />
              <span>{badgeText}</span>
            </div>
          )}
          <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p
            className={cn(
              "mb-7 text-base leading-relaxed text-slate-500 sm:text-lg",
              centered ? "mx-auto max-w-2xl" : ""
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};
