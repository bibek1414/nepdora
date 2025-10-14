import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Loader2,
  Plus,
} from "lucide-react";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/publish/editable-link";
import { Category, SubCategory } from "@/types/owner-site/admin/product";
import { FeaturedContent } from "@/types/owner-site/components/category";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";

interface CategoryCard4Props {
  isEditable?: boolean;
  siteUser?: string;
  initialFeaturedContent?: FeaturedContent;
  onFeaturedContentUpdate?: (updatedData: Partial<FeaturedContent>) => void;
}

export const CategoryCard4: React.FC<CategoryCard4Props> = ({
  isEditable = false,
  siteUser,
  initialFeaturedContent,
  onFeaturedContentUpdate,
}) => {
  // Hooks for real data
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: subCategoriesData, isLoading: subCategoriesLoading } =
    useSubCategories();
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter, system-ui, sans-serif",
      heading: "Poppins, system-ui, sans-serif",
    },
  };

  // Extract real data
  const categories: Category[] = categoriesData?.results || [];
  const subCategories: SubCategory[] = subCategoriesData?.results || [];

  // State management
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);

  // Featured category content (editable) - Initialize all required properties
  const [featuredContent, setFeaturedContent] = useState<
    Required<FeaturedContent>
  >({
    title: initialFeaturedContent?.title || "Discover Amazing Products",
    subtitle:
      initialFeaturedContent?.subtitle || "Premium Quality & Best Prices",
    description:
      initialFeaturedContent?.description ||
      "Explore our wide range of products and find exactly what you're looking for.",
    buttonText: initialFeaturedContent?.buttonText || "Shop now",
    buttonHref: initialFeaturedContent?.buttonHref || "/products",
    backgroundImages: initialFeaturedContent?.backgroundImages || [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=800&fit=crop",
    ],
    currentImageIndex: initialFeaturedContent?.currentImageIndex || 0,
  });

  // Generate unique component ID for this instance
  const componentId = React.useId();

  // Auto-advance carousel effect - Only when not editable
  useEffect(() => {
    if (!isEditable && featuredContent.backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setFeaturedContent(prev => ({
          ...prev,
          currentImageIndex:
            (prev.currentImageIndex + 1) % prev.backgroundImages.length,
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isEditable, featuredContent.backgroundImages.length]);

  // Helper functions
  const getSubCategoriesForCategory = (categoryId: number): SubCategory[] => {
    return subCategories.filter(subCat => {
      if (typeof subCat.category === "object" && subCat.category) {
        return subCat.category.id === categoryId;
      }
      return parseInt(subCat.category as string) === categoryId;
    });
  };

  const handleContentUpdate = (field: keyof FeaturedContent, value: string) => {
    const updatedContent = {
      ...featuredContent,
      [field]: value,
    };
    setFeaturedContent(updatedContent);
    onFeaturedContentUpdate?.(updatedContent);
  };

  const handleButtonUpdate = (text: string, href: string) => {
    const updatedContent = {
      ...featuredContent,
      buttonText: text,
      buttonHref: href,
    };
    setFeaturedContent(updatedContent);
    onFeaturedContentUpdate?.(updatedContent);
  };

  const handleBackgroundImageUpdate = (imageUrl: string) => {
    const updatedImages = [...featuredContent.backgroundImages];
    updatedImages[featuredContent.currentImageIndex] = imageUrl;

    const updatedContent = {
      ...featuredContent,
      backgroundImages: updatedImages,
    };
    setFeaturedContent(updatedContent);
    onFeaturedContentUpdate?.(updatedContent);
  };

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Please select a valid image file (${allowedTypes.join(", ")})`
      );
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingBackground(true);

    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file, {
        folder: "featured-backgrounds",
        resourceType: "image",
      });

      handleBackgroundImageUpdate(imageUrl);
      toast.success("Background image uploaded successfully!");
    } catch (error) {
      console.error("Background upload failed:", error);
      toast.error("Failed to upload background image. Please try again.");
    } finally {
      setIsUploadingBackground(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const addBackgroundImage = () => {
    const newImageUrl =
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop";
    const updatedContent = {
      ...featuredContent,
      backgroundImages: [...featuredContent.backgroundImages, newImageUrl],
    };
    setFeaturedContent(updatedContent);
    onFeaturedContentUpdate?.(updatedContent);
  };

  const removeBackgroundImage = (index: number) => {
    if (featuredContent.backgroundImages.length <= 1) return;

    const updatedImages = featuredContent.backgroundImages.filter(
      (_, i) => i !== index
    );
    const newCurrentIndex =
      featuredContent.currentImageIndex >= updatedImages.length
        ? updatedImages.length - 1
        : featuredContent.currentImageIndex;

    const updatedContent = {
      ...featuredContent,
      backgroundImages: updatedImages,
      currentImageIndex: newCurrentIndex,
    };
    setFeaturedContent(updatedContent);
    onFeaturedContentUpdate?.(updatedContent);
  };

  // Fixed carousel navigation functions - don't trigger content updates
  const nextImage = () => {
    setFeaturedContent(prev => ({
      ...prev,
      currentImageIndex:
        (prev.currentImageIndex + 1) % prev.backgroundImages.length,
    }));
  };

  const prevImage = () => {
    setFeaturedContent(prev => ({
      ...prev,
      currentImageIndex:
        prev.currentImageIndex === 0
          ? prev.backgroundImages.length - 1
          : prev.currentImageIndex - 1,
    }));
  };

  const setImageIndex = (index: number) => {
    setFeaturedContent(prev => ({
      ...prev,
      currentImageIndex: index,
    }));
  };

  const getCategoryUrl = (category: Category): string => {
    if (siteUser) {
      return `/publish/${siteUser}/products?category=${category.slug}`;
    } else {
      return `/products?category=${category.slug}`;
    }
  };

  const getSubCategoryUrl = (
    subcategory: SubCategory,
    category: Category
  ): string => {
    if (siteUser) {
      return `/publish/${siteUser}/products?category=${category.slug}&sub_category=${subcategory.slug}`;
    } else {
      return `/products?category=${category.slug}&sub_category=${subcategory.slug}`;
    }
  };

  const handleCategoryClick = (category: Category) => {
    if (isEditable) return; // Don't navigate in edit mode
    window.location.href = getCategoryUrl(category);
  };

  const handleSubCategoryClick = (
    subcategory: SubCategory,
    category: Category
  ) => {
    if (isEditable) return; // Don't navigate in edit mode
    window.location.href = getSubCategoryUrl(subcategory, category);
  };

  // Loading state
  if (categoriesLoading || subCategoriesLoading) {
    return (
      <div
        className="flex min-h-screen bg-gray-50"
        style={{ fontFamily: theme.fonts.body }}
      >
        <div className="flex w-80 flex-col border-r border-gray-200 bg-white">
          <div className="p-4">
            <div className="animate-pulse">
              <div className="mb-4 h-10 rounded-lg bg-gray-200"></div>
              <div className="mb-4 h-6 rounded bg-gray-200"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={`loading-${i}`} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-gray-200"></div>
                    <div className="h-4 flex-1 rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-64 rounded bg-gray-200"></div>
            <div className="h-4 w-48 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentBackgroundImage =
    featuredContent.backgroundImages[featuredContent.currentImageIndex];

  return (
    <div
      className="mx-auto flex min-h-[80vh] max-w-7xl"
      style={{ fontFamily: theme.fonts.body }}
    >
      {/* Left Sidebar - Categories */}
      <div className="relative z-20 flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="flex-1">
          <div className="p-4">
            {categories.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p style={{ fontFamily: theme.fonts.body }}>
                  No categories available
                </p>
                {isEditable && (
                  <p
                    className="mt-2 text-sm"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    Add categories to see them here
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map(category => {
                  const categorySubcategories = getSubCategoriesForCategory(
                    category.id
                  );

                  return (
                    <div
                      key={`cat-${componentId}-${category.id}`}
                      className="group relative"
                    >
                      <button
                        onMouseEnter={() => {
                          if (!isEditable && categorySubcategories.length > 0) {
                            setHoveredCategory(category);
                          }
                        }}
                        onMouseLeave={() => {
                          // Don't clear on mouse leave - let the subcategory area handle it
                        }}
                        onClick={() => handleCategoryClick(category)}
                        className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-all duration-200 ${
                          isEditable
                            ? "text-gray-700 hover:bg-gray-50"
                            : "cursor-pointer text-gray-700 hover:bg-gray-50"
                        }`}
                        style={{
                          fontFamily: theme.fonts.body,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <img
                              key={`cat-img-${componentId}-${category.id}`}
                              src={
                                category.image ||
                                "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=32&h=32&fit=crop"
                              }
                              alt={category.name}
                              className="h-8 w-8 rounded object-cover"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=32&h=32&fit=crop";
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </div>
                        {!isEditable && categorySubcategories.length > 0 && (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {/* Subcategories Dropdown */}
                      {!isEditable &&
                        hoveredCategory?.id === category.id &&
                        categorySubcategories.length > 0 && (
                          <div
                            className="absolute top-0 left-full z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-lg"
                            onMouseEnter={() => setHoveredCategory(category)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            style={{
                              marginLeft: "4px",
                              fontFamily: theme.fonts.body,
                            }}
                          >
                            <div className="p-2">
                              {categorySubcategories.map(sub => (
                                <button
                                  key={`sub-${componentId}-${sub.id}`}
                                  onClick={() =>
                                    handleSubCategoryClick(sub, category)
                                  }
                                  className="w-full rounded px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
                                >
                                  {sub.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Content Area - Featured Section Only */}
      <div className="flex flex-1 flex-col">
        <div
          key={`featured-${componentId}-${featuredContent.currentImageIndex}`}
          className="relative flex min-h-[500px] flex-1 items-center"
          style={{
            background: currentBackgroundImage
              ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentBackgroundImage})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Background Change Button - Only visible when editable */}
          {isEditable && (
            <div className="absolute top-4 right-30 z-10 flex flex-col gap-2">
              <label
                htmlFor={`background-upload-${componentId}`}
                className={`cursor-pointer rounded bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white ${
                  isUploadingBackground ? "pointer-events-none opacity-50" : ""
                }`}
                style={{ fontFamily: theme.fonts.body }}
              >
                {isUploadingBackground ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  "Change Background"
                )}
              </label>
              <input
                id={`background-upload-${componentId}`}
                type="file"
                accept="image/*"
                onChange={handleBackgroundFileChange}
                className="hidden"
                disabled={isUploadingBackground}
              />

              <button
                onClick={addBackgroundImage}
                className="rounded bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
                disabled={isUploadingBackground}
                style={{ fontFamily: theme.fonts.body }}
              >
                Add Image
              </button>
              {featuredContent.backgroundImages.length > 1 && (
                <button
                  onClick={() =>
                    removeBackgroundImage(featuredContent.currentImageIndex)
                  }
                  className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  disabled={isUploadingBackground}
                  style={{ fontFamily: theme.fonts.body }}
                >
                  Remove
                </button>
              )}
            </div>
          )}

          {/* Background Upload Loading Overlay */}
          {isUploadingBackground && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p
                  className="text-sm font-medium"
                  style={{ fontFamily: theme.fonts.body }}
                >
                  Uploading background image...
                </p>
              </div>
            </div>
          )}

          <div className="container mx-auto px-8">
            <div className="max-w-2xl text-white">
              <EditableText
                key={`subtitle-${componentId}`}
                value={featuredContent.subtitle}
                onChange={value => handleContentUpdate("subtitle", value)}
                placeholder="Enter subtitle..."
                className="mb-4 text-lg font-medium opacity-90"
                isEditable={isEditable}
                as="p"
                style={{ fontFamily: theme.fonts.body }}
              />

              <EditableText
                key={`title-${componentId}`}
                value={featuredContent.title}
                onChange={value => handleContentUpdate("title", value)}
                placeholder="Enter main title..."
                className="mb-6 text-6xl leading-tight font-bold"
                isEditable={isEditable}
                as="h1"
                style={{ fontFamily: theme.fonts.heading }}
              />

              <EditableText
                key={`desc-${componentId}`}
                value={featuredContent.description}
                onChange={value => handleContentUpdate("description", value)}
                placeholder="Enter description..."
                className="mb-8 text-xl leading-relaxed opacity-90"
                isEditable={isEditable}
                as="p"
                multiline={true}
                style={{ fontFamily: theme.fonts.body }}
              />

              <EditableLink
                key={`cta-${componentId}`}
                text={featuredContent.buttonText}
                href={featuredContent.buttonHref}
                onChange={handleButtonUpdate}
                isEditable={isEditable}
                siteUser={siteUser}
                className="inline-flex transform items-center gap-2 rounded-lg bg-emerald-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-emerald-700"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                  fontFamily: theme.fonts.body,
                }}
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL or page slug..."
              />
            </div>
          </div>

          {/* Carousel Navigation - Only show when multiple images */}
          {featuredContent.backgroundImages.length > 1 && (
            <>
              {/* Dots Indicator */}
              <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2">
                {featuredContent.backgroundImages.map((_, index) => (
                  <button
                    key={`dot-${componentId}-${index}`}
                    onClick={() => setImageIndex(index)}
                    className={`h-1 w-30 rounded-full transition-colors ${
                      index === featuredContent.currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    disabled={isUploadingBackground}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard4;
