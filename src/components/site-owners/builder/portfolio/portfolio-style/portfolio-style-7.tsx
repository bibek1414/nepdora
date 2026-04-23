"use client";

import React from "react";
import { usePortfolios } from "@/hooks/owner-site/admin/use-portfolio";
import { PortfolioCard7 } from "../portfolio-card/portfolio-card-7";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { PortfolioData } from "@/types/owner-site/components/portfolio";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PortfolioStyleProps {
  data: PortfolioData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<PortfolioData>) => void;
  onPortfolioClick?: (portfolioSlug: string) => void;
}

export const PortfolioStyle7: React.FC<PortfolioStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onPortfolioClick,
}) => {
  const {
    title = "Selected work",
    heading,
    buttonText = "All work",
    buttonLink = "/work",
  } = data || {};
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const {
    data: portfoliosData,
    isLoading,
    refetch,
  } = usePortfolios({
    page: 1,
    page_size: 6,
  });
  const portfolios = portfoliosData?.results || [];

  return (
    <section className="border-y border-gray-100 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-8 py-24 md:py-32">
        {/* Header Row */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <EditableText
                value={title}
                onChange={(val: string) => onUpdate?.({ title: val })}
                isEditable={isEditable}
                as="p"
                className="block px-1 text-sm font-semibold tracking-wide"
                style={{ fontFamily: theme?.fonts?.body }}
              />
            </div>
            {heading && (
              <EditableText
                value={heading}
                onChange={(val: string) => onUpdate?.({ heading: val })}
                isEditable={isEditable}
                as="h2"
                className="text-3xl leading-tight font-bold tracking-tight text-gray-900 md:text-5xl"
                style={{ fontFamily: theme?.fonts?.heading }}
                multiline
              />
            )}
          </div>

          <div className="relative z-30">
            <EditableLink
              text={buttonText}
              href={buttonLink}
              onChange={(text, href) =>
                onUpdate?.({ buttonText: text, buttonLink: href })
              }
              isEditable={isEditable}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              {buttonText}
              <ChevronRight className="h-4 w-4" />
            </EditableLink>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-6">
                <Skeleton className="aspect-4/3 w-full rounded-xl" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio, index) => (
              <PortfolioCard7
                key={portfolio.id}
                portfolio={portfolio}
                index={index}
                isEditable={isEditable}
                siteUser={siteUser}
                onClick={
                  onPortfolioClick
                    ? () => onPortfolioClick(portfolio.slug)
                    : undefined
                }
              />
            ))}
          </div>
        )}

        <BuilderEmptyState
          icon={Briefcase}
          title="No projects found"
          description="Your projects will appear here once you add them in the admin dashboard."
          actionLabel="Add new project"
          actionLink="/admin/portfolio"
          isEditable={isEditable}
          isEmpty={!isLoading && portfolios.length === 0}
          onRefresh={refetch}
        />
      </div>
    </section>
  );
};
