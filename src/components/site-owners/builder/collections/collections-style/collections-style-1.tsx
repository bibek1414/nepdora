"use client";
import React from "react";
import { CollectionsData } from "@/types/owner-site/components/collections";
import {
  useCollectionData,
  useCollection,
} from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Database } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface CollectionsStyleProps {
  data: CollectionsData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CollectionsData>) => void;
}

export const CollectionsStyle1: React.FC<CollectionsStyleProps> = ({
  data,
  isEditable,
  onUpdate,
}) => {
  const {
    data: collectionItems,
    isLoading: isDataLoading,
    refetch,
  } = useCollectionData(data.collectionSlug || "");
  const { data: collectionDef, isLoading: isDefLoading } = useCollection(
    data.collectionSlug || ""
  );

  const isLoading = isDataLoading || isDefLoading;
  const items = collectionItems?.results?.slice(0, data.itemsToShow || 6) || [];

  // Helper to find relevant fields
  const getField = (itemData: any, type: string) => {
    const fieldDef = collectionDef?.all_fields.find(f => f.type === type);
    if (fieldDef) return itemData[fieldDef.name];

    // Fallback search
    const entries = Object.entries(itemData);
    if (type === "image") {
      return entries.find(
        ([key, val]) =>
          typeof val === "string" &&
          (val.startsWith("http") || val.includes("cloudinary"))
      )?.[1];
    }
    return null;
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
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
              className="mt-4 text-lg text-gray-600"
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item: any) => {
              const image = getField(item.data, "image");
              const name =
                item.data.name ||
                item.data.title ||
                Object.values(item.data)[0];

              return (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                >
                  {image && (
                    <div className="relative h-48 w-full">
                      <Image
                        unoptimized
                        src={image}
                        alt={String(name)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-1 text-xl">
                      {String(name)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(item.data)
                        .slice(0, 3)
                        .map(([key, val]) => {
                          if (typeof val === "string" && val.length > 50)
                            return null;
                          if (
                            key.toLowerCase().includes("image") ||
                            key.toLowerCase().includes("slug")
                          )
                            return null;
                          return (
                            <Badge
                              key={key}
                              variant="secondary"
                              className="text-xs"
                            >
                              {key}: {String(val)}
                            </Badge>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}

        {!isLoading && (
          <BuilderEmptyState
            icon={Database}
            title="No Items Found"
            description="Manage your dynamic collections. Add items from the admin dashboard."
            actionLabel="Add New Item"
            actionLink={`/admin/collections/${data.collectionSlug}`}
            isEditable={isEditable}
            isEmpty={items.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
