"use client";

import React from "react";
import { ExperienceTemplate3Data } from "@/types/owner-site/components/experience";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface ExperienceStyle3Props {
  experienceData: ExperienceTemplate3Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ExperienceTemplate3Data>) => void;
}

export const ExperienceStyle3: React.FC<ExperienceStyle3Props> = ({
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
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 pt-20 pb-8 md:px-6 md:pt-28 lg:px-8">
        <section className="border-t border-gray-200 py-10 first:border-t-0 first:pt-0">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="p"
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: theme.colors.primary }}
          />

          <div className="mt-6">
            {isLoading && (
              <ul className="space-y-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li
                    key={i}
                    className="grid gap-2 md:grid-cols-[160px_1fr] md:gap-8"
                  >
                    <Skeleton className="h-4 w-24" />
                    <div>
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="mt-2 h-4 w-1/4" />
                      <Skeleton className="mt-4 h-16 w-full max-w-2xl" />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {error && (
              <div className="text-red-500">
                Failed to load experience data.
              </div>
            )}

            {!isLoading && !error && (
              <ul className="space-y-8">
                {experiences.map((exp: any, index: number) => {
                  const role = exp.data?.role || "";
                  const org = exp.data?.name || "";
                  const startYear = exp.data?.startYear || "";
                  const endYear = exp.data?.endYear || "";
                  const period = `${startYear} — ${endYear}`;
                  const summary = exp.data?.description || "";

                  return (
                    <li
                      key={exp.id || index}
                      className="grid gap-2 md:grid-cols-[160px_1fr] md:gap-8"
                    >
                      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                        {period}
                      </p>
                      <div>
                        {/* Heading */}
                        <p
                          className="text-xl font-normal text-gray-900"
                          style={{ fontFamily: theme.fonts.heading }}
                        >
                          {role}
                        </p>
                        <p className="text-sm text-gray-500">{org}</p>
                        <div
                          className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-700"
                          dangerouslySetInnerHTML={{ __html: summary }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Experience Items"
            description="List your professional history or major milestones. Add items from the admin dashboard."
            actionLabel="Add new experience"
            actionLink="/admin/collections/experience"
            isEditable={isEditable}
            isEmpty={experiences.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
