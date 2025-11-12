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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useCreateSubCategory,
  useUpdateSubCategory,
} from "@/hooks/owner-site/admin/use-subcategory";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import {
  CreateSubCategoryRequest,
  SubCategory,
} from "@/types/owner-site/admin/product";
import { CreateSubCategorySchema } from "@/schemas/product.form";
import { ImageUploader } from "@/components/ui/image-uploader";

interface SubCategoryFormProps {
  subCategory?: SubCategory | null;
  onClose: () => void;
}

export const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  subCategory,
  onClose,
}) => {
  const isEditing = !!subCategory;
  const createSubCategoryMutation = useCreateSubCategory();
  const updateSubCategoryMutation = useUpdateSubCategory();

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.results || [];

  // Helper function to get category ID from either string or object
  const getCategoryId = React.useCallback(
    (
      category: string | { id: number } | null | undefined,
      categoriesList: typeof categories
    ): string | undefined => {
      if (!category) return undefined;
      if (typeof category === "string") {
        // If it's a string, find the category by slug and return its ID
        const foundCategory = categoriesList.find(cat => cat.slug === category);
        return foundCategory?.id.toString();
      }
      return category.id.toString();
    },
    []
  );

  // Store original values for comparison when editing
  const originalCategoryId = React.useMemo(
    () => getCategoryId(subCategory?.category, categories) || "",
    [subCategory, categories, getCategoryId]
  );

  const originalValues = React.useMemo(
    () => ({
      name: subCategory?.name || "",
      description: subCategory?.description || "",
      category: originalCategoryId,
      image: subCategory?.image || null,
    }),
    [subCategory, originalCategoryId]
  );

  const form = useForm<CreateSubCategoryRequest>({
    resolver: zodResolver(CreateSubCategorySchema),
    defaultValues: {
      name: subCategory?.name || "",
      description: subCategory?.description || "",
      category: getCategoryId(subCategory?.category, categories) || "",
      image: subCategory?.image || null,
    },
  });

  const onSubmit = async (data: CreateSubCategoryRequest) => {
    try {
      if (isEditing && subCategory) {
        // When editing, only include changed fields
        const changedFields: Partial<CreateSubCategoryRequest> = {};

        // Check if name changed
        if (data.name.trim() !== originalValues.name) {
          changedFields.name = data.name.trim();
        }

        // Check if description changed
        if (data.description.trim() !== originalValues.description) {
          changedFields.description = data.description.trim();
        }

        // Check if category changed
        if (data.category !== originalValues.category) {
          changedFields.category = data.category;
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
          if (changedFields.category) {
            formData.append("category", changedFields.category);
          }
          if (changedFields.image) {
            formData.append("image", changedFields.image);
          }

          await updateSubCategoryMutation.mutateAsync({
            slug: subCategory.slug,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
          });
        } else {
          // Use JSON if no file upload
          await updateSubCategoryMutation.mutateAsync({
            slug: subCategory.slug,
            data: changedFields,
          });
        }
      } else {
        // Creating new subcategory - send all fields
        await createSubCategoryMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      // Error handling is in the hooks
    }
  };

  const isLoading =
    createSubCategoryMutation.isPending || updateSubCategoryMutation.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Subcategory" : "Create New Subcategory"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the subcategory information."
              : "Fill in the details to create a new subcategory."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
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
                      placeholder="Enter description"
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    ? "Update Subcategory"
                    : "Create Subcategory"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
