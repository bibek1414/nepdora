"use client";

import React from "react";
import { motion } from "framer-motion";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { ServicesCard6 } from "../services-card/services-card6";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Briefcase, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface ServicesStyle6Props {
  data: ServicesComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ServicesComponentData["data"]>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesStyle6: React.FC<ServicesStyle6Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onServiceClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const { title, subtitle, buttonText, buttonLink } = data || {};

  // Limiting page size to 3 to map exactly to the 3-grid design specified
  const pageSize = 5;
  const { data: servicesData,
    isLoading,
    error, refetch } = useServices({
    page: 1,
    page_size: pageSize,
  });
  const services = servicesData?.results || [];

  return (
    <section className="relative bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header Section */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <EditableText
                value={title || "From concept to completion"}
                onChange={val => onUpdate?.({ title: val })}
                as="h2"
                isEditable={isEditable}
                className="text-4xl font-medium tracking-tight md:text-6xl"
                style={{ fontFamily: theme?.fonts?.heading }}
                placeholder="Enter section title..."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <EditableText
                value={subtitle || ""}
                onChange={val => onUpdate?.({ subtitle: val })}
                as="p"
                isEditable={isEditable}
                className="text-lg leading-relaxed text-[#1a1a1a]/60"
                placeholder="Enter section subtitle..."
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-30"
          >
            <EditableLink
              text={buttonText || "Browse all services"}
              href={buttonLink || "/services"}
              onChange={(newText, newHref) =>
                onUpdate?.({ buttonText: newText, buttonLink: newHref })
              }
              isEditable={isEditable}
              className="inline-flex cursor-pointer items-center rounded-full border px-8 py-4 text-sm font-medium transition-all hover:opacity-80"
              style={{
                borderColor: theme?.colors?.primary,
                backgroundColor: theme?.colors?.primary,
                color: theme?.colors?.primaryForeground,
              }}
            >
              {buttonText || "Browse all services"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </EditableLink>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="relative transform transition-transform duration-200 md:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-4xl" />
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="relative transform transition-transform duration-200 md:col-span-1"
              >
                <Skeleton className="h-[400px] w-full rounded-4xl" />
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

        {/* Content State */}
        {!isLoading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.slice(0, pageSize).map((service, index) => {
              const isFirst = index === 0;
              const cardClassName = isFirst
                ? "md:col-span-2 md:row-span-1"
                : "md:col-span-1 md:row-span-1";

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -10 }}
                  className={`${cardClassName} relative`}
                >
                  {isEditable && (
                    <div className="absolute inset-0 z-20 cursor-pointer bg-transparent" />
                  )}
                  <ServicesCard6
                    service={service}
                    siteUser={isEditable ? undefined : siteUser}
                    isFirst={isFirst}
                    isEditable={isEditable}
                    onServiceClick={onServiceClick}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Services Available"
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
