"use client";
import React from "react";
import { CollectionsData } from "@/types/owner-site/components/collections";
import { useCollectionData, useCollection } from "@/hooks/owner-site/admin/use-collections";
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16">
          <h2 
            className="text-4xl font-extrabold text-gray-900"
            contentEditable={isEditable}
            onBlur={(e) => onUpdate?.({ title: e.currentTarget.textContent || "" })}
            suppressContentEditableWarning
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p 
              className="mt-4 text-xl text-gray-500"
              contentEditable={isEditable}
              onBlur={(e) => onUpdate?.({ subtitle: e.currentTarget.textContent || "" })}
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
              const image = Object.values(item.data).find(val => typeof val === "string" && (val.startsWith("http") || val.includes("cloudinary")));
              const name = item.data.name || item.data.title || Object.values(item.data)[0];
              const desc = item.data.content || item.data.description || "";
              
              return (
                <div key={item.id} className="flex flex-col md:flex-row gap-8 items-start border-b pb-12 last:border-0">
                  {!!image && (
                    <div className="relative h-48 w-full md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                      <Image
                        src={String(image)}
                        alt={String(name)}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{String(name)}</h3>
                    {!!desc && (
                      <div 
                        className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: String(desc) }}
                      />
                    )}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {Object.entries(item.data as any).slice(0, 5).map(([key, val]) => {
                         if (String(val).length > 100 || String(image) === String(val) || key.toLowerCase().includes("slug")) return null;
                         return (
                           <div key={key} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                             <span className="text-gray-400 capitalize">{key}:</span> {String(val)}
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
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg italic">The collection is currently empty.</p>
          </div>
        )}
      </div>
    </section>
  );
};
