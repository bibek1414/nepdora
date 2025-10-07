"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date";

interface PortfolioDetailProps {
  slug: string;
  siteUser?: string;
}

export const PortfolioDetail: React.FC<PortfolioDetailProps> = ({
  slug,
  siteUser,
}) => {
  const { data: portfolio, isLoading, error } = usePortfolio(slug);

  const defaultImage =
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop";

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-5 w-64" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-4 md:col-span-1">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/portfolio">Portfolio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Error</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Alert variant="destructive">
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
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/preview/${siteUser}/home`}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/preview/${siteUser}/portfolio`}>Portfolio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                {portfolio.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-16">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h1 className="text-foreground mb-4 text-3xl font-bold md:text-5xl">
              {portfolio.title}
            </h1>

            <div className="text-muted-foreground mb-6 flex flex-wrap items-center gap-4 text-sm">
              {portfolio.category && (
                <Badge variant="secondary" className="text-base">
                  {portfolio.category.name}
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(portfolio.created_at)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 flex flex-wrap gap-3">
              {portfolio.project_url && (
                <a
                  href={portfolio.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Project
                  </Button>
                </a>
              )}
              {portfolio.github_url && (
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <Github className="mr-2 h-4 w-4" />
                    View Source Code
                  </Button>
                </a>
              )}
            </div>

            {/* Main Image */}
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={portfolioImage}
                alt={
                  portfolio.thumbnail_image_alt_description || portfolio.title
                }
                fill
                className="object-cover"
                onError={e => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />
            </div>

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: portfolio.content }}
            />

            {/* Tags */}
            {portfolio.tags && portfolio.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-foreground font-semibold">
                  Technologies:
                </span>
                {portfolio.tags.map(tag => (
                  <Badge key={tag.id} variant="outline">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8 md:col-span-1">
            {/* Project Info */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Project Details
              </h3>
              <div className="space-y-3 text-sm">
                {portfolio.category && (
                  <div>
                    <span className="text-muted-foreground font-medium">
                      Category:
                    </span>
                    <p className="text-foreground mt-1">
                      {portfolio.category.name}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground font-medium">
                    Completed:
                  </span>
                  <p className="text-foreground mt-1">
                    {formatDate(portfolio.created_at)}
                  </p>
                </div>
                {portfolio.tags && portfolio.tags.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">
                      Technologies:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {portfolio.tags.map(tag => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="text-xs"
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
      </div>
    </div>
  );
};
