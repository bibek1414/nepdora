"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePortfolios } from "@/hooks/owner-site/admin/use-portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronRight, Briefcase } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { PortfolioData } from "@/types/owner-site/components/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioCard4 } from "../portfolio-card/portfolio-card-4";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface PortfolioStyleProps {
  data: PortfolioData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<PortfolioData>) => void;
  onPortfolioClick?: (portfolioSlug: string) => void;
}

export const PortfolioStyle4: React.FC<PortfolioStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onPortfolioClick,
}) => {
  const {
    title = "Selected works",
    subtitle,
    buttonText = "Browse all portfolio",
    buttonLink = "#",
  } = data || {};
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
    },
    fonts: {
      body: "Inter, system-ui, sans-serif",
      heading: "Poppins, system-ui, sans-serif",
    },
  };

  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

  const {
    data: portfoliosData,
    isLoading,
    error,
    refetch,
  } = usePortfolios({
    page: 1,
    page_size: 4,
  });

  const portfolios = portfoliosData?.results || [];

  useEffect(() => {
    if (portfolios.length > 0 && activeProjectId === null) {
      setActiveProjectId(portfolios[0].id);
    }
  }, [portfolios, activeProjectId]);

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const handleButtonTextChange = (newText: string) => {
    onUpdate?.({ buttonText: newText });
  };

  const handleButtonLinkChange = (newLink: string) => {
    onUpdate?.({ buttonLink: newLink });
  };

  const activeProject =
    portfolios.find(p => p.id === activeProjectId) || portfolios[0];

  return (
    <section className="bg-white px-6 py-24 md:px-8">
      {/* 
        @beautifulMention
        - Layout: mx-auto max-w-7xl px-4 grid structure. 2 columns on lg.
        - Typography: Responsive header text-4xl/6xl. EditableText used for all headings.
        - Fonts: The theme.fonts.heading is applied into the class name on the top wrapper or texts.
        - Colors: Tailwind neutrals used everywhere, except theme.colors.primary/primaryForeground for the EditableLink button.
        - Images: Standard Next.js Image component handles dynamic data rendering.
        - Hovers: React State (activeProjectId) controls which project focuses and expands avoiding group-hover dependencies.
      */}
      <div className={`mx-auto max-w-7xl px-8 ${theme?.fonts?.heading || ""}`}>
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="mb-4 text-4xl font-medium tracking-tight text-gray-950 md:text-6xl"
            isEditable={isEditable}
            placeholder="Selected works"
            style={{ fontFamily: theme?.fonts?.heading }}
          />

          {/* Render subtitle only if it exists or is editable */}
          {(subtitle || isEditable) && (
            <EditableText
              value={subtitle || ""}
              onChange={handleSubtitleChange}
              as="p"
              className="mx-auto max-w-2xl text-lg text-gray-600"
              isEditable={isEditable}
              placeholder="Add an optional description here..."
              multiline={true}
              style={{ fontFamily: theme?.fonts?.body }}
            />
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <Skeleton className="aspect-4/3 w-full rounded-[2.5rem]" />
            <div className="space-y-12 py-8">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Portfolio</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load portfolio items."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && portfolios.length > 0 && (
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            {/* Left: Image Display */}
            <div className="sticky top-24 space-y-8">
              <div
                className="relative aspect-4/3 cursor-pointer overflow-hidden rounded-[2.5rem] bg-gray-100"
                onClick={() =>
                  onPortfolioClick &&
                  activeProject &&
                  onPortfolioClick(activeProject.slug)
                }
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProjectId ?? "empty"}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    {activeProject?.thumbnail_image ? (
                      <Image
                        src={activeProject.thumbnail_image}
                        alt={
                          activeProject.thumbnail_image_alt_description ||
                          activeProject.title
                        }
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <Image
                          src="/fallback/image-not-found.png"
                          alt="No Image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Optional floating clickable layer in builder mode */}
                {isEditable && (
                  <div className="absolute inset-0 z-10 bg-transparent" />
                )}
              </div>

              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="relative z-30 inline-flex w-full sm:w-auto">
                  <EditableLink
                    text={buttonText}
                    href={buttonLink}
                    onChange={(text, href) => {
                      handleButtonTextChange(text);
                      handleButtonLinkChange(href);
                    }}
                    isEditable={isEditable}
                    className="inline-flex w-full justify-center rounded-full px-8 py-4 text-sm font-medium transition-colors sm:w-auto"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                    }}
                  >
                    {buttonText}
                    <ChevronRight className="h-5 w-5" />
                  </EditableLink>
                </div>

                <div className="flex gap-4">
                  {portfolios.map(p => {
                    if (!p.thumbnail_image) return null;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActiveProjectId(p.id)}
                        className={`relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                          activeProjectId === p.id
                            ? ""
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        style={
                          activeProjectId === p.id
                            ? { borderColor: theme.colors.primary }
                            : {}
                        }
                      >
                        <Image
                          src={
                            p.thumbnail_image || "/fallback/image-not-found.png"
                          }
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Project List */}
            <div className="space-y-4">
              {portfolios.map(project => {
                const isActive = activeProjectId === project.id;

                return (
                  <PortfolioCard4
                    key={project.id}
                    portfolio={project}
                    isActive={isActive}
                    theme={theme}
                    siteUser={siteUser}
                    isEditable={isEditable}
                    onPortfolioClick={onPortfolioClick}
                    onMouseEnter={() => setActiveProjectId(project.id)}
                    onClick={() => setActiveProjectId(project.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Works Available"
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
