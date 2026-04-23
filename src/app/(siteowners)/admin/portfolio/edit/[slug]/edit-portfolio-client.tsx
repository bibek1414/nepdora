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
  thumbnail_image?: File | Blob | null;
  images?: (File | Blob | string)[];
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: number[];
  project_url?: string;
  github_url?: string;
}

export default function EditPortfolioClient() {
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

    const portfolioData: Partial<Omit<UpdatePortfolio, "id">> = {};

    const normalize = (val: string | null | undefined) =>
      val === "" ? null : (val ?? null);

    if (data.title !== portfolio.title) portfolioData.title = data.title;
    if (data.content !== portfolio.content)
      portfolioData.content = data.content;
    if (data.category !== portfolio.category?.id)
      portfolioData.category = data.category;

    const currentTagIds = portfolio.tags.map(t => t.id).sort();
    const newTagIds = (data.tags || []).slice().sort();
    if (JSON.stringify(currentTagIds) !== JSON.stringify(newTagIds)) {
      portfolioData.tags = data.tags;
    }

    if (
      data.thumbnail_image instanceof File ||
      data.thumbnail_image instanceof Blob
    ) {
      portfolioData.thumbnail_image = data.thumbnail_image;
    } else if (
      data.thumbnail_image === null &&
      portfolio.thumbnail_image !== null
    ) {
      portfolioData.thumbnail_image = null;
    }

    if (data.images) {
      // Comparison of images is a bit more complex.
      // For now, if images are present in form data, we'll send the whole array.
      // This matches the pattern in other components like product-form.
      portfolioData.images = data.images;
    }

    if (
      normalize(data.thumbnail_image_alt_description) !==
      normalize(portfolio.thumbnail_image_alt_description)
    ) {
      portfolioData.thumbnail_image_alt_description =
        data.thumbnail_image_alt_description;
    }
    if (normalize(data.meta_title) !== normalize(portfolio.meta_title)) {
      portfolioData.meta_title = data.meta_title;
    }
    if (
      normalize(data.meta_description) !== normalize(portfolio.meta_description)
    ) {
      portfolioData.meta_description = data.meta_description;
    }
    if (normalize(data.project_url) !== normalize(portfolio.project_url)) {
      portfolioData.project_url = data.project_url;
    }
    if (normalize(data.github_url) !== normalize(portfolio.github_url)) {
      portfolioData.github_url = data.github_url;
    }

    if (Object.keys(portfolioData).length === 0) {
      toast.info("No changes to update.");
      return;
    }

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
}
