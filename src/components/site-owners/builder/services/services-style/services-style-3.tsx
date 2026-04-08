"use client";

import React from "react";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Briefcase } from "lucide-react";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { ServicesCard3 } from "../services-card/services-card3";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface ServicesStyleProps {
  component: ServicesComponentData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ServicesComponentData["data"]>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesStyle3: React.FC<ServicesStyleProps> = ({
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
            {error instanceof Error
              ? error.message
              : "Failed to load services."}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && services.length > 0 && (
        <div className="relative">
          <ServicesCard3
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
        <BuilderEmptyState
          icon={Briefcase}
          title="No Services Available"
          description="List your services to attract clients. Add services from the admin dashboard."
          actionLabel="Manage Services"
          actionLink="/admin/services"
          isEditable={isEditable}
        />
      )}
    </div>
  );
};
