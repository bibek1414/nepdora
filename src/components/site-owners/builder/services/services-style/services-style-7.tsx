"use client";

import React from "react";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Briefcase } from "lucide-react";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { ServicesCard7 } from "../services-card/services-card7";

interface ServicesStyleProps {
  component: ServicesComponentData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ServicesComponentData["data"]>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesStyle7: React.FC<ServicesStyleProps> = ({
  component,
  isEditable = false,
  siteUser,
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
        <div className="flex h-[700px] w-full flex-col items-stretch gap-4 px-4 py-20 md:h-[650px] md:flex-row md:px-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-[40px] md:rounded-[60px]"
            />
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Services</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load services."}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && services.length > 0 && (
        <div className="relative">

          <ServicesCard7
            component={component}
            services={services}
            isEditable={isEditable}
            siteUser={siteUser}
            onUpdate={onUpdate}
            onServiceClick={onServiceClick}
          />
        </div>
      )}

      {!isLoading && !error && services.length === 0 && (
        <div className="py-16 text-center">
          <Briefcase className="mx-auto mb-6 h-20 w-20 opacity-50 text-gray-400" />
          <h3 className="mb-4 text-2xl font-semibold">No Services Available</h3>
          <p className="mx-auto max-w-md text-lg opacity-70">
            We&apos;re currently working on new services. Please check back soon.
          </p>
        </div>
      )}
    </div>
  );
};
