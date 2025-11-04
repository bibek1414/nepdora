"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  usePortfolio,
  useUpdatePortfolio,
} from "@/hooks/owner-site/admin/use-portfolio";
import PortfolioForm from "@/components/site-owners/admin/portfolio/portfolio-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdatePortfolio } from "@/types/owner-site/admin/portfolio";

interface PortfolioFormData {
  title: string;
  content: string;
  category: number;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: number[];
  project_url?: string;
  github_url?: string;
}

const EditPortfolioPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug =
    (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const {
    data: portfolio,
    isLoading: isLoadingPortfolio,
    error,
  } = usePortfolio(slug);
  const updatePortfolioMutation = useUpdatePortfolio();

  const handleUpdatePortfolio = async (data: PortfolioFormData) => {
    if (!portfolio) return;

    const portfolioData: Omit<UpdatePortfolio, "id"> = {
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags,
      thumbnail_image: data.thumbnail_image,
      thumbnail_image_alt_description: data.thumbnail_image_alt_description,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      project_url: data.project_url,
      github_url: data.github_url,
    };

    updatePortfolioMutation.mutate(
      {
        slug: portfolio.slug,
        portfolioData,
      },
      {
        onSuccess: () => {
          toast.success("Portfolio updated successfully!");
          router.push("/admin/portfolio");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update portfolio");
        },
      }
    );
  };

  const handleCancel = () => router.push("/admin/portfolio");

  const renderContent = () => {
    if (isLoadingPortfolio) {
      return (
        <div className="mx-auto max-w-4xl space-y-8 rounded-lg bg-white p-6">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    if (error || !portfolio) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Portfolio Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            {error?.message ||
              "The portfolio item you're looking for doesn't exist."}
          </p>
        </div>
      );
    }

    return (
      <PortfolioForm
        portfolio={portfolio}
        onSubmit={handleUpdatePortfolio}
        onCancel={handleCancel}
        isLoading={updatePortfolioMutation.isPending}
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
                Back to Portfolios
              </Button>
            </div>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default EditPortfolioPage;
