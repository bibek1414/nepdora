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
  FolderOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date";
import { sanitizeContent } from "@/utils/html-sanitizer";

export const PortfolioDetail2: React.FC<{
  slug: string;
  siteUser?: string;
}> = ({ slug, siteUser }) => {
  const pathname = usePathname();
  const { data: portfolio, isLoading, error } = usePortfolio(slug);

  const defaultImage =
    "/fallback/image-not-found.png";

  if (isLoading) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="mb-6 h-5 w-64" />
          <Skeleton className="mb-4 h-12 w-2/3" />
          <Skeleton className="mb-12 h-[450px] w-full rounded-2xl" />
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
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
    <div className="bg-background pt-20 pb-0">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="mb-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={
                      siteUser
                        ? pathname?.includes("/preview/")
                          ? `/preview/${siteUser}`
                          : `/`
                        : "/"
                    }
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-[200px] font-medium md:max-w-[400px]">
                  {portfolio.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl">
            {portfolio.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
            A comprehensive look into the objectives, execution, and outcomes of
            this creative endeavor.
          </p>
        </div>

        {/* Big Hero Image */}
        <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-3xl shadow-sm md:h-[550px] lg:mb-20">
          <Image
            src={portfolioImage}
            alt={portfolio.title}
            fill
            className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
            priority
          />
        </div>

        {/* Content Layout (Sidebar approach) */}
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div
              className="prose prose-xl dark:prose-invert rich-text max-w-none break-words"
              dangerouslySetInnerHTML={{
                __html: sanitizeContent(portfolio.content),
              }}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Project Details Card */}
            <div className="bg-muted/30 rounded-2xl border p-8 shadow-sm">
              <h3 className="mb-6 border-b pb-4 text-xl font-bold">
                Project Info
              </h3>

              <div className="space-y-6">
                {portfolio.category && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                      Category
                    </p>
                    <p className="flex items-center gap-2 font-medium">
                      <FolderOpen className="text-primary h-4 w-4" />
                      {portfolio.category.name}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                    Date Completed
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <Calendar className="text-primary h-4 w-4" />
                    {formatDate(portfolio.created_at)}
                  </p>
                </div>
              </div>

              {(portfolio.project_url || portfolio.github_url) && (
                <div className="mt-8 space-y-3 border-t pt-6">
                  {portfolio.project_url && (
                    <Button
                      asChild
                      className="w-full rounded-xl py-6 text-base shadow-md"
                    >
                      <a
                        href={portfolio.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> View Live
                        Action
                      </a>
                    </Button>
                  )}
                  {portfolio.github_url && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-xl py-6 text-base"
                    >
                      <a
                        href={portfolio.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" /> Source Code
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Technologies Card */}
            {portfolio.tags && portfolio.tags.length > 0 && (
              <div className="bg-primary/5 border-primary/10 rounded-2xl border p-6 shadow-sm">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Tag className="text-primary h-5 w-5" />
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {portfolio.tags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="hover:bg-secondary/80 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
