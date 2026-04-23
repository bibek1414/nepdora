"use client";

import React from "react";
import { usePortfolios } from "@/hooks/owner-site/admin/use-portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Briefcase, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { PortfolioData } from "@/types/owner-site/components/portfolio";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { PortfolioCard8 } from "../portfolio-card/portfolio-card-8";

interface PortfolioStyleProps {
  data: PortfolioData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<PortfolioData>) => void;
  onPortfolioClick?: (portfolioSlug: string) => void;
}

export const PortfolioStyle8: React.FC<PortfolioStyleProps> = ({
  data: initialData,
  isEditable = false,
  siteUser,
  onUpdate,
  onPortfolioClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const { data, handleTextUpdate, handleLinkUpdate } = useBuilderLogic(
    initialData,
    onUpdate
  );

  const {
    data: portfoliosData,
    isLoading,
    error,
    refetch,
  } = usePortfolios({
    page: 1,
    page_size: 6,
  });

  const portfolios = portfoliosData?.results || [];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-8 py-24 md:py-32">
        {/* Header Section */}
        <div className="mb-20 grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="flex items-center gap-4">
              <EditableText
                value={data.title || "Our work"}
                onChange={handleTextUpdate("title")}
                isEditable={isEditable}
                as="span"
                className="text-sm font-semibold tracking-widest px-2"
              />
            </div>
            <EditableText
              value={data.heading || "Featured Projects"}
              onChange={handleTextUpdate("heading")}
              isEditable={isEditable}
              as="title"
              className="text-4xl leading-[1.1] font-bold tracking-tight text-balance md:text-6xl"
              style={{ fontFamily: theme?.fonts?.heading }}
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <EditableText
              value={data.subtitle || ""}
              onChange={handleTextUpdate("subtitle")}
              isEditable={isEditable}
              as="p"
              className="text-xl leading-relaxed text-pretty text-gray-600"
              style={{ fontFamily: theme?.fonts?.body }}
            />
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[450px] bg-white p-10">
                <Skeleton className="mb-8 h-12 w-12 rounded-full" />
                <Skeleton className="mb-4 h-4 w-1/4" />
                <Skeleton className="mb-4 h-8 w-3/4" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-full bg-white p-12">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Portfolio</AlertTitle>
                <AlertDescription>
                  Failed to load portfolio items. Please try again.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            portfolios.map((portfolio: Portfolio) => (
              <PortfolioCard8
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
            ))
          )}
        </div>

        {/* Footer Action */}
        {!isLoading && !error && portfolios.length > 0 && (
          <div className="relative z-30 mt-16 flex justify-center">
            <EditableLink
              text={data.buttonText || "View all work"}
              href={data.buttonLink || "/portfolio"}
              onChange={handleLinkUpdate("buttonText", "buttonLink")}
              isEditable={isEditable}
              className="group inline-flex h-12 items-center gap-2 rounded-full border px-8 py-4 text-sm font-semibold transition-all hover:gap-3"
            >
              {data.buttonText || "View all work"}
              <ChevronRight className="h-4 w-4 transition-transform" />
            </EditableLink>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Projects Found"
            description="Start by adding your projects in the admin dashboard to showcase your work."
            actionLabel="Add Projects"
            actionLink="/admin/portfolio"
            isEditable={isEditable}
            isEmpty={portfolios.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
