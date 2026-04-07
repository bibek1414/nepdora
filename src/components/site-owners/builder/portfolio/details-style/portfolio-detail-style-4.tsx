"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { usePortfolio } from "@/hooks/owner-site/admin/use-portfolio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PortfolioDetailProps {
  slug: string;
  siteUser: string;
}

export const PortfolioDetail4: React.FC<PortfolioDetailProps> = ({ slug }) => {
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-10 w-96 mb-8" />
        <Skeleton className="h-[60vh] w-full rounded-3xl mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-4">
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
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: theme?.fonts?.heading }}>Project Not Found</h2>
        <p className="text-gray-500 mb-8" style={{ fontFamily: theme?.fonts?.body }}>The portfolio project you are looking for does not exist or has been removed.</p>
        <Link href="/portfolio">
          <Button variant="outline">Return to Portfolio</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-[#fdfcf9] min-h-screen pb-24">
      {/* 
        @beautifulMention
        - Layout: Clean, minimal layout utilizing max-w-7xl.
        - Hero: A large, striking image spanning the width with gentle corners.
        - Typography: High contrast, large format text using theme fonts.
        - Colors: Light, neutral background.
      */}
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-12 md:pt-24">
        {/* Navigation / Breadcrumb */}
        <div className="mb-12">
           <Link href="/portfolio" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to portfolio
           </Link>
        </div>

        {/* Header */}
        <header className="mb-16 max-w-4xl">
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-950 mb-6 leading-tight"
            style={{ fontFamily: theme?.fonts?.heading }}
          >
            {portfolio.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-500" style={{ fontFamily: theme?.fonts?.body }}>
            {portfolio.category && (
              <span className="flex items-center text-base font-medium">
                <Tag className="mr-2 h-4 w-4" />
                 {portfolio.category.name}
              </span>
            )}
            
            <span className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                {new Date(portfolio.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Main Image */}
        {portfolio.thumbnail_image && (
          <div className="w-full aspect-video relative rounded-3xl overflow-hidden mb-16 shadow-sm border border-gray-100">
            <Image
              src={portfolio.thumbnail_image}
              alt={portfolio.thumbnail_image_alt_description || portfolio.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Main Body */}
          <div className="lg:col-span-8 prose prose-lg prose-gray max-w-none" style={{ fontFamily: theme?.fonts?.body }}>
            {portfolio.content ? (
              <div dangerouslySetInnerHTML={{ __html: portfolio.content }} />
            ) : portfolio.meta_description ? (
              <p className="text-xl text-gray-600 leading-relaxed">{portfolio.meta_description}</p>
            ) : (
                <p className="text-gray-400 italic">No detailed description was provided for this project.</p>
            )}
          </div>

          {/* Sidebar / Meta Details */}
          <div className="lg:col-span-4 space-y-8">
            {(portfolio.project_url || portfolio.github_url) && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-950 mb-6" style={{ fontFamily: theme?.fonts?.heading }}>Project Links</h3>
                   <div className="flex flex-col gap-4">
                     {portfolio.project_url && (
                        <a 
                            href={portfolio.project_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex w-full justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors"
                            style={{ backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground }}
                        >
                            Visit Live Project
                        </a>
                     )}
                     
                     {portfolio.github_url && (
                         <a 
                            href={portfolio.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex w-full justify-center bg-gray-950 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-800"
                        >
                            View Source Code
                        </a>
                     )}
                   </div>
                </div>
            )}

            {portfolio.tags && portfolio.tags.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-950 mb-4" style={{ fontFamily: theme?.fonts?.heading }}>Tags</h3>
                   <div className="flex flex-wrap gap-2">
                       {portfolio.tags.map((tag: any) => (
                           <Badge key={tag.id} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 font-normal text-sm">
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
