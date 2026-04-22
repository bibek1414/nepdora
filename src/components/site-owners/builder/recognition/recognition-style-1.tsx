"use client";

import React from "react";
import { RecognitionTemplate1Data } from "@/types/owner-site/components/recognition";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { Trophy, ChevronRight } from "lucide-react";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableText } from "@/components/ui/editable-text";

interface RecognitionStyle1Props {
  recognitionData: RecognitionTemplate1Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<RecognitionTemplate1Data>) => void;
}

export const RecognitionStyle1: React.FC<RecognitionStyle1Props> = ({
  recognitionData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate, setData } = useBuilderLogic(
    recognitionData,
    onUpdate
  );

  const {
    data: collectionResponse,
    isLoading,
    error,
    refetch,
  } = useCollectionData(data.collectionSlug || "recognition");

  const recognitionItems = collectionResponse?.results || [];

  return (
    <section className="bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-3">
          <EditableText
            value={data.eyebrow}
            onChange={handleTextUpdate("eyebrow")}
            isEditable={isEditable}
            as="span"
            multiline
            className="tracking-[0.2em] uppercase"
            style={{ fontFamily: theme?.fonts?.body }}
          />
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="title"
            multiline
            className="font-serif text-4xl leading-[1.1] text-gray-950 sm:text-5xl"
            style={{ fontFamily: theme?.fonts?.heading }}
          />
        </div>

        <ul className="mt-8 divide-y divide-gray-100 border-y border-gray-100">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-center justify-between py-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-12" />
              </li>
            ))
          ) : error ? (
            <li className="py-4 text-sm text-red-500">
              Failed to load recognition data.
            </li>
          ) : (
            recognitionItems.map((item: any) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <span className="text-sm font-medium">{item.data.name}</span>
                <span className="font-mono text-xs">{item.data.year}</span>
              </li>
            ))
          )}
        </ul>

        <div className="relative z-30 mt-14">
          <EditableLink
            text={data.buttonText}
            href={data.buttonHref}
            isEditable={isEditable}
            onChange={(text, href) =>
              setData({
                ...data,
                buttonText: text,
                buttonHref: href,
              })
            }
            className="group inline-flex h-10 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: theme?.colors?.primary || "#000",
              color: theme?.colors?.primaryForeground || "#fff",
            }}
          >
            {data.buttonText}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </EditableLink>
        </div>
      </div>

      {!isLoading && !error && (
        <BuilderEmptyState
          icon={Trophy}
          title="No Recognition Items"
          description="Display your awards, press, and certifications here. Add items from the admin collections."
          actionLabel="Add New Recognition"
          actionLink="/admin/collections/recognition"
          isEditable={isEditable}
          isEmpty={recognitionItems.length === 0}
          onRefresh={refetch}
        />
      )}
    </section>
  );
};
