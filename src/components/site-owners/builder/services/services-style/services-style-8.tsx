"use client";

import React from "react";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { Skeleton } from "@/components/ui/skeleton";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ServicesData } from "@/types/owner-site/components/services";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { ServicesCard8 } from "../services-card/services-card-8";
import { Briefcase } from "lucide-react";

interface ServicesStyle8Props {
  data: ServicesData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<ServicesData>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesStyle8: React.FC<ServicesStyle8Props> = ({
  data: initialData,
  isEditable = false,
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
    page_size: 10,
  });

  const services = servicesData?.results || [];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-8 py-16 md:py-24">
        <div className="space-y-3">
          <EditableText
            value={data.eyebrow || ""}
            onChange={handleTextUpdate("eyebrow")}
            isEditable={isEditable}
            as="span"
            className="tracking-[0.2em] uppercase"
            style={{ fontFamily: theme?.fonts?.body }}
          />
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="title"
            className="font-serif text-4xl leading-[1.1] text-gray-950 sm:text-5xl"
            style={{ fontFamily: theme?.fonts?.heading }}
          />
        </div>

        <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="border-t border-gray-100 pt-6">
                <Skeleton className="mb-3 h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-5/6" />
              </li>
            ))
          ) : error ? (
            <li className="py-6 text-red-500">Failed to load services.</li>
          ) : (
            services.map(service => (
              <ServicesCard8
                key={service.id}
                service={service}
                theme={theme}
                isEditable={isEditable}
                onServiceClick={onServiceClick}
              />
            ))
          )}
        </ul>
      </div>

      <div className="pb-10">
        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Services"
            description="List your areas of expertise. Add services from the admin dashboard."
            actionLabel="Add new services"
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
