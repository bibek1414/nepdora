"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePortfolio } from "@/hooks/owner-site/admin/use-portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const PortfolioDetail3: React.FC<{
  slug: string;
  siteUser?: string;
}> = ({ slug, siteUser }) => {
  const pathname = usePathname();
  const { data: portfolio, isLoading, error } = usePortfolio(slug);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      background: "#1E293B",
      secondary: "#F59E0B",
    },
    fonts: { body: "Inter", heading: "Poppins" },
  };

  if (isLoading)
    return (
      <div className="p-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  if (error || !portfolio)
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
        </Alert>
      </div>
    );

  return (
    <div
      className="min-h-screen text-slate-100"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="container mx-auto px-4 py-8">
        <Link
          href={
            siteUser
              ? pathname?.includes("/preview/")
                ? `/preview/${siteUser}/portfolio`
                : `/portfolio`
              : "/portfolio"
          }
          className="mb-8 inline-flex items-center text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: theme.colors.primary }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
        </Link>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="sticky top-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
              <Image
                src={
                  portfolio.thumbnail_image ||
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop"
                }
                alt={portfolio.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-8 flex gap-4">
              {portfolio.project_url && (
                <a
                  href={portfolio.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-lg px-4 py-3 font-medium transition-transform hover:scale-105"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                >
                  <ExternalLink className="mr-2 h-5 w-5" /> Visit Live
                </a>
              )}
              {portfolio.github_url && (
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-lg border px-4 py-3 font-medium transition-colors hover:bg-white/5"
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary,
                  }}
                >
                  <Github className="mr-2 h-5 w-5" /> Source Code
                </a>
              )}
            </div>
          </div>

          <div className="pb-24">
            {portfolio.category && (
              <span
                className="mb-4 block text-sm font-bold tracking-widest uppercase"
                style={{
                  color: theme.colors.secondary || theme.colors.primary,
                }}
              >
                {portfolio.category.name}
              </span>
            )}
            <h1
              className="mb-8 text-5xl leading-tight font-bold text-white md:text-7xl"
              style={{ fontFamily: theme.fonts.heading }}
            >
              {portfolio.title}
            </h1>

            <div
              className="prose prose-xl prose-invert mb-12 max-w-none"
              style={{ fontFamily: theme.fonts.body }}
            >
              <div dangerouslySetInnerHTML={{ __html: portfolio.content }} />
            </div>

            {portfolio.tags && portfolio.tags.length > 0 && (
              <div>
                <h3 className="mb-4 border-b border-white/10 pb-2 text-xl font-semibold text-white">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.tags.map(tag => (
                    <Badge
                      key={tag.id}
                      className="border-0 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
