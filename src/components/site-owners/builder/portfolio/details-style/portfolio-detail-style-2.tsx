"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePortfolio } from "@/hooks/owner-site/admin/use-portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertCircle,
  Home,
  Tag,
  ExternalLink,
  Github,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date";

export const PortfolioDetail2: React.FC<{
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
      background: "#FFFFFF",
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
    <div className="bg-background">
      {/* Visual Header */}
      <div
        className="bg-muted py-12 md:py-24"
        style={{ backgroundColor: theme.colors.primary + "11" }}
      >
        <div className="container mx-auto max-w-5xl px-4 text-center">
          {portfolio.category && (
            <Badge
              className="mb-6 tracking-wider uppercase"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
            >
              {portfolio.category.name}
            </Badge>
          )}
          <h1
            className="mb-6 text-4xl font-extrabold md:text-6xl"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.primary,
            }}
          >
            {portfolio.title}
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            A deep dive into the creation, execution, and outcomes of this
            project.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {portfolio.project_url && (
              <Button
                asChild
                size="lg"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                }}
              >
                <a
                  href={portfolio.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Preview
                </a>
              </Button>
            )}
            {portfolio.github_url && (
              <Button
                asChild
                variant="outline"
                size="lg"
                style={{
                  borderColor: theme.colors.primary,
                  color: theme.colors.primary,
                }}
              >
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" /> Repository
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto -mt-16 mb-16 max-w-6xl px-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
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
      </div>

      <div className="container mx-auto max-w-4xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="hidden space-y-6 border-r pr-4 md:col-span-1 md:block">
            <div>
              <p className="text-muted-foreground mb-1 text-sm font-bold tracking-widest uppercase">
                Date
              </p>
              <div className="flex items-center text-sm font-medium">
                <Calendar className="mr-2 h-4 w-4" />{" "}
                {formatDate(portfolio.created_at)}
              </div>
            </div>

            {portfolio.tags && portfolio.tags.length > 0 && (
              <div>
                <p className="text-muted-foreground mb-3 text-sm font-bold tracking-widest uppercase">
                  Technologies
                </p>
                <div className="flex flex-col gap-2">
                  {portfolio.tags.map(t => (
                    <div key={t.id} className="flex items-center text-sm">
                      <CheckCircle2
                        className="mr-2 h-4 w-4"
                        style={{ color: theme.colors.primary }}
                      />{" "}
                      {t.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none md:col-span-3"
            dangerouslySetInnerHTML={{ __html: portfolio.content }}
            style={{ fontFamily: theme.fonts.body }}
          />
        </div>
      </div>
    </div>
  );
};
