"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateBlog } from "@/hooks/owner-site/admin/use-blogs";
import BlogForm from "@/components/site-owners/admin/blogs/blog-form";
import { Button } from "@/components/ui/button";
import { CreateBlogPost } from "@/types/owner-site/admin/blog";

interface BlogFormData extends Omit<CreateBlogPost, "thumbnail_image"> {
  thumbnail_image?: FileList;
}

const AddBlogPage = () => {
  const router = useRouter();
  const createBlogMutation = useCreateBlog();

  const handleCreateBlog = async (data: BlogFormData) => {
    const blogData: CreateBlogPost = {
      ...data,
      thumbnail_image: data.thumbnail_image?.[0] || null,
    };

    createBlogMutation.mutate(
      { blogData },
      {
        onSuccess: () => {
          toast.success("Blog created successfully!");
          router.push("/admin/blogs");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to create blog");
        },
      }
    );
  };

  const handleCancel = () => router.push("/admin/blogs");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button onClick={handleCancel} variant="outline">
              Back to Blogs
            </Button>
          </div>
        </div>
        <BlogForm
          onSubmit={handleCreateBlog}
          onCancel={handleCancel}
          isLoading={createBlogMutation.isPending}
        />
      </div>
    </div>
  );
};

export default AddBlogPage;
