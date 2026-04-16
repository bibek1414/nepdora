"use client";
import React from "react";
import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CountriesData } from "@/types/owner-site/components/countries";
import { EditableText } from "@/components/ui/editable-text";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";

interface CountriesStyle1Props {
  data: CountriesData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (data: Partial<CountriesData>) => void;
}

export const CountriesStyle1: React.FC<CountriesStyle1Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const { data: countriesResponse, isLoading , refetch } = useCollectionData(
    "countries",
    {
      page_size: data.itemsToShow?.toString() || "12",
    }
  );

  const countries = countriesResponse?.results || [];

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center md:mb-16">
          <EditableText
            value={data.title}
            onChange={(val: string) => onUpdate?.({ title: val })}
            as="h2"
            isEditable={isEditable}
          />
          <EditableText
            value={data.subtitle}
            onChange={(val: string) => onUpdate?.({ subtitle: val })}
            as="p"
            isEditable={isEditable}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))
          ) : countries.length > 0 ? (
            countries.map((country: any, index: number) => {
              const baseRoute = isEditable
                ? "/country-details-draft"
                : "/country-details";
              return (
                <Link
                  key={country.id}
                  href={`${baseRoute}/${country.data.slug}`}
                  onClick={e => isEditable && e.preventDefault()}
                  className={`block ${
                    index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                  }`}
                >
                  <Card className="border-border/50 bg-card h-full overflow-hidden rounded-2xl p-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <CardContent className="relative h-full p-0">
                      <div
                        className={`relative w-full overflow-hidden ${
                          index === 0 ? "h-80 lg:h-full" : "h-64 md:h-80"
                        }`}
                      >
                        {country.data.Image ? (
                          <Image
                            src={country.data.Image}
                            alt={`Study in ${country.data.name}`}
                            fill
                            className="object-cover transition-transform duration-1000 hover:scale-105"
                          />
                        ) : (
                          <div className="bg-muted flex h-full w-full items-center justify-center">
                            <span className="text-muted-foreground">
                              No Image
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 hover:opacity-80" />
                      </div>

                      <div className="absolute right-0 bottom-0 left-0 p-6 text-white md:p-8">
                        <div className="flex items-end justify-between gap-4">
                          <div className="flex-1">
                            <h3
                              className={`mb-2 font-semibold tracking-tight ${
                                index === 0
                                  ? "text-2xl md:text-4xl"
                                  : "text-xl md:text-2xl"
                              }`}
                            >
                              Study in {country.data.name}
                            </h3>
                            <p className="mb-0 line-clamp-2 text-sm font-medium text-white/90 transition-all duration-500 md:text-base">
                              {country.data.tagline || country.data.content}
                            </p>
                          </div>
                          <div className="bg-primary/20 hover:bg-primary hover:border-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-500 hover:rotate-45">
                            <ArrowUpRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (!isLoading && countries.length === 0) && (
            <div className="col-span-full">
              <BuilderEmptyState
                icon={Globe}
                title="No Countries Found"
                description="Showcase study destinations to your students. Add countries to your collection in the admin dashboard."
                actionLabel="Add New Country"
                actionLink="/admin/collections"
                isEditable={isEditable}
                isEmpty={countries.length === 0}
              onRefresh={refetch}
          />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
