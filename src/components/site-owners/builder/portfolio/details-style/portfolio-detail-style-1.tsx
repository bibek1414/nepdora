"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePortfolio } from "@/hooks/owner-site/admin/use-portfolio";
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
  Folder,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date";
import { sanitizeContent } from "@/utils/html-sanitizer";

interface PortfolioDetailProps {
  slug: string;
  siteUser?: string;
}

export const PortfolioDetail: React.FC<PortfolioDetailProps> = ({
  slug,
  siteUser,
}) => {
  const pathname = usePathname();
  const { data: portfolio, isLoading, error } = usePortfolio(slug);

  const defaultImage =
    "/fallback/image-not-found.png";

  if (isLoading) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto mb-12 px-4 md:px-8">
          <div className="mb-6 flex justify-center">
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="mx-auto mb-8 max-w-4xl space-y-4 text-center">
            <Skeleton className="mx-auto h-12 w-3/4" />
          </div>
          <Skeleton className="mx-auto mb-10 aspect-[16/9] h-[300px] w-full rounded-xl md:h-[450px]" />
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error?.message ||
                "Could not load portfolio details. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const portfolioImage = portfolio.thumbnail_image || defaultImage;

  return (
    <div className="bg-background pt-20 pb-0">
      <div className="container mx-auto mb-12 px-4 md:px-8">
        <nav className="mb-6">
          <ol className="text-muted-foreground flex flex-wrap items-center justify-center gap-2 text-sm">
            <li>
              <Link
                href={
                  siteUser
                    ? pathname?.includes("/preview/")
                      ? `/preview/${siteUser}`
                      : `/`
                    : "/"
                }
                className="hover:text-primary font-medium transition-colors"
              >
                Home
              </Link>
            </li>

            <li>/</li>
            <li className="text-foreground line-clamp-1 text-center font-medium">
              {portfolio.title}
            </li>
          </ol>
        </nav>

        <div className="mx-auto mb-8 max-w-4xl text-center">
          {portfolio.category && (
            <div className="text-primary mb-4 flex items-center justify-center text-sm font-semibold tracking-wider uppercase">
              <Folder className="mr-2 h-4 w-4" />
              {portfolio.category.name}
            </div>
          )}
          <h1 className="text-foreground mb-6 text-3xl font-bold md:text-5xl lg:text-7xl">
            {portfolio.title}
          </h1>

          <div className="text-muted-foreground mb-8 flex items-center justify-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(portfolio.created_at)}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {portfolio.project_url && (
              <Button asChild size="lg" className="rounded-full px-8 shadow-md">
                <a
                  href={portfolio.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Project
                </a>
              </Button>
            )}
            {portfolio.github_url && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8"
              >
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" /> View Source
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="mx-auto mb-12 aspect-[16/9] h-[300px] overflow-hidden rounded-2xl shadow-xl md:h-[500px]">
          <Image
            src={portfolioImage}
            alt={portfolio.title}
            width={1200}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="prose prose-xl dark:prose-invert rich-text mx-auto mb-16 max-w-3xl space-y-8 leading-8">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeContent(portfolio.content),
            }}
          />
        </div>

        {portfolio.tags && portfolio.tags.length > 0 && (
          <div className="mx-auto mb-20 flex max-w-3xl flex-wrap items-center justify-center gap-3 border-t pt-10">
            <span className="text-foreground font-semibold">Technologies:</span>
            {portfolio.tags.map(tag => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-4 py-1.5 text-sm"
              >
                <Tag className="mr-2 h-3 w-3" />
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
