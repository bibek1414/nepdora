"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  useService,
  useUpdateService,
} from "@/hooks/owner-site/admin/use-services";
import ServicesForm from "@/components/site-owners/admin/services/services-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateServicesPost } from "@/types/owner-site/admin/services";

interface ServiceFormData {
  title: string;
  description: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
}

const EditServicePage = () => {
  const router = useRouter();
  const params = useParams();
  const slug =
    (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const {
    data: service,
    isLoading: isLoadingService,
    error,
  } = useService(slug);
  const updateServiceMutation = useUpdateService();

  const handleUpdateService = async (data: ServiceFormData) => {
    if (!service) return;

    const serviceData: Omit<UpdateServicesPost, "id"> = {
      title: data.title,
      description: data.description,
      thumbnail_image: data.thumbnail_image,
      thumbnail_image_alt_description: data.thumbnail_image_alt_description,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    };

    updateServiceMutation.mutate(
      {
        slug: service.slug,
        serviceData,
      },
      {
        onSuccess: () => {
          toast.success("Service updated successfully!");
          router.push("/admin/services");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update service");
        },
      }
    );
  };

  const handleCancel = () => router.push("/admin/services");

  const renderContent = () => {
    if (isLoadingService) {
      return (
        <div className="mx-auto max-w-4xl space-y-8 rounded-lg bg-white p-6">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    if (error || !service) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Service Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            {error?.message || "The service you're looking for doesn't exist."}
          </p>
        </div>
      );
    }

    return (
      <ServicesForm
        service={service}
        onSubmit={handleUpdateService}
        onCancel={handleCancel}
        isLoading={updateServiceMutation.isPending}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Button onClick={handleCancel} variant="outline">
                Back to Services
              </Button>
            </div>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default EditServicePage;
