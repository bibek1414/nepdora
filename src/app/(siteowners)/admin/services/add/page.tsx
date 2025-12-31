"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateService } from "@/hooks/owner-site/admin/use-services";
import ServicesForm from "@/components/site-owners/admin/services/services-form";
import { Button } from "@/components/ui/button";
import { CreateServicesPost } from "@/types/owner-site/admin/services";

interface ServiceFormData {
  title: string;
  description: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
  service_category?: number | null;
}

const AddServicePage = () => {
  const router = useRouter();
  const createServiceMutation = useCreateService();

  const handleCreateService = async (data: ServiceFormData) => {
    const serviceData: CreateServicesPost = {
      title: data.title,
      description: data.description,
      thumbnail_image: data.thumbnail_image,
      thumbnail_image_alt_description: data.thumbnail_image_alt_description,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      service_category: data.service_category,
    };

    createServiceMutation.mutate(
      { serviceData },
      {
        onSuccess: () => {
          toast.success("Service created successfully!");
          router.push("/admin/services");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to create service");
        },
      }
    );
  };

  const handleCancel = () => router.push("/admin/services");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button onClick={handleCancel} variant="outline">
              Back to Services
            </Button>
          </div>
        </div>
        <ServicesForm
          onSubmit={handleCreateService}
          onCancel={handleCancel}
          isLoading={createServiceMutation.isPending}
        />
      </div>
    </div>
  );
};

export default AddServicePage;
