"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ServiceCardProps {
  service: ServicesPost;
  isActive: boolean;
  onClick: () => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isActive,
  onClick,
  theme,
}) => {
  // Strip HTML from description
  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  return (
    <div
      onClick={onClick}
      className={`relative flex min-w-[280px] flex-1 cursor-pointer flex-col items-center rounded-[32px] bg-white p-8 text-center transition-all duration-300 ease-in-out md:p-10 ${
        isActive
          ? "z-10 scale-105 shadow-xl"
          : "opacity-90 shadow-sm hover:-translate-y-1 hover:shadow-md"
      } `}
      style={{
        borderColor: isActive ? theme.colors.secondary : "transparent",
        borderWidth: isActive ? "2px" : "1px",
      }}
    >
      <div
        className="mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-inner"
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
        className="mb-4 text-xl font-bold md:text-2xl"
        style={{ color: theme.colors.primary }}
      >
        {service.title}
      </h3>

      <p className="text-sm leading-relaxed text-gray-500 md:text-base">
        {stripHtml(service.description || "")}
      </p>
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
}) => {
  const [activeIndex, setActiveIndex] = useState(1); // Middle card active by default
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

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = (index: number, service: ServicesPost) => {
    setActiveIndex(index);
    if (onServiceClick && component.order !== undefined) {
      // Optional: Navigate on click if it's already active?
      // For now just set active.
      // onServiceClick(service.slug, component.order);
    }
  };

  return (
    <div className="bg-bg-light relative mx-auto flex min-h-screen max-w-7xl items-center justify-center overflow-hidden py-20">
      {/* Background Split */}
      <div className="bg-bg-dark absolute top-0 right-0 z-0 h-full w-full rounded-bl-[100px] md:w-[35%] md:rounded-none" />

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        {/* Header Section with Navigation */}
        <div className="mb-12 flex flex-col items-end justify-between md:mb-16 md:flex-row">
          <div className="mb-8 max-w-4xl md:mb-0">
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

            <h1 className="mb-2 font-sans text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
              Adventure Unleashed
            </h1>
            <h2
              className="font-sans text-4xl font-bold tracking-tight md:text-6xl"
              style={{ color: theme.colors.primary }}
            >
              Discover Your Next
            </h2>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden gap-4 md:flex">
            <button
              onClick={handlePrev}
              className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-gray-400 transition-colors duration-300"
              style={{
                borderColor: "gray",
              }}
            >
              <ArrowLeft className="text-gray-600 transition-colors" />
            </button>
            <button
              onClick={handleNext}
              className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-gray-400 transition-colors duration-300"
            >
              <ArrowRight className="text-gray-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Cards Container */}
        <div className="relative flex flex-col items-stretch justify-center gap-6 md:flex-row md:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              isActive={index === activeIndex}
              onClick={() => handleCardClick(index, service)}
              theme={theme}
            />
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="mt-8 flex justify-center gap-4 md:hidden">
          <button
            onClick={handlePrev}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-400 active:text-white"
          >
            <ArrowLeft size={20} />
            <style jsx>{`
              button:active {
                background-color: ${theme.colors.primary};
              }
            `}</style>
          </button>
          <button
            onClick={handleNext}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-400 active:text-white"
          >
            <ArrowRight size={20} />
            <style jsx>{`
              button:active {
                background-color: ${theme.colors.primary};
              }
            `}</style>
          </button>
        </div>
      </div>
    </div>
  );
};
