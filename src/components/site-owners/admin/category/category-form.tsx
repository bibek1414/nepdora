"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-category";
import { CreateCategoryRequest, Category } from "@/types/owner-site/product";
import { CreateCategorySchema } from "@/schemas/product.form";
import { ImageUploader } from "@/components/ui/image-uploader";

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onClose,
}) => {
  const isEditing = !!category;
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const form = useForm<CreateCategoryRequest>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || null,
    },
  });

  const onSubmit = async (data: CreateCategoryRequest) => {
    try {
      console.log("Submitting data:", data); // Debug log

      // Check if we have a file upload
      const hasFileUpload = data.image instanceof File;

      if (hasFileUpload) {
        // Use FormData if there's a file upload
        const formData = new FormData();

        // Ensure fields are properly set before appending
        if (data.name && data.name.trim()) {
          formData.append("name", data.name.trim());
        }
        if (data.description && data.description.trim()) {
          formData.append("description", data.description.trim());
        }
        if (data.image) {
          formData.append("image", data.image);
        }

        // Debug: Log FormData contents
        console.log("FormData contents:");
        for (const pair of formData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        if (isEditing && category) {
          await updateCategoryMutation.mutateAsync({
            slug: category.slug,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any, // Type assertion for FormData
          });
        } else {
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          await createCategoryMutation.mutateAsync(formData as any);
        }
      } else {
        // Use JSON if no file upload
        if (isEditing && category) {
          await updateCategoryMutation.mutateAsync({
            slug: category.slug,
            data,
          });
        } else {
          await createCategoryMutation.mutateAsync(data);
        }
      }

      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is done in the hooks
    }
  };

  const isLoading =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category information below."
              : "Fill in the details to create a new category."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      className="resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
