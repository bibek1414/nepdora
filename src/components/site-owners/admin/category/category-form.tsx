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
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/owner-site/admin/use-category";
import {
  CreateCategoryRequest,
  Category,
} from "@/types/owner-site/admin/product";
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

  // Store original values for comparison when editing
  const originalValues = React.useMemo(
    () => ({
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || null,
    }),
    [category]
  );

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
      if (isEditing && category) {
        // When editing, only include changed fields
        const changedFields: Partial<CreateCategoryRequest> = {};

        // Check if name changed
        if (data.name.trim() !== originalValues.name) {
          changedFields.name = data.name.trim();
        }

        // Check if description changed
        if (data.description.trim() !== originalValues.description) {
          changedFields.description = data.description.trim();
        }

        // Check if image changed
        // Image changed if:
        // 1. It's a new File (user uploaded a new image)
        // 2. It's null but original had an image (image was removed)
        // 3. It's a different string URL (shouldn't happen in normal flow, but handle it)
        const isNewFile = data.image instanceof File;
        const isRemoved = data.image === null && originalValues.image !== null;
        const isDifferentUrl =
          typeof data.image === "string" &&
          typeof originalValues.image === "string" &&
          data.image !== originalValues.image;

        if (isNewFile) {
          changedFields.image = data.image;
        } else if (isRemoved) {
          // Image was removed
          changedFields.image = null;
        } else if (isDifferentUrl) {
          // URL changed (edge case)
          changedFields.image = data.image;
        }

        // Only proceed if there are changes
        if (Object.keys(changedFields).length === 0) {
          onClose();
          return;
        }

        // Check if we have a file upload
        const hasFileUpload = changedFields.image instanceof File;

        if (hasFileUpload) {
          // Use FormData if there's a file upload
          const formData = new FormData();

          if (changedFields.name) {
            formData.append("name", changedFields.name);
          }
          if (changedFields.description) {
            formData.append("description", changedFields.description);
          }
          if (changedFields.image) {
            formData.append("image", changedFields.image);
          }

          await updateCategoryMutation.mutateAsync({
            slug: category.slug,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
          });
        } else {
          // Use JSON if no file upload
          await updateCategoryMutation.mutateAsync({
            slug: category.slug,
            data: changedFields,
          });
        }
      } else {
        // Creating new category - send all fields
        const hasFileUpload = data.image instanceof File;

        if (hasFileUpload) {
          const formData = new FormData();
          if (data.name && data.name.trim()) {
            formData.append("name", data.name.trim());
          }
          if (data.description && data.description.trim()) {
            formData.append("description", data.description.trim());
          }
          if (data.image) {
            formData.append("image", data.image);
          }
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          await createCategoryMutation.mutateAsync(formData as any);
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
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
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
