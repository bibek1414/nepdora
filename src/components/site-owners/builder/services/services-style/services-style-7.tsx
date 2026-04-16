"use client";

import React, { useState } from "react";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { ServicesCard7 } from "../services-card/services-card-7";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Package } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import Pagination from "@/components/ui/pagination";
import { Briefcase } from "lucide-react";

interface ServicesStyle7Props {
  data: ServicesComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ServicesComponentData["data"]>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

/**
 * @beautifulMention: Services Style 7
 * Paginated services grid with 4 columns on desktop.
 * Premium layout with card-based design and smooth animations.
 */
export const ServicesStyle7: React.FC<ServicesStyle7Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onServiceClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: { primary: "#000000", primaryForeground: "#ffffff" },
    fonts: { heading: "Inter", body: "Inter" },
  };

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const {
    title = "Our Services",
    subtitle = "Explore our premium range of professional services tailored to your needs.",
  } = data || {};

  const { data: servicesData,
    isLoading,
    error, refetch } = useServices({
    page,
    page_size: pageSize,
  });

  const services = servicesData?.results || [];
  const totalCount = servicesData?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="mb-4 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="mx-auto max-w-2xl text-lg text-gray-600"
            style={{ fontFamily: theme.fonts.body }}
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Services</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load services."}
            </AlertDescription>
          </Alert>
        )}

        {/* Content Section */}
        {!isLoading && !error && services.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <div key={service.id} className="relative">
                  {isEditable && <div className="absolute inset-0 z-10" />}
                  <ServicesCard7
                    service={service}
                    idx={index}
                    siteUser={siteUser}
                    isEditable={isEditable}
                    onServiceClick={onServiceClick}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Services Found"
            description="List your services to attract clients. Add services from the admin dashboard."
            actionLabel="Add New Services"
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
