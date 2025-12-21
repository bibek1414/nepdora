"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useBlog, useUpdateBlog } from "@/hooks/owner-site/admin/use-blogs";
import BlogForm from "@/components/site-owners/admin/blogs/blog-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateBlogPost } from "@/types/owner-site/admin/blog";

interface BlogFormData {
  title: string;
  content: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
  tag_ids?: number[];
}

const EditBlogPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug =
    (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const { data: blog, isLoading: isLoadingBlog, error } = useBlog(slug);
  const updateBlogMutation = useUpdateBlog();

  const handleUpdateBlog = async (data: BlogFormData) => {
    if (!blog) return;

    const blogData: Omit<UpdateBlogPost, "id"> = {
      title: data.title,
      content: data.content,
      tag_ids: data.tag_ids,
      thumbnail_image: data.thumbnail_image,
      thumbnail_image_alt_description: data.thumbnail_image_alt_description,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    };

    updateBlogMutation.mutate(
      {
        slug: blog.slug,
        blogData,
      },
      {
        onSuccess: () => {
          toast.success("Blog updated successfully!");
          router.push("/admin/blogs");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update blog");
        },
      }
    );
  };

  const handleCancel = () => router.push("/admin/blogs");

  const renderContent = () => {
    if (isLoadingBlog) {
      return (
        <div className="space-y-8 rounded-lg bg-white p-0">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      );
    }

    if (error || !blog) {
      return (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <h2 className="text-lg font-bold text-[#003d79]">Blog Not Found</h2>
          <p className="mt-2 text-sm text-black/40">
            {error?.message ||
              "The blog post you're looking for doesn't exist."}
          </p>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="mt-6 font-medium text-black/60"
          >
            Back to Blogs
          </Button>
        </div>
      );
    }

    return (
      <BlogForm
        blog={blog}
        onSubmit={handleUpdateBlog}
        onCancel={handleCancel}
        isLoading={updateBlogMutation.isPending}
      />
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-4xl px-6 md:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#003d79]">Edit Blog</h1>
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="text-black/60 hover:bg-black/5 hover:text-black"
            >
              Back to Blogs
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default EditBlogPage;
