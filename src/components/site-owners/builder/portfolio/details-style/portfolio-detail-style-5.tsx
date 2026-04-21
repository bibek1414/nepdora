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
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-6 w-1/4 mb-12" />
        <Skeleton className="aspect-video w-full rounded-2xl mb-12" />
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
      <header className="relative h-[70vh] w-full overflow-hidden mb-20">
        {portfolio.thumbnail_image && (
          <Image unoptimized
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
            <div className="flex flex-wrap gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {portfolio.category && (
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-none px-4 py-1">
                  {portfolio.category.name}
                </Badge>
              )}
              {portfolio.tags?.slice(0, 3).map((tag: any) => (
                <Badge key={tag.id} variant="outline" className="text-white border-white/30 px-4 py-1">
                  {tag.name}
                </Badge>
              ))}
            </div>
            
            <h1 
              className="text-5xl md:text-7xl font-light tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000"
              style={{ fontFamily: theme?.fonts?.heading }}
            >
              {portfolio.title}
            </h1>

            <div className="flex items-center gap-6 text-white/70 font-medium tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {new Date(portfolio.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div 
              className="prose prose-xl prose-stone max-w-none dark:prose-invert prose-headings:font-light prose-p:leading-relaxed prose-img:rounded-3xl"
              style={{ fontFamily: theme?.fonts?.body }}
              dangerouslySetInnerHTML={{ __html: sanitizeContent(portfolio.content || "") }}
            />
          </div>

          {/* Side Info */}
          <div className="lg:col-span-4 space-y-12">
            <div className="sticky top-12 space-y-12">
              {/* Project Metadata */}
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Project Details</h3>
                <div className="space-y-4">
                  {(portfolio.project_url || portfolio.github_url) && (
                    <div className="flex flex-col gap-3">
                      {portfolio.project_url && (
                        <Button asChild size="lg" className="w-full rounded-full gap-2">
                          <a href={portfolio.project_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Live Project
                          </a>
                        </Button>
                      )}
                      {portfolio.github_url && (
                        <Button asChild variant="outline" size="lg" className="rounded-full gap-2 border-2">
                          <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            Source Code
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Cloud */}
              {portfolio.tags && portfolio.tags.length > 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tags.map((tag: any) => (
                      <span 
                        key={tag.id}
                        className="px-4 py-2 bg-muted rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-default"
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
