"use client";
import React from "react";
import { CollectionsData } from "@/types/owner-site/components/collections";
import {
  useCollectionData,
  useCollection,
} from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface CollectionsStyleProps {
  data: CollectionsData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CollectionsData>) => void;
}

export const CollectionsStyle3: React.FC<CollectionsStyleProps> = ({
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
  const items = collectionItems?.results?.slice(0, data.itemsToShow || 8) || [];

  return (
    <section className="bg-[#0a0a0a] py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2
              className="text-5xl font-black tracking-tighter uppercase"
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
                className="mt-4 text-xl font-medium text-gray-400"
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
          <div className="mb-3 ml-12 hidden h-1 flex-1 bg-white/10 md:block"></div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-3/4 w-full rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              const tag = Object.entries(item.data as any).find(
                ([k, v]) =>
                  k.toLowerCase().includes("category") ||
                  k.toLowerCase().includes("type")
              )?.[1];

              return (
                <div
                  key={item.id}
                  className="group relative aspect-3/4 cursor-pointer overflow-hidden rounded-3xl bg-neutral-900"
                >
                  {image ? (
                    <Image unoptimized
                      src={String(image)}
                      alt={String(name)}
                      fill
                      className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                      No Image available
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>

                  <div className="absolute right-0 bottom-0 left-0 transform p-8 transition-transform duration-500 group-hover:-translate-y-2">
                    {!!tag && (
                      <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                        {String(tag)}
                      </span>
                    )}
                    <h3 className="text-2xl leading-tight font-bold transition-colors group-hover:text-blue-400">
                      {String(name)}
                    </h3>
                    <div className="mt-2 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
                      <p className="line-clamp-2 text-sm text-gray-400">
                        {(Object.values(item.data)
                          .filter(v => typeof v === "string" && v.length > 20)
                          .slice(0, 1)[0] as any) || "Explore details"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 py-32 text-center">
            <h3 className="text-2xl font-bold text-white/30 uppercase">
              Collection Empty
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};
