"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import { Save, X } from "lucide-react";

interface ProductFormProps {
  product?: Product | null;
  onClose?: () => void; // Optional for backward compatibility
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const router = useRouter();
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
      image_files: product?.images?.map(img => img.image) || [],
      thumbnail_alt_description: product?.thumbnail_alt_description || "",
      category_id: product?.category?.id?.toString() || "",
      sub_category_id: product?.sub_category?.id?.toString() || "",
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
    form.setValue("sub_category_id", "");
  };

  const onSubmit = async (data: z.infer<typeof CreateProductSchema>) => {
    try {
      const productData: CreateProductRequest = {
        ...data,
        market_price: data.market_price || undefined,
        thumbnail_alt_description: data.thumbnail_alt_description || undefined,
        category_id: data.category_id || undefined,
        sub_category_id: data.sub_category_id || undefined,
        thumbnail_image:
          data.thumbnail_image instanceof File
            ? data.thumbnail_image
            : undefined,
        image_files: data.image_files || [],
      };

      if (isEditing && product) {
        if (!product.slug) {
          throw new Error("Product slug is required for updating");
        }
        await updateProductMutation.mutateAsync({
          slug: product.slug,
          data: productData,
        });
        toast.success("Product updated successfully!");
      } else {
        await createProductMutation.mutateAsync(productData);
        toast.success("Product created successfully!");
      }

      form.reset();
      if (onClose) {
        onClose();
      } else {
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(
        isEditing ? "Failed to update product" : "Failed to create product"
      );
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/admin/products");
    }
  };

  const isLoading =
    createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Product" : "Create New Product"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the product information below."
            : "Fill in the details to create a new product."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

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
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing & Stock</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Categories</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category_id"
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
                  name="sub_category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Images</h3>

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

              <FormField
                control={form.control}
                name="image_files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Images</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        multiple={true}
                        maxFiles={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            {/* Product Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Settings</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Product</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          Display this product in featured sections
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_popular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Popular Product</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          Mark this product as popular
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Product"
                    : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { ProductForm };
