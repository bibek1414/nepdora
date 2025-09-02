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
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/owner-site/use-product";
import { useCategories } from "@/hooks/owner-site/use-category";
import { useSubCategories } from "@/hooks/owner-site/use-subcategory";
import { CreateProductSchema } from "@/schemas/product.form";
import { ImageUploader } from "@/components/ui/image-uploader";
import type { Product, CreateProductRequest } from "@/types/owner-site/product";
import { z } from "zod";
import { toast } from "sonner";
import {
  Save,
  X,
  Package,
  DollarSign,
  Image,
  Settings,
  Tag,
} from "lucide-react";

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
    <div className="mx-auto max-w-5xl">
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-2">
                  <Package className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Product Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product name"
                            className="h-11"
                            {...field}
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
                        <FormLabel className="text-sm font-medium">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter product description"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-2">
                  <DollarSign className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-semibold">Pricing & Stock</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Price (NPR) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="h-11"
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
                        <FormLabel className="text-sm font-medium">
                          Market Price (NPR)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="h-11"
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
                        <FormLabel className="text-sm font-medium">
                          Stock Quantity *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="h-11"
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
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-2">
                  <Tag className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-semibold">Categories</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Category
                        </FormLabel>
                        <Select
                          onValueChange={value => {
                            field.onChange(value);
                            handleCategoryChange(value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
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
                        <FormLabel className="text-sm font-medium">
                          Subcategory
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
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
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-2">
                  <Image className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-semibold">Images</h3>
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="thumbnail_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Thumbnail Image
                        </FormLabel>
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
                        <FormLabel className="text-sm font-medium">
                          Additional Images
                        </FormLabel>
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
                        <FormLabel className="text-sm font-medium">
                          Image Alt Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe the image for accessibility"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Product Settings */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-2">
                  <Settings className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-semibold">Product Settings</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="bg-card flex flex-row items-start space-y-0 space-x-3 rounded-lg border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 rounded-full"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Featured Product
                          </FormLabel>
                          <p className="text-muted-foreground text-xs">
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
                      <FormItem className="bg-card flex flex-row items-start space-y-0 space-x-3 rounded-lg border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 rounded-full"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Popular Product
                          </FormLabel>
                          <p className="text-muted-foreground text-xs">
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
                  className="h-11 flex-1 bg-gray-600 p-2 hover:bg-gray-600/80 sm:flex-none sm:px-4"
                  size="lg"
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
                  className="h-11 flex-1 sm:flex-none"
                  size="lg"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export { ProductForm };
