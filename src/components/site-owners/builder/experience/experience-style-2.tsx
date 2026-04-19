"use client";
import React from "react";
import { ExperienceTemplate2Data } from "@/types/owner-site/components/experience";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface ExperienceStyle2Props {
  experienceData: ExperienceTemplate2Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ExperienceTemplate2Data>) => void;
}

export const ExperienceStyle2: React.FC<ExperienceStyle2Props> = ({
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
    refetch,
  } = useCollectionData(experienceData.collectionSlug || "experience");

  const experiences = collectionResponse?.results || [];

  return (
    <section className="section-padding py-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="p"
            isEditable={isEditable}
          />

          <EditableText
            value={data.sub_title}
            onChange={handleTextUpdate("sub_title")}
            as="h2"
            className="text-3xl font-bold tracking-tight md:text-4xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
          />
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="bg-border absolute top-0 bottom-0 left-0 w-px md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {isLoading && (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col gap-6 md:flex-row ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    <div
                      className="bg-primary absolute top-1 left-0 h-3 w-3 -translate-x-[5px] rounded-full shadow-[0_0_12px_hsl(210,100%,60%,0.6)] md:left-1/2 md:-translate-x-[6px]"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className={`md:w-1/2 ${i % 2 === 0 ? "md:pl-10" : "md:pr-10 md:text-right"} pl-6 md:pl-0`}
                    >
                      <Skeleton className="mb-2 h-4 w-24" />
                      <Skeleton className="mb-1 h-6 w-3/4" />
                      <Skeleton className="mb-4 h-4 w-1/2" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </>
            )}
            {error && (
              <div className="text-center text-red-500">
                Failed to load experience data.
              </div>
            )}

            {!isLoading &&
              !error &&
              experiences.map((exp: any, i: number) => (
                <div
                  key={exp.id || i}
                  className={`relative flex flex-col gap-6 md:flex-row ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Dot */}
                  <div
                    className="bg-primary absolute top-1 left-0 h-3 w-3 -translate-x-[5px] rounded-full shadow-[0_0_12px_hsl(210,100%,60%,0.6)] md:left-1/2 md:-translate-x-[6px]"
                    style={{ backgroundColor: theme.colors.primary }}
                  />

                  <div
                    className={`md:w-1/2 ${i % 2 === 0 ? "md:pl-10" : "md:pr-10 md:text-right"} pl-6 md:pl-0`}
                  >
                    <span
                      className="text-primary font-mono text-xs"
                      style={{ color: theme.colors.primary }}
                    >
                      {exp.data.startYear} - {exp.data.endYear || "Present"}
                    </span>
                    <h3
                      className="mt-1 text-lg font-semibold"
                      style={{ fontFamily: theme.fonts.heading }}
                    >
                      {exp.data.role}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {exp.data.name}
                    </p>
                    <div
                      className="text-muted-foreground mt-2 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: exp.data.description }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {!isLoading && !error && (
        <BuilderEmptyState
          icon={Briefcase}
          title="No Experience Items"
          description="List your professional history or major milestones. Add items from the admin dashboard."
          actionLabel={experiences.length > 0 ? "Manage Experience" : "Add New Experience"}
          actionLink="/admin/collections/experience"
          isEditable={isEditable}
          isEmpty={experiences.length === 0}
          onRefresh={refetch}
        />
      )}
    </section>
  );
};
