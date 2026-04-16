"use client";

import React from "react";
import { OurClientsCard6 } from "../our-clients-card/our-clients-card6";
import { EditableText } from "@/components/ui/editable-text";
import { OurClientsComponentData } from "@/types/owner-site/components/our-client";
import { useGetOurClients } from "@/hooks/owner-site/admin/use-our-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Handshake } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface OurClientsStyleProps {
  data: OurClientsComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OurClientsComponentData["data"]>) => void;
}

export const OurClientsStyle6: React.FC<OurClientsStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const { title = "Some of the brands we work with", subtitle } = data || {};
  const { data: clientsData, isLoading , refetch } = useGetOurClients({});
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
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
  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section
      className="relative overflow-hidden py-20 text-white md:py-24"
      style={{
        background: theme.colors.background,
      }}
    >
      {/* Background patterns similar to screenshot */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-1/4 -left-1/4 h-[150%] w-[150%] rotate-12 transform bg-linear-to-br from-white/10 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4">
        {(title || isEditable) && (
          <div className="mb-16 text-center">
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="text-4xl font-bold tracking-tight md:text-5xl"
              isEditable={isEditable}
              placeholder="Enter title..."
            />
            {subtitle && (
              <EditableText
                value={subtitle}
                onChange={handleSubtitleChange}
                as="p"
                className="mt-4 opacity-80"
                isEditable={isEditable}
                placeholder="Enter subtitle..."
              />
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-32 w-32 rounded-full bg-white/10 md:h-48 md:w-48"
              />
            ))}
          </div>
        )}
        {!isLoading && clientsData && clientsData.length > 0 && (
          <OurClientsCard6 clients={clientsData} data={data} />
        )}
        {!isLoading && (
          <BuilderEmptyState
            icon={Handshake}
            title="No Clients Added"
            description="Display your clients or partners. Add client logos in the admin dashboard."
            actionLabel="Add New Client"
            actionLink="/admin/our-clients"
            isEditable={isEditable}
            isEmpty={!clientsData || clientsData.length === 0}
          onRefresh={refetch}
          />
        )}

      </div>
    </section>
  );
};
