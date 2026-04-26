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
import { X } from "lucide-react";
import Tiptap from "@/components/ui/tip-tap";
import InventoryVariants from "./inventory-varient";
import { Switch } from "@/components/ui/switch";
import type { PreviewProductData } from "./product-preview-detail";
import { CategoryForm } from "@/components/site-owners/admin/category/category-form";
import { SubCategoryForm } from "@/components/site-owners/admin/sub-category/sub-category-form";
import { usePricingMetrics } from "@/hooks/owner-site/admin/use-pricing-metric";
import { PlusCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductFormRefApi {
  getPreviewProduct: () => PreviewProductData;
}

interface ProductFormProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: any | null;
  onClose?: () => void;
  onLoadingChange?: (loading: boolean) => void;
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
  image: File | Blob | string | null;
}

// Component for individual thumbnail selector
const ThumbnailSelector: React.FC<{
  image: File | string;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
  altDescription?: string;
  onAltDescriptionChange?: (value: string) => void;
  disabled?: boolean;
}> = ({
  image,
  index,
  isSelected,
  onSelect,
  onRemove,
  altDescription,
  onAltDescriptionChange,
  disabled = false,
}) => {
  const [imageUrl, setImageUrl] = React.useState<string>(
    typeof image === "string" ? image : URL.createObjectURL(image)
  );

  React.useEffect(() => {
    if (typeof image === "string") {
      setImageUrl(image);
    } else {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  return (
    <div className="group relative space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-xs font-medium">Main Image</FormLabel>
        <Switch
          checked={isSelected}
          onCheckedChange={checked => {
            if (checked) {
              onSelect(index);
            }
          }}
          disabled={disabled}
        />
      </div>
      <div
        className={`relative aspect-square rounded-lg border transition-all ${
          isSelected ? "border-primary ring-primary/20 ring-2" : "border-border"
        }`}
      >
        <div className="h-full w-full overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={`Product image ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
        {!disabled && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(index)}
            className="absolute -top-1.5 -right-1.5 z-100 h-6 w-6 rounded-full p-0 opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100 hover:scale-110"
            aria-label={`Remove image ${index + 1}`}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Input
        placeholder="Alt description of image"
        value={isSelected ? altDescription || "" : ""}
        onChange={e => {
          if (isSelected && onAltDescriptionChange) {
            onAltDescriptionChange(e.target.value);
          }
        }}
        disabled={!isSelected || disabled}
        className="h-9"
      />
    </div>
  );
};

const ProductForm = React.forwardRef<ProductFormRefApi, ProductFormProps>(
  ({ product, onClose, onLoadingChange }: ProductFormProps, ref) => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null
    );
    const [trackStock, setTrackStock] = useState<boolean>(
      product?.track_stock ?? true
    );
    const [options, setOptions] = useState<ProductOption[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [productStock, setProductStock] = useState<number>(
      product?.stock ?? 0
    );
    const [useDynamicPricing, setUseDynamicPricing] = useState<boolean>(
      product?.use_dynamic_pricing ?? false
    );
    const [compositions, setCompositions] = useState<
      { metric: number; quantity: string | number }[]
    >(product?.compositions || []);
    const { data: metricsData } = usePricingMetrics();
    const metrics = metricsData?.results || [];
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    // Initialize thumbnail index from product if editing
    const getInitialThumbnailIndex = (): number | null => {
      if (!product) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imageFiles = product?.images?.map((img: any) => img.image) || [];
      if (imageFiles.length === 0) return null;
      if (product.thumbnail_image) {
        const index = imageFiles.findIndex(
          (img: string) => img === product.thumbnail_image
        );
        return index >= 0 ? index : 0;
      }
      return 0;
    };

    const [thumbnailImageIndex, setThumbnailImageIndex] = useState<
      number | null
    >(getInitialThumbnailIndex());

    const isEditing = !!product;
    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProduct();

    const { data: categoriesData } = useCategories();
    const { data: subCategoriesData } = useSubCategories({
      category: selectedCategory ? parseInt(selectedCategory) : undefined,
    });

    const categories = categoriesData?.results || [];
    const subCategories = subCategoriesData?.results || [];

    // Initialize thumbnail image from product if editing
    const initialImageFiles =
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      product?.images?.map((img: any) => img.image) || [];
    const initialThumbnailImage =
      product?.thumbnail_image && initialImageFiles.length > 0
        ? initialImageFiles.find(
            (img: string) => img === product.thumbnail_image
          ) ||
          initialImageFiles[0] ||
          null
        : initialImageFiles.length > 0
          ? initialImageFiles[0]
          : null;

    const form = useForm<any>({
      resolver: zodResolver(CreateProductSchema),
      defaultValues: {
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price?.toString() || "0.00",
        market_price: product?.market_price?.toString() || "",
        stock: product?.stock ?? 0,
        thumbnail_image: initialThumbnailImage,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        image_files: initialImageFiles,
        thumbnail_alt_description: product?.thumbnail_alt_description || "",
        category_id: product?.category?.id?.toString() || "",
        sub_category_id: product?.sub_category?.id?.toString() || "",
        track_stock: product?.track_stock ?? true,
        is_popular: product?.is_popular ?? false,
        is_featured: product?.is_featured ?? false,
        fast_shipping: product?.fast_shipping ?? false,
        warranty: product?.warranty || "",
        weight: product?.weight || "",
        status: product?.status || "active",
        meta_title: product?.meta_title || "",
        meta_description: product?.meta_description || "",
        use_dynamic_pricing: product?.use_dynamic_pricing ?? false,
        base_making_charge: product?.base_making_charge?.toString() || "0.00",
        compositions: product?.compositions || [],
      },
    });

    useEffect(() => {
      if (product?.category?.id) {
        setSelectedCategory(product.category.id.toString());
      }
    }, [product]);

    // Set thumbnail index when images change
    const imageFiles = form.watch("image_files") || [];

    useEffect(() => {
      if (imageFiles.length === 0) {
        if (thumbnailImageIndex !== null) {
          setThumbnailImageIndex(null);
          form.setValue("thumbnail_image", null, { shouldDirty: false });
        }
        return;
      }

      // If no thumbnail is selected or selected index is out of bounds
      if (
        thumbnailImageIndex === null ||
        thumbnailImageIndex >= imageFiles.length
      ) {
        // Set first image as thumbnail by default
        setThumbnailImageIndex(0);
        form.setValue("thumbnail_image", imageFiles[0] as File | string, {
          shouldDirty: false,
        });
      } else if (imageFiles[thumbnailImageIndex]) {
        // Update thumbnail reference when images array changes but index is still valid
        form.setValue(
          "thumbnail_image",
          imageFiles[thumbnailImageIndex] as File | string,
          { shouldDirty: false }
        );
      }
    }, [imageFiles, thumbnailImageIndex, form]);

    // Ensure form values update when `product` loads/changes in edit mode
    useEffect(() => {
      if (!product) return;

      const imageFiles =
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (product.images || []).map((img: any) => img.image) || [];
      const thumbnailImage = product.thumbnail_image || null;

      // Find thumbnail index in images array
      let initialThumbnailIndex: number | null = null;
      if (thumbnailImage && imageFiles.length > 0) {
        const index = imageFiles.findIndex(
          (img: string) => img === thumbnailImage
        );
        initialThumbnailIndex = index >= 0 ? index : 0;
      } else if (imageFiles.length > 0) {
        initialThumbnailIndex = 0;
      }

      form.reset({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "0.00",
        market_price: product.market_price?.toString() || "",
        stock: product.stock ?? 0,
        thumbnail_image:
          initialThumbnailIndex !== null
            ? imageFiles[initialThumbnailIndex]
            : null,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        image_files: imageFiles,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        thumbnail_alt_description: product.thumbnail_alt_description || "",
        category_id: product.category?.id?.toString() || "",
        sub_category_id: product.sub_category?.id?.toString() || "",
        track_stock: product.track_stock ?? true,
        is_popular: product.is_popular ?? false,
        is_featured: product.is_featured ?? false,
        fast_shipping: product.fast_shipping ?? false,
        warranty: product.warranty || "",
        weight: product.weight || "",
        status: product.status || "active",
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
        use_dynamic_pricing: product.use_dynamic_pricing ?? false,
        base_making_charge: product.base_making_charge?.toString() || "0.00",
        compositions: product.compositions || [],
      });

      setTrackStock(product.track_stock ?? true);
      setProductStock(product.stock ?? 0);
      setUseDynamicPricing(product.use_dynamic_pricing ?? false);
      setCompositions(product.compositions || []);
      setSelectedCategory(
        product.category?.id ? product.category.id.toString() : null
      );
      setThumbnailImageIndex(initialThumbnailIndex);
    }, [product, form]);

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

    // Keep RHF form value in sync with single-stock UI state
    useEffect(() => {
      form.setValue("stock", productStock ?? 0, { shouldDirty: true });
    }, [productStock, form]);

    const onSubmit = async (data: z.infer<typeof CreateProductSchema>) => {
      try {
        const transformedOptions = options.map(opt => ({
          name: opt.name,
          values: opt.values.map(v => v.value),
        }));

        const stockValue = trackStock ? undefined : productStock;
        const transformedVariants = variants.map(v => {
          const variantStock = trackStock ? v.stock : stockValue;

          const variantData: {
            price?: string;
            stock: number;
            image?: File | string | null;
            options: Record<string, string>;
          } = {
            price: v.price || undefined,
            stock: variantStock ?? 0,
            options: v.options,
          };

          if (v.image instanceof File || v.image instanceof Blob) {
            variantData.image = v.image as any;
          } else if (typeof v.image === "string" && v.image.trim()) {
            variantData.image = v.image;
          } else if (v.image === null) {
            variantData.image = null;
          }

          return variantData;
        });

        const productData: CreateProductRequest = {
          ...data,
          price: useDynamicPricing ? "0" : data.price,
          market_price: useDynamicPricing ? "0" : data.market_price || null,
          use_dynamic_pricing: useDynamicPricing,
          compositions: useDynamicPricing ? data.compositions : [],
          base_making_charge: data.base_making_charge || "0.00",
          track_stock: trackStock,
          thumbnail_alt_description: data.thumbnail_alt_description || null,
          category_id: data.category_id || null,
          sub_category_id: data.sub_category_id || null,
          thumbnail_image:
            data.thumbnail_image instanceof Blob
              ? (data.thumbnail_image as any)
              : typeof data.thumbnail_image === "string"
                ? data.thumbnail_image
                : null,
          image_files: data.image_files || [],
          options:
            transformedOptions.length > 0 ? transformedOptions : undefined,
          variants:
            transformedVariants.length > 0 ? transformedVariants : undefined,
          fast_shipping: data.fast_shipping,
          warranty: data.warranty || null,
          weight: data.weight || null,
          status: data.status,
          meta_title: data.meta_title || null,
          meta_description: data.meta_description || null,
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
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while saving the product.");
        }
      }
    };

    const isLoading =
      createProductMutation.isPending ||
      updateProductMutation.isPending ||
      imageLoading;

    useEffect(() => {
      if (onLoadingChange) {
        onLoadingChange(isLoading);
      }
    }, [isLoading, onLoadingChange]);

    // Expose preview data to parent via ref
    React.useImperativeHandle(ref, () => ({
      getPreviewProduct: () => {
        const values = form.getValues();
        const category = categories.find(
          c => c.id?.toString() === values.category_id
        );
        const subCategory = subCategories.find(
          s => s.id?.toString() === values.sub_category_id
        );

        const imageToUrl = (img: unknown): string | undefined => {
          if (!img) return undefined;
          if (typeof img === "string") return img;
          try {
            return URL.createObjectURL(img as File);
          } catch {
            return undefined;
          }
        };

        const preview: PreviewProductData = {
          id: "preview",
          name: values.name,
          description: values.description ?? undefined,
          price: values.price || "0.00",
          market_price: values.market_price ?? null,
          stock: trackStock ? (values.stock ?? 0) : (productStock ?? 0),
          thumbnail_image: values.thumbnail_image ?? null,
          thumbnail_alt_description: values.thumbnail_alt_description ?? "",
          images: (values.image_files || []).map((img: unknown) =>
            typeof img === "string" ? img : { image: img as File }
          ),
          category: category
            ? {
                id: category.id,
                name: category.name,
                slug: category.slug ?? undefined,
              }
            : undefined,
          sub_category: subCategory
            ? {
                id: subCategory.id,
                name: subCategory.name,
                slug: subCategory.slug ?? undefined,
              }
            : undefined,
          is_featured: values.is_featured,
          is_popular: values.is_popular,
          variants_read:
            variants.length > 0
              ? variants.map(v => ({
                  id: v.id,
                  option_values: v.options,
                  price: v.price,
                  stock: v.stock,
                  image: v.image,
                }))
              : undefined,
          options:
            options.length > 0
              ? options.map(o => ({
                  id: o.id,
                  name: o.name,
                  values: o.values.map(v => ({ id: v.id, value: v.value })),
                }))
              : undefined,
        };

        // Prime object URLs for thumbnail so preview can render quickly
        imageToUrl(preview.thumbnail_image);
        (preview.images || []).forEach((img: unknown) => {
          if (typeof img === "string") return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          imageToUrl((img as any).image);
        });

        return preview;
      },
    }));

    return (
      <>
        <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-10">
          <Card className="border-0 bg-gray-50">
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  id="product-form"
                  onSubmit={form.handleSubmit(onSubmit, errors => {
                    console.error("Validation errors:", errors);
                    toast.error(
                      "Please check the form for errors. Some fields may be invalid."
                    );
                  })}
                  className="space-y-6"
                >
                  {/* Two Column Layout - 70/30 split */}
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
                    {/* Left Column - Main Content (70%) */}
                    <div className="space-y-8">
                      {/* Product name & Description */}
                      <div className="space-y-4 rounded-2xl border bg-white p-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium">
                                Product name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter product name"
                                  {...field}
                                  className="h-10 rounded-xl"
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
                              <FormLabel className="text-xs font-medium">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Tiptap
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  placeholder="Write your product description here..."
                                  height="260px"
                                  toolbar="advanced"
                                  uploadFolder="products"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Dynamic Pricing Toggle */}
                      <div className="space-y-3 rounded-2xl border bg-white p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-semibold">
                              Use Dynamic Pricing
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Toggle this to use metric-based pricing (Gold,
                              Silver, etc.)
                            </FormDescription>
                          </div>
                          <Switch
                            checked={useDynamicPricing}
                            onCheckedChange={checked => {
                              setUseDynamicPricing(checked);
                              form.setValue("use_dynamic_pricing", checked, {
                                shouldDirty: true,
                              });
                            }}
                          />
                        </div>

                        {useDynamicPricing && (
                          <div className="mt-4 space-y-4">
                            <FormField
                              control={form.control}
                              name="base_making_charge"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium">
                                    Base Making Charge
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      placeholder="0.00"
                                      {...field}
                                      className="h-10 rounded-xl"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="space-y-2">
                              <FormLabel className="text-xs font-medium">
                                Compositions
                              </FormLabel>
                              {compositions.map((comp, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Select
                                    value={comp.metric.toString()}
                                    onValueChange={val => {
                                      const newComps = [...compositions];
                                      newComps[index].metric = parseInt(val);
                                      setCompositions(newComps);
                                      form.setValue("compositions", newComps, {
                                        shouldDirty: true,
                                      });
                                    }}
                                  >
                                    <SelectTrigger className="h-10 flex-1 rounded-xl">
                                      <SelectValue placeholder="Select Metric" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {metrics.map(m => (
                                        <SelectItem
                                          key={m.id}
                                          value={m.id.toString()}
                                        >
                                          {m.name} ({m.unit})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    className="h-10 w-24 rounded-xl placeholder:text-gray-400"
                                    placeholder="Qty"
                                    value={comp.quantity}
                                    onChange={e => {
                                      const newComps = [...compositions];
                                      newComps[index].quantity = e.target.value;
                                      setCompositions(newComps);
                                      form.setValue("compositions", newComps, {
                                        shouldDirty: true,
                                      });
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const newComps = compositions.filter(
                                        (_, i) => i !== index
                                      );
                                      setCompositions(newComps);
                                      form.setValue("compositions", newComps, {
                                        shouldDirty: true,
                                      });
                                    }}
                                  >
                                    <MinusCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2 text-xs"
                                onClick={() => {
                                  const newComps = [
                                    ...compositions,
                                    {
                                      metric: metrics[0]?.id || 0,
                                      quantity: 0,
                                    },
                                  ];
                                  setCompositions(newComps);
                                  form.setValue("compositions", newComps, {
                                    shouldDirty: true,
                                  });
                                }}
                              >
                                <PlusCircle className="mr-1 h-3 w-3" />
                                Add Composition
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      <div
                        className={cn(
                          "space-y-3 rounded-2xl border bg-white p-4",
                          useDynamicPricing && "pointer-events-none opacity-50"
                        )}
                      >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium">
                                  Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder=""
                                    {...field}
                                    value={
                                      useDynamicPricing
                                        ? "0"
                                        : (field.value ?? "")
                                    }
                                    disabled={useDynamicPricing}
                                    className="h-10 rounded-xl"
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
                                <FormLabel className="text-xs font-medium">
                                  Market Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder=""
                                    {...field}
                                    value={
                                      useDynamicPricing
                                        ? "0"
                                        : (field.value ?? "")
                                    }
                                    disabled={useDynamicPricing}
                                    className="h-10 rounded-xl"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-3 rounded-2xl border bg-white p-4">
                        <h3 className="text-base font-semibold">Images</h3>
                        <FormField
                          control={form.control}
                          name="image_files"
                          render={({ field }) => {
                            const imageFiles = field.value || [];
                            return (
                              <FormItem>
                                <FormControl>
                                  <ImageUploader
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isLoading}
                                    multiple={true}
                                    maxFiles={8}
                                    hidePreview={true}
                                    onLoadingChange={setImageLoading}
                                  />
                                </FormControl>
                                <FormMessage />

                                {/* Thumbnail Selection UI */}
                                {imageFiles.length > 0 && (
                                  <div className="mt-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                      {imageFiles.map(
                                        (img: File | string, index: number) => (
                                          <ThumbnailSelector
                                            key={index}
                                            image={img}
                                            index={index}
                                            isSelected={
                                              thumbnailImageIndex === index
                                            }
                                            onSelect={idx => {
                                              setThumbnailImageIndex(idx);
                                              form.setValue(
                                                "thumbnail_image",
                                                imageFiles[idx] as
                                                  | File
                                                  | string,
                                                { shouldDirty: true }
                                              );
                                            }}
                                            onRemove={idx => {
                                              const newImages =
                                                imageFiles.filter(
                                                  (
                                                    _: File | string,
                                                    i: number
                                                  ) => i !== idx
                                                );
                                              field.onChange(newImages);

                                              // Adjust thumbnail index if needed
                                              if (
                                                thumbnailImageIndex === idx &&
                                                newImages.length > 0
                                              ) {
                                                // If removed image was thumbnail, set first image as thumbnail
                                                setThumbnailImageIndex(0);
                                                form.setValue(
                                                  "thumbnail_image",
                                                  newImages[0] as File | string,
                                                  { shouldDirty: true }
                                                );
                                              } else if (
                                                thumbnailImageIndex !== null &&
                                                thumbnailImageIndex > idx
                                              ) {
                                                // If removed image was before thumbnail, decrement index
                                                setThumbnailImageIndex(
                                                  thumbnailImageIndex - 1
                                                );
                                                form.setValue(
                                                  "thumbnail_image",
                                                  newImages[
                                                    thumbnailImageIndex - 1
                                                  ] as File | string,
                                                  { shouldDirty: true }
                                                );
                                              } else if (
                                                newImages.length === 0
                                              ) {
                                                // No images left
                                                setThumbnailImageIndex(null);
                                                form.setValue(
                                                  "thumbnail_image",
                                                  null,
                                                  { shouldDirty: true }
                                                );
                                              }
                                            }}
                                            altDescription={
                                              thumbnailImageIndex === index
                                                ? (form.watch(
                                                    "thumbnail_alt_description"
                                                  ) ?? "")
                                                : undefined
                                            }
                                            onAltDescriptionChange={
                                              thumbnailImageIndex === index
                                                ? value => {
                                                    form.setValue(
                                                      "thumbnail_alt_description",
                                                      value,
                                                      { shouldDirty: true }
                                                    );
                                                  }
                                                : undefined
                                            }
                                            disabled={isLoading}
                                          />
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </FormItem>
                            );
                          }}
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

                      {/* SEO Settings */}
                      <div className="space-y-3 rounded-2xl border bg-white p-4">
                        <h3 className="text-base font-semibold">
                          SEO Settings
                        </h3>
                        <FormField
                          control={form.control}
                          name="meta_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={`text-xs font-medium ${
                                  (field.value?.length || 0) > 60
                                    ? "text-red-500"
                                    : ""
                                }`}
                              >
                                Meta Title ({field.value?.length || 0}/60)
                              </FormLabel>

                              <FormControl>
                                <Input
                                  placeholder=""
                                  {...field}
                                  value={field.value ?? ""}
                                  className="h-10 rounded-xl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="meta_description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={`text-xs font-medium ${
                                  (field.value?.length || 0) > 160
                                    ? "text-red-500"
                                    : ""
                                }`}
                              >
                                Meta Description ({field.value?.length || 0}
                                /160)
                              </FormLabel>

                              <FormControl>
                                <Textarea
                                  placeholder=""
                                  rows={4}
                                  className="h-28 resize-none rounded-xl"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Right Column - Sidebar (30%) - FIXED STICKY */}
                    <div className="w-full space-y-3 lg:sticky lg:top-36 lg:max-h-[calc(100vh-7rem)] lg:w-[20rem] lg:self-start lg:overflow-y-auto lg:pb-6">
                      {/* Status */}
                      <div className="mx-auto space-y-2 rounded-2xl border bg-white p-3 lg:w-[18rem]">
                        <h3 className="text-base font-semibold">Status</h3>
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-9 min-w-[16rem] text-sm shadow-none">
                                    {field.value ? (
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`h-2 w-2 rounded-full ${
                                            field.value === "active"
                                              ? "bg-green-500"
                                              : "bg-gray-400"
                                          }`}
                                        />
                                        <span className="capitalize">
                                          {field.value}
                                        </span>
                                      </div>
                                    ) : (
                                      <SelectValue placeholder="Select status" />
                                    )}
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="min-w-[16rem] shadow-none">
                                  {STATUS_CHOICES.map(status => (
                                    <SelectItem key={status} value={status}>
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`h-2 w-2 rounded-full ${
                                            status === "active"
                                              ? "bg-green-500"
                                              : "bg-gray-400"
                                          }`}
                                        />
                                        {status.charAt(0).toUpperCase() +
                                          status.slice(1)}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Product Category */}
                      <div className="mx-auto space-y-2 rounded-2xl border bg-white p-3 lg:w-[18rem]">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold">
                            Product Category
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsCategoryFormOpen(true)}
                          >
                            Add New
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name="category_id"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={value => {
                                  field.onChange(value);
                                  handleCategoryChange(value);
                                }}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-9 min-w-[16rem] text-sm shadow-none">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="min-w-[16rem] shadow-none">
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
                      </div>

                      {/* Product Sub Category */}
                      <div className="mx-auto space-y-2 rounded-2xl border bg-white p-3 lg:w-[18rem]">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold">
                            Product Sub Category
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsSubCategoryFormOpen(true)}
                          >
                            Add New
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name="sub_category_id"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-9 min-w-[16rem] text-sm shadow-none">
                                    <SelectValue placeholder="Select subcategory" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="min-w-[16rem] shadow-none">
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

                      {/* Visibility Toggles */}
                      <div className="mx-auto rounded-2xl border bg-white p-3 lg:w-[18rem]">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="is_featured"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel className="text-xs font-medium">
                                  Featured
                                </FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="is_popular"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel className="text-xs font-medium">
                                  Popular
                                </FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        {isCategoryFormOpen && (
          <CategoryForm
            category={null}
            onClose={() => {
              setIsCategoryFormOpen(false);
            }}
          />
        )}
        {isSubCategoryFormOpen && (
          <SubCategoryForm
            subCategory={null}
            onClose={() => {
              setIsSubCategoryFormOpen(false);
            }}
          />
        )}
      </>
    );
  }
);

ProductForm.displayName = "ProductForm";

export { ProductForm };
