"use client";

import React from "react";
import { ExperienceTemplate1Data } from "@/types/owner-site/components/experience";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";

interface ExperienceStyle1Props {
  experienceData: ExperienceTemplate1Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ExperienceTemplate1Data>) => void;
}

export const ExperienceStyle1: React.FC<ExperienceStyle1Props> = ({
  experienceData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const { data, handleTextUpdate } = useBuilderLogic(experienceData, onUpdate);

  const {
    data: collectionResponse,
    isLoading,
    error,
  } = useCollectionData(experienceData.collectionSlug || "experience");

  const experiences = collectionResponse?.results || [];

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Left Column: Title */}
          <div className="md:col-span-4 lg:col-span-3">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              as="h2"
              className="text-5xl font-bold tracking-tight md:text-6xl"
              style={{
                fontFamily: theme.fonts.heading,
              }}
            />
          </div>

          {/* Right Column: Experience List */}
          <div className="space-y-12 md:col-span-8 lg:col-span-9">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4 border-b pb-12 last:border-0">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <div className="h-px w-8 bg-gray-300" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : error ? (
              <div className="text-red-500">
                Failed to load experience data.
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-gray-500 italic">
                No experience data found.
              </div>
            ) : (
              experiences.map((exp: any, index: number) => (
                <div
                  key={exp.id || index}
                  className="space-y-6 border-b border-gray-100 pb-12 last:border-0"
                >
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                    <span>{exp.data.name}</span>
                    <div className="h-px w-8 bg-gray-200" />
                    <span>
                      {exp.data.startYear} / {exp.data.endYear}
                    </span>
                  </div>

                  <div
                    className="text-2xl font-normal md:text-3xl"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    {exp.data.role}
                  </div>

                  <div
                    className="prose prose-sm max-w-none leading-relaxed text-gray-500"
                    dangerouslySetInnerHTML={{ __html: exp.data.description }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
