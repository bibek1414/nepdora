"use client";
import React from "react";
import { CollectionsData } from "@/types/owner-site/components/collections";
import { useCollectionData, useCollection } from "@/hooks/owner-site/admin/use-collections";
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
    <section className="py-24 bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 
              className="text-5xl font-black uppercase tracking-tighter"
              contentEditable={isEditable}
              onBlur={(e) => onUpdate?.({ title: e.currentTarget.textContent || "" })}
              suppressContentEditableWarning
            >
              {data.title}
            </h2>
            {data.subtitle && (
              <p 
                className="mt-4 text-xl text-gray-400 font-medium"
                contentEditable={isEditable}
                onBlur={(e) => onUpdate?.({ subtitle: e.currentTarget.textContent || "" })}
                suppressContentEditableWarning
              >
                {data.subtitle}
              </p>
            )}
          </div>
          <div className="h-1 flex-1 bg-white/10 hidden md:block mb-3 ml-12"></div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-3/4 w-full rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item: any) => {
              const image = Object.values(item.data).find(val => typeof val === "string" && (val.startsWith("http") || val.includes("cloudinary")));
              const name = item.data.name || item.data.title || Object.values(item.data)[0];
              const tag = Object.entries(item.data as any).find(([k, v]) => k.toLowerCase().includes("category") || k.toLowerCase().includes("type"))?.[1];
              
              return (
                <div key={item.id} className="group relative aspect-3/4 overflow-hidden rounded-3xl bg-neutral-900 cursor-pointer">
                  {image ? (
                    <Image
                      src={String(image)}
                      alt={String(name)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                      No Image available
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                    {!!tag && (
                      <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-4">
                        {String(tag)}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold leading-tight group-hover:text-blue-400 transition-colors">
                      {String(name)}
                    </h3>
                    <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500 opacity-0 group-hover:opacity-100 mt-2">
                       <p className="text-sm text-gray-400 line-clamp-2">
                         {(Object.values(item.data).filter(v => typeof v === "string" && v.length > 20).slice(0,1)[0] as any) || "Explore details"}
                       </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center border border-white/10 rounded-3xl">
            <h3 className="text-2xl text-white/30 font-bold uppercase">Collection Empty</h3>
          </div>
        )}
      </div>
    </section>
  );
};
