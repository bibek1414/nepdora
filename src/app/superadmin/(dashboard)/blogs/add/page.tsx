"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateSuperAdminBlog } from "@/hooks/super-admin/use-blogs";
import BlogForm from "@/components/super-admin/blogs/blog-form";
import { Button } from "@/components/ui/button";
import { CreateBlogPost } from "@/types/super-admin/blog";

interface BlogFormData {
  title: string;
  content: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
  category_id?: number | null;
  tag_ids?: number[];
  time_to_read?: string;
}

const AddBlogPage = () => {
  const router = useRouter();
  const createBlogMutation = useCreateSuperAdminBlog();

  const handleCreateBlog = async (data: BlogFormData) => {
    const blogData: CreateBlogPost = {
      title: data.title,
      content: data.content,
      thumbnail_image: data.thumbnail_image,
      thumbnail_image_alt_description: data.thumbnail_image_alt_description,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      category_id: data.category_id,
      tag_ids: data.tag_ids,
      time_to_read: data.time_to_read,
    };

    createBlogMutation.mutate(
      { blogData },
      {
        onSuccess: () => {
          toast.success("Blog created successfully!");
          router.push("/superadmin/blogs");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to create blog");
        },
      }
    );
  };

  const handleCancel = () => router.push("/superadmin/blogs");

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#003d79]">Add New Blog</h1>
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="text-black/60 hover:bg-black/5 hover:text-black"
            >
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
