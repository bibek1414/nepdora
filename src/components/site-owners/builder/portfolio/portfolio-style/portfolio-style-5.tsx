"use client";

import React, { useState } from "react";
import { usePortfolios } from "@/hooks/owner-site/admin/use-portfolio";
import { PortfolioCard5 } from "../portfolio-card/portfolio-card-5";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FolderOpen, Briefcase } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { PortfolioComponentData } from "@/types/owner-site/components/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import Pagination from "@/components/ui/pagination";

interface PortfolioStyle5Props {
  data: PortfolioComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<PortfolioComponentData["data"]>) => void;
  onPortfolioClick?: (slug: string) => void;
}

/**
 * @beautifulMention: Portfolio Style 5
 * Paginated portfolio grid with 4 columns on desktop.
 * Premium layout with card-based design and smooth animations.
 */
export const PortfolioStyle5: React.FC<PortfolioStyle5Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onPortfolioClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: { primary: "#000000", primaryForeground: "#ffffff" },
    fonts: { heading: "Inter", body: "Inter" },
  };

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const {
    title = "Latest Projects",
    subtitle = "A curated selection of our most impactful professional work and achievements.",
  } = data || {};

  const {
    data: portfoliosData,
    isLoading,
    error,
    refetch,
  } = usePortfolios({
    page,
    page_size: pageSize,
  });

  const portfolios = portfoliosData?.results || [];
  const totalCount = portfoliosData?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="label"
            className="mb-2"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
            placeholder="Enter title..."
          />
        <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-gray-600"
            style={{ fontFamily: theme.fonts.body }}
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Projects</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load portfolios."}
            </AlertDescription>
          </Alert>
        )}

        {/* Content Section */}
        {!isLoading && !error && portfolios.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {portfolios.map((portfolio, index) => (
                <div key={portfolio.id} className="relative">
                  {isEditable && <div className="absolute inset-0 z-10" />}
                  <PortfolioCard5
                    portfolio={portfolio}
                    idx={index}
                    isEditable={isEditable}
                    siteUser={siteUser}
                    onPortfolioClick={onPortfolioClick}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Projects Found"
            description="Showcase your best work. Add portfolio items from the admin dashboard."
            actionLabel="Add New Portfolio"
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
