"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Send } from "lucide-react";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ServiceCardProps {
  service: ServicesPost;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  siteUser?: string;
}

const ServiceCard: React.FC<ServiceCardProps & { pathname: string | null }> = ({
  service,
  theme,
  siteUser,
  pathname,
}) => {
  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/service-details-draft"
      : "/service-details";
    return generateLinkHref(`${basePath}/${service.slug}`, siteUser, pathname);
  };

  const detailsUrl = getDetailsUrl();
  // Strip HTML from description
  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  return (
    <div
      className="relative flex w-full flex-col items-center rounded-[24px] bg-white p-6 text-center shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md sm:rounded-[28px] sm:p-7 md:rounded-[32px] md:p-8 lg:min-w-[280px] lg:flex-1"
      style={{
        borderColor: "transparent",
        borderWidth: "1px",
      }}
    >
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full shadow-inner sm:mb-7 sm:h-22 sm:w-22 md:mb-8 md:h-24 md:w-24"
        style={{ backgroundColor: theme.colors.secondary }}
      >
        {service.thumbnail_image ? (
          <div className="relative h-full w-full">
            <Image
              src={service.thumbnail_image}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <span className="text-2xl font-bold text-white">
            {service.title.charAt(0)}
          </span>
        )}
      </div>

      <h3
        className="mb-3 text-lg font-bold sm:mb-3.5 sm:text-xl md:mb-4 md:text-xl lg:text-2xl"
        style={{ color: theme.colors.primary }}
      >
        {service.title}
      </h3>

      <p className="text-xs leading-relaxed text-gray-500 sm:text-sm md:text-sm lg:text-base">
        {stripHtml(service.description || "")}
      </p>

      {/* Learn More Link */}
      <Link
        href={detailsUrl}
        className="mt-4 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{ color: theme.colors.primary }}
      >
        Learn More →
      </Link>
    </div>
  );
};

interface ServicesCard6Props {
  component: ServicesComponentData;
  services: ServicesPost[];
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ServicesComponentData) => void;
  onServiceClick?: (serviceSlug: string, order: number) => void;
}

export const ServicesCard6: React.FC<ServicesCard6Props> = ({
  component,
  services,
  onServiceClick,
  siteUser,
}) => {
  const pathname = usePathname();
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#1a4d2e", // Default to previous ADVENTURE_GREEN
      primaryForeground: "#FFFFFF",
      secondary: "#d9f99d", // Default to previous ADVENTURE_LIME
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  return (
    <div className="bg-bg-light relative mx-auto flex min-h-[600px] max-w-7xl cursor-pointer items-center justify-center overflow-hidden py-12 sm:min-h-[700px] sm:py-14 md:min-h-[900px] md:py-18 lg:min-h-screen">
      {/* Background Split */}
      <div className="bg-bg-dark absolute top-0 right-0 z-0 h-1/3 w-full rounded-bl-[60px] sm:h-2/5 sm:rounded-bl-[70px] md:h-3/5 md:w-[45%] md:rounded-bl-[90px] lg:h-full lg:w-[35%] lg:rounded-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header Section with Navigation */}
        <div className="mb-8 flex flex-col items-start justify-between sm:mb-10 md:mb-14 lg:mb-16 lg:flex-row lg:items-end">
          <div className="mb-6 max-w-4xl sm:mb-7 md:mb-8 lg:mb-0">
            <div className="mb-4 flex items-center gap-2">
              <span
                className="text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: theme.colors.primary }}
              >
                Our Services
              </span>
              <Send
                size={12}
                className="-rotate-45"
                fill="currentColor"
                style={{ color: theme.colors.secondary }}
              />
            </div>

            <h1 className="mb-2 font-sans text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Adventure Unleashed
            </h1>
            <h2
              className="font-sans text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
              style={{ color: theme.colors.primary }}
            >
              Discover Your Next
            </h2>
          </div>
        </div>

        {/* Cards Container */}
        <div className="relative grid grid-cols-1 items-stretch justify-center gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:flex lg:flex-row lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              theme={theme}
              siteUser={siteUser}
              pathname={pathname}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
