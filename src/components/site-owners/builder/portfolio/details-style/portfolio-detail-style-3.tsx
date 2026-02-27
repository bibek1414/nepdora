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
  CalendarDays,
  Home,
  ExternalLink,
  Github,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date";
import { sanitizeContent } from "@/utils/html-sanitizer";

export const PortfolioDetail3: React.FC<{
  slug: string;
  siteUser?: string;
}> = ({ slug, siteUser }) => {
  const pathname = usePathname();
  const { data: portfolio, isLoading, error } = usePortfolio(slug);

  const defaultImage =
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop";

  if (isLoading) {
    return (
      <div className="bg-background pt-0 pb-0">
        <Skeleton className="h-[60vh] min-h-[500px] w-full" />
        <div className="relative z-20 container mx-auto -mt-32 max-w-4xl px-4 pb-16">
          <div className="bg-card rounded-2xl border p-8 shadow-xl">
            <Skeleton className="mx-auto h-40 w-full" />
            <Skeleton className="mx-auto mt-8 h-8 w-3/4" />
            <Skeleton className="mx-auto mt-4 h-8 w-1/2" />
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
    <div className="bg-muted/10 min-h-screen pt-0 pb-0">
      {/* Immersive Hero Header */}
      <div className="relative flex h-[70vh] min-h-[500px] w-full items-center justify-center pt-20">
        <Image
          src={portfolioImage}
          alt={portfolio.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

        <div className="relative z-10 container mx-auto mt-12 max-w-4xl px-4 text-center">
          {portfolio.category && (
            <div className="mb-6 flex justify-center gap-2">
              <Badge className="bg-primary hover:bg-primary border-none px-4 py-1.5 font-bold tracking-widest uppercase shadow-xl">
                {portfolio.category.name}
              </Badge>
            </div>
          )}

          <h1 className="mb-8 w-full truncate text-4xl leading-tight font-black text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            {portfolio.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-lg font-medium text-white/90 drop-shadow-md">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md">
              <CalendarDays className="h-5 w-5" />
              <span>{formatDate(portfolio.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card Content Container */}
      <div className="relative z-20 container mx-auto -mt-24 max-w-4xl px-4 pb-24 md:-mt-32">
        <div className="bg-background rounded-3xl border p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] md:p-12 lg:p-16">
          <div className="border-border/60 mb-10 flex justify-center border-b pb-8">
            <Breadcrumb>
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
                      className="text-muted-foreground hover:text-primary flex items-center gap-2 font-medium transition-colors"
                    >
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={
                        siteUser
                          ? pathname?.includes("/preview/")
                            ? `/preview/${siteUser}/portfolio`
                            : `/portfolio`
                          : "/portfolio"
                      }
                      className="text-muted-foreground hover:text-primary font-medium transition-colors"
                    >
                      Portfolio
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground max-w-[150px] truncate font-semibold sm:max-w-[250px]">
                    {portfolio.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div
            className="prose prose-xl dark:prose-invert rich-text text-foreground mx-auto mb-12 max-w-none leading-relaxed break-words"
            dangerouslySetInnerHTML={{
              __html: sanitizeContent(portfolio.content),
            }}
          />

          {/* Footer Actions & Metadata */}
          <div className="border-border/60 mt-12 flex flex-col items-center justify-between gap-8 border-t pt-8 md:flex-row">
            <div className="flex w-full flex-wrap justify-center gap-4 md:w-auto md:justify-start">
              {portfolio.project_url && (
                <Button asChild size="lg" className="rounded-xl shadow-md">
                  <a
                    href={portfolio.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> View Live
                  </a>
                </Button>
              )}
              {portfolio.github_url && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                >
                  <a
                    href={portfolio.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" /> Code
                  </a>
                </Button>
              )}
            </div>

            {portfolio.tags && portfolio.tags.length > 0 && (
              <div className="flex w-full flex-wrap justify-center gap-2 md:w-auto md:justify-end">
                {portfolio.tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="rounded-lg px-3 py-1 text-sm font-medium"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
