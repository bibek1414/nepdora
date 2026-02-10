"use client";
import React from "react";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { ServicesCard4 } from "../services-card/services-card4";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Briefcase } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { ServicesComponentData } from "@/types/owner-site/components/services";

interface ServicesStyleProps {
  data: ServicesComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ServicesComponentData["data"]>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesStyle4: React.FC<ServicesStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onServiceClick,
}) => {
  const { title = "Latest Services", subtitle } = data || {};
  const pageSize = 6;
  const {
    data: servicesData,
    isLoading,
    error,
  } = useServices({
    page: 1,
    page_size: pageSize,
  });
  const services = servicesData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-4 text-4xl font-bold tracking-tight"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground mx-auto max-w-3xl text-xl"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Services</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load services."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, pageSize).map((service, index) => (
              <div
                key={service.id}
                className="relative transform cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => !isEditable && onServiceClick?.(service.slug)}
              >
                {isEditable && (
                  <div className="absolute inset-0 z-10 bg-transparent" />
                )}
                <ServicesCard4
                  services={service}
                  siteUser={isEditable ? undefined : siteUser}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && services.length === 0 && (
          <div className="py-16 text-center">
            <Briefcase className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Services Available
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              We&apos;re currently working on new services. Please check back
              soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
