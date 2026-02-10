"use client";
import React from "react";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { ServicesCard6 } from "../services-card/services-card6";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Briefcase } from "lucide-react";
import { ServicesComponentData } from "@/types/owner-site/components/services";

interface ServicesStyleProps {
  component: ServicesComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ServicesComponentData) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesStyle6: React.FC<ServicesStyleProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onServiceClick,
}) => {
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

  return (
    <div className="relative">
      {isLoading && (
        <div className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="mb-12 flex flex-col items-end justify-between md:flex-row">
              <div className="mb-4 md:mb-0">
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-12 w-64" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-64 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Services</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load services."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoading && !error && services.length > 0 && (
        <div className="relative">
          {isEditable && (
            <div className="absolute inset-0 z-10 bg-transparent" />
          )}
          <ServicesCard6
            component={component}
            services={services.slice(0, pageSize)}
            isEditable={isEditable}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={onUpdate}
            onServiceClick={onServiceClick}
          />
        </div>
      )}

      {!isLoading && !error && services.length === 0 && (
        <div className="bg-muted/50 rounded-lg py-12 text-center">
          <Briefcase className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            No Services Found
          </h3>
          <p className="text-muted-foreground">
            Add some services to your site to display them here.
          </p>
        </div>
      )}
    </div>
  );
};
