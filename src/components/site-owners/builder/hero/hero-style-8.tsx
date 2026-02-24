"use client";

import React, { useState } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate8Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroTemplate8Props {
  heroData: HeroTemplate8Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate8Data>) => void;
}

export const HeroTemplate8: React.FC<HeroTemplate8Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();

  // Default data - moved before useState to fix initialization order
  const defaultFeatures = [
    { id: "1", text: "Hand Knotted" },
    { id: "2", text: "Premium Quality" },
    { id: "3", text: "Authentic" },
  ];

  const defaultTrustIndicators = {
    rating: "4.9/5",
    stars: "★★★★★",
    features: ["Free Shipping", "30-Day Returns"],
    customerText: "Trusted by 1000+ customers worldwide",
  };

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#000000",
      primary: "#8B4513",
      primaryForeground: "#FFFFFF",
      secondary: "#D2691E",
      secondaryForeground: "#FFFFFF",
      background: "#FDFAF6",
      backgroundDark: "#1F2937",
    },
    fonts: {
      body: "Poppins, sans-serif",
      heading: "Unna, serif",
    },
  };

  const {
    data,
    setData,
    handleTextUpdate,
    handleButtonUpdate,
    handleArrayItemUpdate,
  } = useBuilderLogic(
    {
      ...heroData,
      features: heroData.features || defaultFeatures,
      trustIndicators: heroData.trustIndicators || defaultTrustIndicators,
    },
    onUpdate
  );

  // Handle image uploads
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Please select a valid image file (${allowedTypes.join(", ")})`
      );
      return;
    }

    setIsUploading(imageType);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "hero-rugs",
        resourceType: "image",
      });

      if (imageType === "leftImage") {
        const updatedData = {
          ...data,
          leftImageUrl: imageUrl,
          leftImageAlt: `Left rug image: ${file.name}`,
        };
        setData(updatedData);
        onUpdate?.({
          leftImageUrl: imageUrl,
          leftImageAlt: updatedData.leftImageAlt,
        });
      } else if (imageType === "rightImage") {
        const updatedData = {
          ...data,
          rightImageUrl: imageUrl,
          rightImageAlt: `Right rug image: ${file.name}`,
        };
        setData(updatedData);
        onUpdate?.({
          rightImageUrl: imageUrl,
          rightImageAlt: updatedData.rightImageAlt,
        });
      } else if (imageType === "mobileImage") {
        const updatedData = {
          ...data,
          mobileImageUrl: imageUrl,
          mobileImageAlt: `Mobile background: ${file.name}`,
        };
        setData(updatedData);
        onUpdate?.({
          mobileImageUrl: imageUrl,
          mobileImageAlt: updatedData.mobileImageAlt,
        });
      }

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setIsUploading(null);
      setHoveredImage(null);
      event.target.value = "";
    }
  };

  // Default images
  const leftImageUrl =
    data.leftImageUrl ||
    "https://images.unsplash.com/photo-1725653811863-8ca1776e126a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const rightImageUrl =
    data.rightImageUrl ||
    "https://images.unsplash.com/photo-1758640920659-0bb864175983?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section
      className="relative mx-auto w-full overflow-hidden bg-white"
      data-component-id={componentId}
    >
      {/* Desktop Layout */}
      <div className="">
        <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
          {/* Desktop: Three Column Layout */}
          <div className="hidden md:grid md:h-full md:min-h-[600px] md:grid-cols-3 lg:min-h-[700px]">
            {/* Left Image Column */}
            <div className="relative h-full min-h-[600px] lg:min-h-[700px]">
              <div
                className="group relative h-full w-full cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredImage("leftImage")}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Image
                  src={leftImageUrl}
                  alt={data.leftImageAlt || "Left image"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {isEditable && (
                  <>
                    {/* Hover Overlay - Only shows when left image is hovered */}
                    <div
                      className={`absolute inset-0 z-15 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
                        hoveredImage === "leftImage"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Button
                        variant="secondary"
                        className="gap-2 bg-white/90 text-black hover:bg-white"
                        onClick={() =>
                          document
                            .getElementById(`left-image-upload-${componentId}`)
                            ?.click()
                        }
                      >
                        <ImagePlus className="h-4 w-4" /> Change Left Image
                      </Button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      id={`left-image-upload-${componentId}`}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, "leftImage")}
                      className="hidden"
                    />
                  </>
                )}

                {/* Upload Loading */}
                {isUploading === "leftImage" && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <p className="text-sm font-medium">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center Content Column */}
            <div className="bg-background relative flex h-full min-h-[600px] flex-col items-start justify-center px-8 py-12 text-left lg:min-h-[700px] lg:px-12">
              {/* Main Heading */}
              <EditableText
                value={data.title || "Premium Nepali Hand Knotted Rugs"}
                onChange={handleTextUpdate("title")}
                as="h1"
                className="text-foreground mb-6 w-full text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:mb-8 lg:text-6xl"
                isEditable={isEditable}
                placeholder="Enter main title..."
                multiline={true}
              />

              {/* Description */}
              <EditableText
                value={
                  data.description ||
                  "Experience the timeless beauty of authentic Nepali craftsmanship. Each rug tells a story of tradition, patience, and unparalleled artistry passed down through generations."
                }
                onChange={handleTextUpdate("description")}
                as="p"
                className="text-muted-foreground mb-8 w-full text-lg leading-relaxed md:mb-10 lg:mb-12"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />

              {/* Action Buttons */}
              <div className="flex w-full flex-wrap items-center gap-4 sm:gap-6">
                {data.buttons.length > 0 && (
                  <EditableLink
                    text={data.buttons[0]?.text || "Order Now"}
                    href={data.buttons[0]?.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(
                        data.buttons[0]?.id || "1",
                        text,
                        href
                      )
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="h-12 rounded-lg px-8 py-3 text-base font-medium shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                      fontFamily: theme.fonts.body,
                    }}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                )}

                {data.buttons.length > 1 && (
                  <EditableLink
                    text={data.buttons[1]?.text || "View Menu"}
                    href={data.buttons[1]?.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(
                        data.buttons[1]?.id || "2",
                        text,
                        href
                      )
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="hover:bg-muted h-12 rounded-lg border-2 bg-transparent px-8 py-3 text-base font-medium transition-all duration-200"
                    style={{
                      borderColor: theme.colors.primary,
                      color: theme.colors.primary,
                      fontFamily: theme.fonts.body,
                    }}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                )}
              </div>
            </div>

            {/* Right Image Column */}
            <div className="relative h-full min-h-[600px] lg:min-h-[700px]">
              <div
                className="group relative h-full w-full cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredImage("rightImage")}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Image
                  src={rightImageUrl}
                  alt={data.rightImageAlt || "Right image"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {isEditable && (
                  <>
                    {/* Hover Overlay - Only shows when right image is hovered */}
                    <div
                      className={`absolute inset-0 z-20 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
                        hoveredImage === "rightImage"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Button
                        variant="secondary"
                        className="gap-2 bg-white/90 text-black hover:bg-white"
                        onClick={() =>
                          document
                            .getElementById(`right-image-upload-${componentId}`)
                            ?.click()
                        }
                      >
                        <ImagePlus className="h-4 w-4" /> Change Right Image
                      </Button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      id={`right-image-upload-${componentId}`}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, "rightImage")}
                      className="hidden"
                    />
                  </>
                )}

                {/* Upload Loading */}
                {isUploading === "rightImage" && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <p className="text-sm font-medium">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="relative min-h-[600px] md:hidden">
            {/* Mobile Background Image */}
            {data.mobileImageUrl && (
              <div
                className="absolute inset-0 cursor-pointer"
                onMouseEnter={() => setHoveredImage("mobileImage")}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Image
                  src={data.mobileImageUrl}
                  alt={data.mobileImageAlt || "Mobile background"}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/60" />

                {isEditable && (
                  <>
                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 z-20 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
                        hoveredImage === "mobileImage"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Button
                        variant="secondary"
                        className="gap-2 bg-white/90 text-black hover:bg-white"
                        onClick={() =>
                          document
                            .getElementById(
                              `mobile-image-upload-${componentId}`
                            )
                            ?.click()
                        }
                      >
                        <ImagePlus className="h-4 w-4" /> Change Background
                      </Button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      id={`mobile-image-upload-${componentId}`}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, "mobileImage")}
                      className="hidden"
                    />
                  </>
                )}

                {/* Upload Loading */}
                {isUploading === "mobileImage" && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <p className="text-sm font-medium">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Content Overlay */}
            <div className="relative z-10 flex min-h-[600px] flex-col items-start justify-center px-6 py-12 text-left">
              {/* Main Heading */}
              <EditableText
                value={data.title || "Premium Nepali Hand Knotted Rugs"}
                onChange={handleTextUpdate("title")}
                as="h1"
                className="mb-4 w-full text-4xl leading-tight font-bold text-white"
                isEditable={isEditable}
                placeholder="Enter main title..."
                multiline={true}
                style={{
                  fontFamily: theme.fonts.heading,
                }}
              />

              {/* Description */}
              <EditableText
                value={
                  data.description ||
                  "Experience the timeless beauty of authentic Nepali craftsmanship. Each rug tells a story of tradition, patience, and unparalleled artistry passed down through generations."
                }
                onChange={handleTextUpdate("description")}
                as="p"
                className="mb-8 w-full text-lg leading-relaxed text-white/90"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
                style={{
                  fontFamily: theme.fonts.body,
                }}
              />

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-4">
                {data.buttons.length > 0 && (
                  <EditableLink
                    text={data.buttons[0]?.text || "Order Now"}
                    href={data.buttons[0]?.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(
                        data.buttons[0]?.id || "1",
                        text,
                        href
                      )
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="h-12 w-full rounded-lg px-8 py-3 text-base font-medium shadow-lg transition-all duration-200"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                      fontFamily: theme.fonts.body,
                      boxShadow: `0 10px 25px ${theme.colors.primary}20`,
                    }}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                )}

                {data.buttons.length > 1 && (
                  <EditableLink
                    text={data.buttons[1]?.text || "View Menu"}
                    href={data.buttons[1]?.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(
                        data.buttons[1]?.id || "2",
                        text,
                        href
                      )
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="h-12 w-full rounded-lg border-2 border-white bg-transparent px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-white/10"
                    style={{
                      fontFamily: theme.fonts.body,
                    }}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
