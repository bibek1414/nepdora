"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Briefcase, ChevronRight, Layout, Palette, Code, BarChart, Rocket, Globe } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { ServicesData } from "@/types/owner-site/components/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { hexToRgba } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { ServicesPost } from "@/types/owner-site/admin/services";

interface ServicesStyle9Props {
  data: ServicesData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ServicesData>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

const ICON_MAP: Record<string, any> = {
  strategy: BarChart,
  design: Palette,
  engineering: Code,
  growth: Rocket,
  branding: Layout,
  web: Globe,
  default: Briefcase,
};

const getIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("strategy")) return ICON_MAP.strategy;
  if (lowerTitle.includes("design")) return ICON_MAP.design;
  if (lowerTitle.includes("engineering") || lowerTitle.includes("development") || lowerTitle.includes("code")) return ICON_MAP.engineering;
  if (lowerTitle.includes("growth") || lowerTitle.includes("marketing")) return ICON_MAP.growth;
  if (lowerTitle.includes("branding")) return ICON_MAP.branding;
  if (lowerTitle.includes("web")) return ICON_MAP.web;
  return ICON_MAP.default;
};

const ServiceCard: React.FC<{
  service: ServicesPost;
  theme: any;
  isEditable: boolean;
  onServiceClick?: (slug: string) => void;
  siteUser?: string;
}> = ({ service, theme, isEditable, onServiceClick, siteUser }) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const Icon = getIcon(service.title);

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode ? "/service-details-draft" : "/service-details";
    return generateLinkHref(`${basePath}/${service.slug}`, siteUser, pathname);
  };

  const handleActivate = () => {
    if (isEditable) return;
    if (onServiceClick) {
      onServiceClick(service.slug);
      return;
    }
    window.location.href = getDetailsUrl();
  };

  return (
    <div
      onMouseEnter={() => !isEditable && setIsHovered(true)}
      onMouseLeave={() => !isEditable && setIsHovered(false)}
      onClick={handleActivate}
      className={`group bg-white p-10 transition-colors duration-300 h-full flex flex-col ${isEditable ? "cursor-default" : "cursor-pointer"}`}
      style={{
        backgroundColor: isHovered ? hexToRgba(theme?.colors?.primary || "#000", 0.03) : "white",
      }}
    >
      <div className="mb-8 relative">
         <span 
          className="inline-flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300"
          style={{
            backgroundColor: isHovered ? theme?.colors?.primary : hexToRgba(theme?.colors?.secondary || "#f1f5f9", 0.1),
            color: isHovered ? theme?.colors?.primaryForeground : theme?.colors?.primary,
          }}
        >
          <Icon className="h-6 w-6" />
        </span>
      </div>
      
      <h3 
        className="text-2xl font-semibold tracking-tight mb-4"
        style={{ fontFamily: theme?.fonts?.heading }}
      >
        {service.title}
      </h3>
      
      <p 
        className="text-gray-600 leading-relaxed text-balance"
        style={{ fontFamily: theme?.fonts?.body }}
      >
        {service.description}
      </p>
    </div>
  );
};

export const ServicesStyle9: React.FC<ServicesStyle9Props> = ({
  data: initialData,
  isEditable = false,
  siteUser,
  onUpdate,
  onServiceClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const { data, handleTextUpdate } = useBuilderLogic(initialData, onUpdate);

  const {
    data: servicesData,
    isLoading,
    error,
    refetch,
  } = useServices({
    page: 1,
    page_size: 6,
  });

  const services = servicesData?.results || [];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-8 py-24 md:py-32">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-end">
          <div className="lg:col-span-5 space-y-6">
            <EditableText
              value={data.eyebrow || "What we do"}
              onChange={handleTextUpdate("eyebrow")}
              isEditable={isEditable}
              as="span"
              className="text-sm font-semibold tracking-widest text-primary/70 block"
              style={{ fontFamily: theme?.fonts?.body, color: theme?.colors?.primary }}
            />
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              as="h2"
              className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-balance"
              style={{ fontFamily: theme?.fonts?.heading }}
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
             <EditableText
              value={data.subtitle || ""}
              onChange={handleTextUpdate("subtitle")}
              isEditable={isEditable}
              as="p"
              className="text-xl leading-relaxed text-gray-600 text-pretty"
              style={{ fontFamily: theme?.fonts?.body }}
            />
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-10 h-[350px]">
                <Skeleton className="h-12 w-12 rounded-full mb-8" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-full p-12 bg-white">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Services</AlertTitle>
                <AlertDescription>Failed to load services. Please try again.</AlertDescription>
              </Alert>
            </div>
          ) : (
            services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                theme={theme} 
                isEditable={isEditable}
                onServiceClick={onServiceClick}
                siteUser={siteUser}
              />
            ))
          )}
        </div>

        {/* Footer Action */}
        {!isLoading && !error && services.length > 0 && (
          <div className="mt-16 flex justify-center relative z-30">
            <EditableLink
              text={data.buttonText || "Explore all services"}
              href={data.buttonLink || "/services"}
              onChange={(newText, newHref) =>
                onUpdate?.({ buttonText: newText, buttonLink: newHref })
              }
              isEditable={isEditable}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all hover:gap-3 group"
              style={{
                backgroundColor: "white",
                border: `1px solid ${theme?.colors?.primary || "#000"}`,
                color: theme?.colors?.primary || "#000",
              }}
            >
              {data.buttonText || "Explore all services"}
              <ChevronRight className="h-4 w-4 transition-transform" />
            </EditableLink>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Services Found"
            description="Start by adding your services in the admin dashboard to showcase your expertise."
            actionLabel="Add Services"
            actionLink="/admin/services"
            isEditable={isEditable}
            isEmpty={services.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
