"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, ExternalLink, Github } from "lucide-react";
import { usePortfolio } from "@/hooks/owner-site/admin/use-portfolio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { sanitizeContent } from "@/utils/html-sanitizer";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { Briefcase } from "lucide-react";

interface PortfolioDetailProps {
  slug: string;
  siteUser: string;
  isEditable?: boolean;
}

export const PortfolioDetail5: React.FC<PortfolioDetailProps> = ({
  slug,
  siteUser,
  isEditable = false,
}) => {
  const { data: portfolio, isLoading, error } = usePortfolio(slug as string);
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-6 py-24">
        <Skeleton className="mb-8 h-12 w-3/4" />
        <Skeleton className="mb-12 h-6 w-1/4" />
        <Skeleton className="mb-12 aspect-video w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="bg-background py-0 pt-20">
        <div className="container mx-auto px-6 py-24">
          <BuilderEmptyState
            icon={Briefcase}
            title="Project Not Found"
            description="The portfolio project you are looking for does not exist or has been removed."
            actionLabel="Add New Project"
            actionLink="/admin/portfolio"
            isEditable={isEditable}
            isEmpty={!isLoading && !portfolio}
          />
          {!isEditable && (
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-semibold">Project Not Found</h2>
              <Link href="/portfolio">
                <Button variant="outline">Back to Portfolio</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <article className="bg-background pb-32">
      {/* Immersive Hero Header */}
      <header className="relative mb-12 h-[50vh] w-full overflow-hidden sm:mb-20 sm:h-[60vh] md:h-[70vh]">
        {portfolio.thumbnail_image && (
          <Image
            unoptimized
            src={portfolio.thumbnail_image}
            alt={portfolio.thumbnail_image_alt_description || portfolio.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto max-w-5xl px-6 pb-20 text-white">
            <h1
              className="animate-in fade-in slide-in-from-bottom-6 mb-8 text-3xl leading-[1.1] font-light tracking-tight duration-1000 sm:text-5xl md:text-7xl"
              style={{ fontFamily: theme?.fonts?.heading }}
            >
              {portfolio.title}
            </h1>

            <div className="animate-in fade-in slide-in-from-bottom-8 flex items-center gap-6 font-medium tracking-wide text-white/70 duration-1000">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {new Date(portfolio.created_at).toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-16 md:gap-24 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div
              className="prose prose-base sm:prose-lg md:prose-xl prose-stone dark:prose-invert prose-headings:font-light prose-p:leading-relaxed prose-img:rounded-3xl max-w-none"
              style={{ fontFamily: theme?.fonts?.body }}
              dangerouslySetInnerHTML={{
                __html: sanitizeContent(portfolio.content || ""),
              }}
            />
          </div>

          {/* Side Info */}
          <div className="space-y-12 lg:col-span-4">
            <div className="sticky top-12 space-y-12">
              {/* Project Metadata */}
              {(portfolio.project_url || portfolio.github_url) && (
                <div className="animate-in fade-in slide-in-from-right-4 space-y-6 delay-300 duration-700">
                  <div className="space-y-4">
                    <h3 className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
                      Project Details
                    </h3>
                    <div className="flex flex-col gap-3">
                      {portfolio.project_url && (
                        <Button
                          asChild
                          size="lg"
                          className="w-full gap-2 rounded-full"
                        >
                          <a
                            href={portfolio.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live Project
                          </a>
                        </Button>
                      )}
                      {portfolio.github_url && (
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="gap-2 rounded-full border-2"
                        >
                          <a
                            href={portfolio.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                            Source Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags Cloud */}
              {portfolio.tags && portfolio.tags.length > 0 && (
                <div className="animate-in fade-in slide-in-from-right-4 space-y-6 delay-500 duration-700">
                  <h3 className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tags.map((tag: any) => (
                      <span
                        key={tag.id}
                        className="bg-muted hover:bg-primary cursor-default rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-white"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
