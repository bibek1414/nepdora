"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreatePortfolio } from "@/hooks/owner-site/admin/use-portfolio";
import PortfolioForm from "@/components/site-owners/admin/portfolio/portfolio-form";
import { Button } from "@/components/ui/button";
import { CreatePortfolio } from "@/types/owner-site/admin/portfolio";

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

const AddPortfolioPage = () => {
  const router = useRouter();
  const createPortfolioMutation = useCreatePortfolio();

  const handleCreatePortfolio = async (data: PortfolioFormData) => {
    const portfolioData: CreatePortfolio = {
      title: data.title,
      content: data.content,
      category: data.category,
      thumbnail_image: data.thumbnail_image,
      thumbnail_image_alt_description: data.thumbnail_image_alt_description,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      tags: data.tags,
      project_url: data.project_url,
      github_url: data.github_url,
    };

    createPortfolioMutation.mutate(
      { portfolioData },
      {
        onSuccess: () => {
          toast.success("Portfolio created successfully!");
          router.push("/admin/portfolio");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to create portfolio");
        },
      }
    );
  };

  const handleCancel = () => router.push("/admin/portfolio");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button onClick={handleCancel} variant="outline">
              Back to Portfolios
            </Button>
          </div>
        </div>
        <PortfolioForm
          onSubmit={handleCreatePortfolio}
          onCancel={handleCancel}
          isLoading={createPortfolioMutation.isPending}
        />
      </div>
    </div>
  );
};

export default AddPortfolioPage;
