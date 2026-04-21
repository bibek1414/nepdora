"use client";
import React from "react";
import { CollectionsData } from "@/types/owner-site/components/collections";
import {
  useCollectionData,
  useCollection,
} from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface CollectionsStyleProps {
  data: CollectionsData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CollectionsData>) => void;
}

export const CollectionsStyle2: React.FC<CollectionsStyleProps> = ({
  data,
  isEditable,
  onUpdate,
}) => {
  const { data: collectionItems, isLoading: isDataLoading } = useCollectionData(
    data.collectionSlug || ""
  );
  const { data: collectionDef, isLoading: isDefLoading } = useCollection(
    data.collectionSlug || ""
  );

  const isLoading = isDataLoading || isDefLoading;
  const items = collectionItems?.results?.slice(0, data.itemsToShow || 5) || [];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-16">
          <h2
            className="text-4xl font-extrabold text-gray-900"
            contentEditable={isEditable}
            onBlur={e =>
              onUpdate?.({ title: e.currentTarget.textContent || "" })
            }
            suppressContentEditableWarning
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p
              className="mt-4 text-xl text-gray-500"
              contentEditable={isEditable}
              onBlur={e =>
                onUpdate?.({ subtitle: e.currentTarget.textContent || "" })
              }
              suppressContentEditableWarning
            >
              {data.subtitle}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-12">
            {items.map((item: any) => {
              const image = Object.values(item.data).find(
                val =>
                  typeof val === "string" &&
                  (val.startsWith("http") || val.includes("cloudinary"))
              );
              const name =
                item.data.name ||
                item.data.title ||
                Object.values(item.data)[0];
              const desc = item.data.content || item.data.description || "";

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-start gap-8 border-b pb-12 last:border-0 md:flex-row"
                >
                  {!!image && (
                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl shadow-sm md:w-64">
                      <Image unoptimized
                        src={String(image)}
                        alt={String(name)}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      {String(name)}
                    </h3>
                    {!!desc && (
                      <div
                        className="prose prose-sm mb-4 line-clamp-3 max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{ __html: String(desc) }}
                      />
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {Object.entries(item.data as any)
                        .slice(0, 5)
                        .map(([key, val]) => {
                          if (
                            String(val).length > 100 ||
                            String(image) === String(val) ||
                            key.toLowerCase().includes("slug")
                          )
                            return null;
                          return (
                            <div
                              key={key}
                              className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                            >
                              <span className="text-gray-400 capitalize">
                                {key}:
                              </span>{" "}
                              {String(val)}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
            <p className="text-lg text-gray-400 italic">
              The collection is currently empty.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
