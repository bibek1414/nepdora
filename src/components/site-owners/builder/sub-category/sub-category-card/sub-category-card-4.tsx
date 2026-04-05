"use client";
import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { Category, SubCategory } from "@/types/owner-site/admin/product";
import { SubCategoryData } from "@/types/owner-site/components/sub-category";

import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

interface SubCategoryCard4Props {
  isEditable?: boolean;
  siteUser?: string;
  initialFeaturedContent?: SubCategoryData["featuredContent"];
  onFeaturedContentUpdate?: (updatedData: Partial<NonNullable<SubCategoryData["featuredContent"]>>) => void;
}

export const SubCategoryCard4: React.FC<SubCategoryCard4Props> = ({
  isEditable = false,
  siteUser,
  initialFeaturedContent,
  onFeaturedContentUpdate,
}) => {
  const pathname = usePathname();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: subCategoriesData, isLoading: subCategoriesLoading } = useSubCategories();
  const { data: themeResponse } = useThemeQuery();

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

  const defaultFeaturedContent = {
    title: "Discover Amazing Products",
    subtitle: "Premium Quality & Best Prices",
    description: "Explore our wide range of products and find exactly what you're looking for.",
    buttonText: "Shop now",
    buttonHref: "/products",
    backgroundImages: [
      "https://images.pexels.com/photos/36710456/pexels-photo-36710456.png",
      "https://images.pexels.com/photos/36251125/pexels-photo-36251125.jpeg",
      "https://images.pexels.com/photos/7135033/pexels-photo-7135033.jpeg",
    ],
    currentImageIndex: 0,
  };

  const {
    data: featuredContent,
    setData: setFeaturedContent,
    handleTextUpdate,
    getImageUrl,
  } = useBuilderLogic(
    { ...defaultFeaturedContent, ...initialFeaturedContent },
    onFeaturedContentUpdate as any
  );

  const categories: Category[] = categoriesData?.results || [];
  const subCategories: SubCategory[] = subCategoriesData?.results || [];

  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [activeMobileCategoryId, setActiveMobileCategoryId] = useState<number | null>(null);

  const componentId = React.useId();

  useEffect(() => {
    if (!isEditable && featuredContent.backgroundImages && featuredContent.backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setFeaturedContent(prev => ({
          ...prev,
          currentImageIndex:
            ((prev.currentImageIndex || 0) + 1) % (prev.backgroundImages?.length || 1),
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isEditable, featuredContent.backgroundImages?.length, setFeaturedContent]);

  const getSubCategoriesForCategory = (categoryId: number): SubCategory[] => {
    return subCategories.filter(subCat => {
      if (typeof subCat.category === "object" && subCat.category) {
        return subCat.category.id === categoryId;
      }
      return parseInt(subCat.category as string) === categoryId;
    });
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
    const updatedImages = [...(featuredContent.backgroundImages || [])];
    updatedImages[featuredContent.currentImageIndex || 0] = imageUrl;

    const updatedContent = {
      ...featuredContent,
      backgroundImages: updatedImages,
    };
    setFeaturedContent(updatedContent);
    onFeaturedContentUpdate?.(updatedContent);
  };

  const addBackgroundImage = () => {
    const newImageUrl = "https://images.pexels.com/photos/36710456/pexels-photo-36710456.png";
    const updatedContent = {
      ...featuredContent,
      backgroundImages: [...(featuredContent.backgroundImages || []), newImageUrl],
    };
    setFeaturedContent(updatedContent);
    onFeaturedContentUpdate?.(updatedContent);
  };

  const removeBackgroundImage = (index: number) => {
    if (!featuredContent.backgroundImages || featuredContent.backgroundImages.length <= 1) return;

    const updatedImages = featuredContent.backgroundImages.filter((_, i) => i !== index);
    const newCurrentIndex =
      (featuredContent.currentImageIndex || 0) >= updatedImages.length
        ? updatedImages.length - 1
        : (featuredContent.currentImageIndex || 0);

    const updatedContent = {
      ...featuredContent,
      backgroundImages: updatedImages,
      currentImageIndex: newCurrentIndex,
    };
    setFeaturedContent(updatedContent);
    onFeaturedContentUpdate?.(updatedContent);
  };

  const nextImage = () => {
    setFeaturedContent(prev => {
      const nextIndex =
        ((prev.currentImageIndex || 0) + 1) % (prev.backgroundImages?.length || 1);
      const updatedContent = { ...prev, currentImageIndex: nextIndex };
      onFeaturedContentUpdate?.(updatedContent);
      return updatedContent;
    });
  };

  const prevImage = () => {
    setFeaturedContent(prev => {
      const len = prev.backgroundImages?.length || 1;
      const nextIndex =
        (prev.currentImageIndex || 0) === 0
          ? len - 1
          : (prev.currentImageIndex || 0) - 1;
      const updatedContent = { ...prev, currentImageIndex: nextIndex };
      onFeaturedContentUpdate?.(updatedContent);
      return updatedContent;
    });
  };

  const setImageIndex = (index: number) => {
    const updatedContent = { ...featuredContent, currentImageIndex: index };
    setFeaturedContent(updatedContent);
    onFeaturedContentUpdate?.(updatedContent);
  };

  const getCategoryUrl = (category: Category): string => {
    return generateLinkHref(`/collections?category=${category.slug}`, siteUser, pathname);
  };

  const getSubCategoryUrl = (subcategory: SubCategory, category: Category): string => {
    return generateLinkHref(
      `/collections?category=${category.slug}&sub_category=${subcategory.slug}`,
      siteUser,
      pathname
    );
  };

  if (categoriesLoading || subCategoriesLoading) {
    return <div className="min-h-[400px] flex items-center justify-center">Loading...</div>;
  }

  const currentBackgroundImage = featuredContent.backgroundImages?.[featuredContent.currentImageIndex || 0];

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-7xl flex-col md:flex-row" style={{ fontFamily: theme.fonts.body }}>
      {/* Mobile Categories */}
      <div className="border-b border-gray-200 bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-base font-semibold text-gray-800">Categories</h2>
          <button onClick={() => setIsMobileCategoriesOpen(prev => !prev)} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            {isMobileCategoriesOpen ? "Hide" : "Show"}
            <ChevronDown className={`h-4 w-4 transition-transform ${isMobileCategoriesOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
        {isMobileCategoriesOpen && (
          <div className="max-h-88 overflow-y-auto px-4 pb-4">
            <div className="space-y-3">
              {categories.map(category => {
                const categorySubcategories = getSubCategoriesForCategory(category.id);
                const isActive = activeMobileCategoryId === category.id;
                return (
                  <div key={`mobile-cat-${category.id}`} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <button onClick={() => setActiveMobileCategoryId(prev => prev === category.id ? null : category.id)} className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left">
                      <div className="flex flex-1 items-center gap-3">
                        <img src={getImageUrl(category.image || "/fallback/image-not-found.png", { width: 64 })} alt={category.name} className="h-9 w-9 rounded object-cover" />
                        <span className="text-sm font-medium text-gray-800">{category.name}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isActive ? "rotate-180" : ""}`} />
                    </button>
                    {categorySubcategories.length > 0 && isActive && (
                      <div className="border-t border-gray-100 px-3 py-2">
                        <div className="space-y-2">
                          {categorySubcategories.map(sub => (
                            <button key={`mobile-sub-${sub.id}`} onClick={() => !isEditable && (window.location.href = getSubCategoryUrl(sub, category))} className="w-full rounded-md bg-gray-50 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100">
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
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="relative z-20 hidden w-full flex-col border-b border-gray-200 bg-white md:flex md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <div className="p-4 space-y-2">
          {categories.map(category => {
            const categorySubcategories = getSubCategoriesForCategory(category.id);
            return (
              <div key={`cat-${category.id}`} className="group relative">
                <button
                  onMouseEnter={() => !isEditable && categorySubcategories.length > 0 && setHoveredCategory(category)}
                  onClick={() => !isEditable && (window.location.href = getCategoryUrl(category))}
                  className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-all duration-200 text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <img src={getImageUrl(category.image || "/fallback/image-not-found.png", { width: 64 })} alt={category.name} className="h-8 w-8 rounded object-cover" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  {!isEditable && categorySubcategories.length > 0 && <ChevronRight className="h-4 w-4" />}
                </button>
                {!isEditable && hoveredCategory?.id === category.id && categorySubcategories.length > 0 && (
                  <div className="absolute top-0 left-full z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-lg" onMouseEnter={() => setHoveredCategory(category)} onMouseLeave={() => setHoveredCategory(null)} style={{ marginLeft: "4px" }}>
                    <div className="p-2">
                      {categorySubcategories.map(sub => (
                        <button key={`sub-${sub.id}`} onClick={() => (window.location.href = getSubCategoryUrl(sub, category))} className="w-full rounded px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800">
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
      </div>

      {/* Slider Content */}
      <div className="flex flex-1 flex-col">
        <div className="group relative flex min-h-[420px] flex-1 items-center sm:min-h-[460px] md:min-h-[500px]" style={{
          background: currentBackgroundImage ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${getImageUrl(currentBackgroundImage, { width: 1200 })})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"
        }}>
          {isEditable && (
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:top-6 sm:right-6">
              <ImageEditOverlay onImageSelect={handleBackgroundImageUpdate} imageWidth={1200} imageHeight={600} isEditable={isEditable} label="Change Background" folder="featured-backgrounds" className="relative" />
              <div className="flex gap-2">
                <button onClick={addBackgroundImage} className="rounded-full bg-gray-800/80 px-4 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition hover:bg-gray-700">Add Slide</button>
                {(featuredContent.backgroundImages?.length || 0) > 1 && (
                  <button onClick={() => removeBackgroundImage(featuredContent.currentImageIndex || 0)} className="rounded-full bg-red-600/80 px-4 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition hover:bg-red-700">Remove</button>
                )}
              </div>
            </div>
          )}

          <div className="container mx-auto px-4 py-12 sm:px-6 md:px-8 md:py-0 text-white">
            <EditableText value={featuredContent.subtitle || ""} onChange={handleTextUpdate("subtitle")} placeholder="Enter subtitle..." className="mb-3 text-sm font-medium opacity-90 sm:mb-4 sm:text-base md:text-lg" isEditable={isEditable} as="p" />
            <EditableText value={featuredContent.title || ""} onChange={handleTextUpdate("title")} placeholder="Enter title..." className="mb-4 text-4xl leading-tight font-bold sm:mb-6 sm:text-5xl md:text-6xl" isEditable={isEditable} as="h1" />
            <EditableText value={featuredContent.description || ""} onChange={handleTextUpdate("description")} placeholder="Enter description..." className="mb-6 text-base leading-relaxed opacity-90 sm:mb-8 sm:text-lg md:text-xl" isEditable={isEditable} as="p" multiline={true} />
            <EditableLink text={featuredContent.buttonText || ""} href={featuredContent.buttonHref || ""} onChange={handleButtonUpdate} isEditable={isEditable} siteUser={siteUser} className="inline-flex transform items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-105" style={{ backgroundColor: theme.colors.primary }} />
          </div>

          {(featuredContent.backgroundImages?.length || 0) > 1 && (
            <>
              <button onClick={prevImage} className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"><ChevronRight className="h-5 w-5 rotate-180" /></button>
              <button onClick={nextImage} className="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"><ChevronRight className="h-5 w-5" /></button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
