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
} from "@/hooks/owner-site/use-subcategory";
import { useCategories } from "@/hooks/owner-site/use-category";
import {
  CreateSubCategoryRequest,
  SubCategory,
} from "@/types/owner-site/product";
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

  const { data: categoriesData } = useCategories({ limit: 100 });
  const categories = categoriesData?.results || [];

  // Helper function to get category slug from either string or object
  const getCategorySlug = (
    category: string | { slug: string } | null | undefined
  ): string | undefined => {
    if (!category) return undefined;
    if (typeof category === "string") return category;
    return category.slug;
  };

  const form = useForm<CreateSubCategoryRequest>({
    resolver: zodResolver(CreateSubCategorySchema),
    defaultValues: {
      name: subCategory?.name || "",
      description: subCategory?.description || "",
      category: getCategorySlug(subCategory?.category) || "",
      image: subCategory?.image || null,
    },
  });

  const onSubmit = async (data: CreateSubCategoryRequest) => {
    try {
      if (isEditing && subCategory) {
        await updateSubCategoryMutation.mutateAsync({
          slug: subCategory.slug,
          data,
        });
      } else {
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
      <DialogContent className="sm:max-w-[425px]">
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
                        <SelectItem key={category.id} value={category.slug}>
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
