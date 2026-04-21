"use client";

import React from "react";
import { usePortfolios } from "@/hooks/owner-site/admin/use-portfolio";
import { PortfolioCard6 } from "../portfolio-card/portfolio-card-6";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
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

export const PortfolioStyle6: React.FC<PortfolioStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onPortfolioClick,
}) => {
  const { title = "Featured work", subtitle, heading } = data || {};
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const {
    data: portfoliosData,
    isLoading,
    refetch,
  } = usePortfolios({
    page: 1,
    page_size: 4,
  });
  const portfolios = portfoliosData?.results || [];

  return (
    <section className="bg-background py-16 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <EditableText
          value={title}
          onChange={(val: string) => onUpdate?.({ title: val })}
          isEditable={isEditable}
          as="h1"
          className="mb-2"
          style={{ fontFamily: theme?.fonts?.heading }}
          multiline
        />
        {heading && (
          <EditableText
            value={heading}
            onChange={(val: string) => onUpdate?.({ heading: val })}
            isEditable={isEditable}
            as="h3"
            className="mb-4"
            multiline
            style={{ fontFamily: theme?.fonts?.body }}
          />
        )}

        {subtitle && (
          <EditableText
            value={subtitle}
            onChange={(val: string) => onUpdate?.({ subtitle: val })}
            isEditable={isEditable}
            as="p"
            className="mb-10"
            multiline
            style={{ fontFamily: theme?.fonts?.body }}
          />
        )}

        {isLoading ? (
          <div className="flex flex-col gap-16 md:gap-24">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex flex-col gap-6">
                <Skeleton className="aspect-16/10 w-full rounded-2xl" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {portfolios.map(portfolio => (
              <PortfolioCard6
                key={portfolio.id}
                portfolio={portfolio}
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
