"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-product";
import { useCategories } from "@/hooks/use-category";
import { useSubCategories } from "@/hooks/use-subcategory";
import { CreateProductSchema } from "@/schemas/product.form";
import { ImageUploader } from "@/components/ui/image-uploader";
import type { Product, CreateProductRequest } from "@/types/owner-site/product";
import { z } from "zod";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isEditing = !!product;
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  // Fetch categories and subcategories
  const { data: categoriesData } = useCategories({ limit: 100 });
  const { data: subCategoriesData } = useSubCategories({
    limit: 100,
    category: selectedCategory ? parseInt(selectedCategory) : undefined,
  });

  const categories = categoriesData?.results || [];
  const subCategories = subCategoriesData?.results || [];
  const form = useForm<z.infer<typeof CreateProductSchema>>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "0.00",
      market_price: product?.market_price || "",
      stock: product?.stock || 0,
      thumbnail_image: null,
      thumbnail_alt_description: product?.thumbnail_alt_description || "",
      category: product?.category?.id?.toString() || "",
      sub_category: product?.sub_category?.id?.toString() || "",
      is_popular: Boolean(product?.is_popular),
      is_featured: Boolean(product?.is_featured),
    },
  });

  // Set initial category selection
  useEffect(() => {
    if (product?.category?.id) {
      setSelectedCategory(product.category.id.toString());
    }
  }, [product]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    form.setValue("sub_category", "");
  };

  const onSubmit = async (data: z.infer<typeof CreateProductSchema>) => {
    try {
      // Prepare the data object that matches the expected type
      const productData: CreateProductRequest = {
        name: data.name,
        description: data.description || "",
        price: data.price,
        stock: data.stock,
        is_popular: data.is_popular,
        is_featured: data.is_featured,
        market_price: data.market_price || undefined,
        thumbnail_alt_description: data.thumbnail_alt_description || undefined,
        category: data.category || undefined,
        sub_category: data.sub_category || undefined,
        thumbnail_image:
          data.thumbnail_image instanceof File
            ? data.thumbnail_image
            : undefined,
      };

      if (isEditing && product) {
        // Check if slug exists
        if (!product.slug) {
          throw new Error("Product slug is required for updating");
        }
        await updateProductMutation.mutateAsync({
          slug: product.slug,
          data: productData,
        });
      } else {
        await createProductMutation.mutateAsync(productData);
      }

      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const isLoading =
    createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the product information below."
              : "Fill in the details to create a new product."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (NPR) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="market_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Price (NPR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stock */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={e =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Subcategory */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={value => {
                        field.onChange(value);
                        handleCategoryChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                name="sub_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategories.map(subCategory => (
                          <SelectItem
                            key={subCategory.id}
                            value={subCategory.id.toString()}
                          >
                            {subCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thumbnail Image */}
            <FormField
              control={form.control}
              name="thumbnail_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={
                        field.value ||
                        (isEditing ? product?.thumbnail_image : null)
                      }
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alt Description */}
            <FormField
              control={form.control}
              name="thumbnail_alt_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Alt Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe the image for accessibility"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Checkboxes */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Product</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_popular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Popular Product</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
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
                    ? "Update Product"
                    : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { ProductForm };
