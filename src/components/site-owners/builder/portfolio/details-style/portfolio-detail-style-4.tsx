"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, Home, Briefcase } from "lucide-react";
import { usePortfolio } from "@/hooks/owner-site/admin/use-portfolio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PortfolioDetailProps {
  slug: string;
  siteUser: string;
  isEditable?: boolean;
}

export const PortfolioDetail4: React.FC<PortfolioDetailProps> = ({
  slug,
  siteUser,
  isEditable = false,
}) => {
  const pathname = usePathname();
  const { data: portfolio, isLoading, error } = usePortfolio(slug as string);
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

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-8 h-10 w-96" />
        <Skeleton className="mb-12 h-[60vh] w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="bg-background py-0 pt-20">
        <div className="container mx-auto max-w-7xl px-4 py-8">
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
            <div className="container mx-auto px-4 py-24 text-center">
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ fontFamily: theme?.fonts?.heading }}
              >
                Project Not Found
              </h2>
              <p
                className="mb-8 text-gray-500"
                style={{ fontFamily: theme?.fonts?.body }}
              >
                The portfolio project you are looking for does not exist or has
                been removed.
              </p>
              <Link href="/portfolio">
                <Button variant="outline">Return to Portfolio</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#fdfcf9] pb-24">
      <div className="mx-auto max-w-7xl px-6 pt-12 md:pt-24 lg:px-8">
        {/* Navigation / Breadcrumb */}
        <div className="mb-10 flex justify-start">
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
                    className="flex items-center gap-2 font-medium text-black transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    Home
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

        {/* Header */}
        <header className="mb-16 max-w-4xl">
          <h1
            className="l mb-6 text-4xl font-bold text-gray-950 md:text-6xl lg:text-5xl"
            style={{ fontFamily: theme?.fonts?.heading }}
          >
            {portfolio.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-6 text-gray-500"
            style={{ fontFamily: theme?.fonts?.body }}
          >
            {portfolio.category && (
              <span className="flex items-center text-base font-medium">
                <Tag className="mr-2 h-4 w-4" />
                {portfolio.category.name}
              </span>
            )}

            <span className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4" />
              {new Date(portfolio.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Main Image */}
        {portfolio.thumbnail_image && (
          <div className="relative mb-16 aspect-video w-full overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
            <Image unoptimized
              src={portfolio.thumbnail_image}
              alt={portfolio.thumbnail_image_alt_description || portfolio.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Structure */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
          {/* Main Body */}
          <div
            className="prose prose-lg prose-gray max-w-none lg:col-span-8"
            style={{ fontFamily: theme?.fonts?.body }}
          >
            {portfolio.content ? (
              <div dangerouslySetInnerHTML={{ __html: portfolio.content }} />
            ) : portfolio.meta_description ? (
              <p className="text-xl leading-relaxed text-gray-600">
                {portfolio.meta_description}
              </p>
            ) : (
              <p className="text-gray-400 italic">
                No detailed description was provided for this project.
              </p>
            )}
          </div>

          {/* Sidebar / Meta Details */}
          <div className="space-y-8 lg:col-span-4">
            {(portfolio.project_url || portfolio.github_url) && (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3
                  className="mb-6 text-lg font-bold text-gray-950"
                  style={{ fontFamily: theme?.fonts?.heading }}
                >
                  Project Links
                </h3>
                <div className="flex flex-col gap-4">
                  {portfolio.project_url && (
                    <a
                      href={portfolio.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground,
                      }}
                    >
                      Visit Live Project
                    </a>
                  )}

                  {portfolio.github_url && (
                    <a
                      href={portfolio.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                      View Source Code
                    </a>
                  )}
                </div>
              </div>
            )}

            {portfolio.tags && portfolio.tags.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3
                  className="mb-4 text-lg font-bold text-gray-950"
                  style={{ fontFamily: theme?.fonts?.heading }}
                >
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.tags.map((tag: any) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-gray-100 px-3 py-1 text-sm font-normal text-gray-700 hover:bg-gray-200"
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
    </article>
  );
};
