"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
} from "@/hooks/owner-site/admin/use-product";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { CreateProductSchema, STATUS_CHOICES } from "@/schemas/product.form";
import { ImageUploader } from "@/components/ui/image-uploader";
import type {
  Product,
  CreateProductRequest,
} from "@/types/owner-site/admin/product";
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
  FileText,
  Truck,
} from "lucide-react";
import ReusableQuill from "@/components/ui/tip-tap";
import InventoryVariants from "./inventory-varient";

interface ProductFormProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: any | null;
  onClose?: () => void;
}

interface OptionValue {
  id: string;
  value: string;
}

interface ProductOption {
  id: string;
  name: string;
  values: OptionValue[];
}

interface Variant {
  id: string;
  options: Record<string, string>;
  price: string;
  stock: number;
  image: File | string | null;
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [trackStock, setTrackStock] = useState<boolean>(
    product?.track_stock ?? true
  );
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [productStock, setProductStock] = useState<number>(product?.stock ?? 0);

  const isEditing = !!product;
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const { data: categoriesData } = useCategories();
  const { data: subCategoriesData } = useSubCategories({
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
      stock: product?.stock ?? 0,
      thumbnail_image: null,
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      image_files: product?.images?.map((img: any) => img.image) || [],
      thumbnail_alt_description: product?.thumbnail_alt_description || "",
      category_id: product?.category?.id?.toString() || "",
      sub_category_id: product?.sub_category?.id?.toString() || "",
      track_stock: product?.track_stock ?? false,
      is_popular: product?.is_popular ?? false,
      is_featured: product?.is_featured ?? false,
      fast_shipping: product?.fast_shipping ?? false,
      warranty: product?.warranty || "",
      weight: product?.weight || "",
      status: product?.status || "active",
      meta_title: product?.meta_title || "",
      meta_description: product?.meta_description || "",
    },
  });

  useEffect(() => {
    if (product?.category?.id) {
      setSelectedCategory(product.category.id.toString());
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      if (product.options && product.options.length > 0) {
        const mappedOptions: ProductOption[] = product.options.map(
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          (opt: any) => ({
            id: opt.id.toString(),
            name: opt.name,
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            values: opt.values.map((val: any) => ({
              id: val.id.toString(),
              value: val.value,
            })),
          })
        );
        setOptions(mappedOptions);
      }

      if (product.variants_read && product.variants_read.length > 0) {
        const mappedVariants: Variant[] = product.variants_read.map(
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          (variant: any) => ({
            id: variant.id.toString(),
            options: variant.option_values || {},
            price: variant.price || "0.00",
            stock: variant.stock || 0,
            image: variant.image,
          })
        );
        setVariants(mappedVariants);
      }
    }
  }, [product]);

  const handleTrackStockChange = (value: boolean) => {
    setTrackStock(value);

    if (!value && variants.length > 0) {
      // When turning off track stock, set all variants to use the product stock
      const updatedVariants = variants.map(v => ({
        ...v,
        stock: productStock,
      }));
      setVariants(updatedVariants);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    form.setValue("sub_category_id", "");
  };

  const onSubmit = async (data: z.infer<typeof CreateProductSchema>) => {
    try {
      const transformedOptions = options.map(opt => ({
        name: opt.name,
        values: opt.values.map(v => v.value),
      }));

      // Determine stock values based on trackStock setting
      const stockValue = trackStock ? undefined : productStock;
      const transformedVariants = variants.map(v => {
        const variantStock = trackStock ? v.stock : stockValue;
        return {
          price: v.price || undefined,
          stock: variantStock ?? 0,
          image: v.image instanceof File ? v.image : undefined,
          options: v.options,
        };
      });

      const productData: CreateProductRequest = {
        ...data,
        track_stock: trackStock,
        market_price: data.market_price || undefined,
        thumbnail_alt_description: data.thumbnail_alt_description || undefined,
        category_id: data.category_id || undefined,
        sub_category_id: data.sub_category_id || undefined,
        thumbnail_image:
          data.thumbnail_image instanceof File
            ? data.thumbnail_image
            : undefined,
        image_files: data.image_files || [],
        options: transformedOptions.length > 0 ? transformedOptions : undefined,
        variants:
          transformedVariants.length > 0 ? transformedVariants : undefined,
        // NEW FIELDS
        fast_shipping: data.fast_shipping,
        warranty: data.warranty || undefined,
        weight: data.weight || undefined,
        status: data.status,
        meta_title: data.meta_title || undefined,
        meta_description: data.meta_description || undefined,
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
      <Card className="border-0">
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
                          <ReusableQuill
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Write your product description here..."
                            height="250px"
                            toolbar="advanced"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Product Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATUS_CHOICES.map(status => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
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

              {/* Pricing */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-2">
                  <DollarSign className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-semibold">Pricing</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                </div>
              </div>

              {/* Shipping & Product Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-2">
                  <Truck className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-semibold">Shipping & Details</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Weight
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 500g, 1.2kg"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Product weight for shipping calculation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="warranty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Warranty
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 1 year, 6 months"
                            maxLength={20}
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Warranty information (max 20 chars)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="fast_shipping"
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
                          Fast Shipping Available
                        </FormLabel>
                        <FormDescription>
                          This product qualifies for fast shipping
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Inventory & Variants */}
              <InventoryVariants
                trackStock={trackStock}
                onTrackStockChange={handleTrackStockChange}
                variants={variants}
                onVariantsChange={setVariants}
                options={options}
                onOptionsChange={setOptions}
                isEditing={isEditing}
                productStock={productStock}
                onProductStockChange={setProductStock}
              />

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

              {/* SEO Settings */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-2">
                  <FileText className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-semibold">SEO Settings</h3>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Meta Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SEO optimized title for search engines"
                            maxLength={255}
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Recommended: 50-60 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Meta Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="SEO optimized description for search engines"
                            rows={4}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Recommended: 150-160 characters
                        </FormDescription>
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
