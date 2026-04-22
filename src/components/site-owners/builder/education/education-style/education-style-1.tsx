"use client";

import React from "react";
import { EducationTemplate1Data } from "@/types/owner-site/components/education";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface EducationStyle1Props {
  educationData: EducationTemplate1Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<EducationTemplate1Data>) => void;
}

export const EducationStyle1: React.FC<EducationStyle1Props> = ({
  educationData,
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

  const { data, handleTextUpdate } = useBuilderLogic(educationData, onUpdate);

  const {
    data: collectionResponse,
    isLoading,
    error,
    refetch,
  } = useCollectionData(educationData.collectionSlug || "education");

  const educationItems = collectionResponse?.results || [];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 lg:py-20">
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
              <div className="space-y-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid gap-2 md:grid-cols-[160px_1fr] md:gap-8"
                  >
                    <Skeleton className="h-4 w-24" />
                    <div>
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="mt-2 h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-red-500">
                Failed to load education data.
              </div>
            )}

            {!isLoading && !error && (
              <div className="space-y-8">
                {educationItems.map((exp: any, index: number) => {
                  const name = exp.data?.name || "";
                  const org = exp.data?.["School/College name"] || "";
                  const period = exp.data?.period || "";

                  return (
                    <div
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
                          {name}
                        </p>
                        <p className="text-sm text-gray-500">{org}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={GraduationCap}
            title="No Education Items"
            description="List your educational background. Add items from the admin dashboard."
            actionLabel="Add new education"
            actionLink="/admin/collections/education"
            isEditable={isEditable}
            isEmpty={educationItems.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
