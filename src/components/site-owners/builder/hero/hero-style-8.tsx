"use client";

import React, { useState, useEffect } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroData } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroTemplate8Props {
  heroData: HeroData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
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

  const [data, setData] = useState<HeroData>(() => ({
    ...heroData,
    buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
    features: heroData.features || defaultFeatures,
    trustIndicators: heroData.trustIndicators || defaultTrustIndicators,
  }));

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const { data: themeResponse } = useThemeQuery();

  useEffect(() => {
    setData({
      ...heroData,
      buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
      features: heroData.features || defaultFeatures,
      trustIndicators: heroData.trustIndicators || defaultTrustIndicators,
    });
  }, [heroData]);

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

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
  };

  // Handle button updates
  const handleButtonUpdate = (buttonId: string, text: string, href: string) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, text, href } : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };

  // Handle feature updates
  const handleFeatureUpdate = (featureId: string, text: string) => {
    const updatedFeatures = (data.features || []).map(feature =>
      feature.id === featureId ? { ...feature, text } : feature
    );
    const updatedData = { ...data, features: updatedFeatures };
    setData(updatedData);
    onUpdate?.({ features: updatedFeatures });
  };

  // Handle trust indicator updates - Fixed to ensure proper typing
  const handleTrustIndicatorUpdate = (
    field: keyof typeof defaultTrustIndicators,
    value: string | string[]
  ) => {
    const currentTrustIndicators =
      data.trustIndicators || defaultTrustIndicators;

    let updatedTrustIndicators;

    if (field === "features") {
      // Handle features array specially
      const featuresArray =
        typeof value === "string" ? value.split(",").map(f => f.trim()) : value;
      updatedTrustIndicators = {
        ...currentTrustIndicators,
        [field]: featuresArray,
      };
    } else {
      // Handle other fields as strings
      updatedTrustIndicators = {
        ...currentTrustIndicators,
        [field]: value as string,
      };
    }

    const updatedData = { ...data, trustIndicators: updatedTrustIndicators };
    setData(updatedData);
    onUpdate?.({ trustIndicators: updatedTrustIndicators });
  };

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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
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
      toast.error("Failed to upload image. Please try again.");
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
      className="relative overflow-hidden"
      data-component-id={componentId}
    >
      {/* Desktop Layout */}
      <div className="mx-auto max-w-7xl">
        <div className="relative h-[400px] md:h-[500px] lg:h-[591px]">
          {/* Left Rug Image - Desktop */}
          <div className="absolute top-0 left-0 hidden h-full w-[200px] md:block md:w-[280px] lg:w-[405px]">
            <div
              className="relative h-full w-full cursor-pointer"
              onMouseEnter={() => setHoveredImage("leftImage")}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <Image
                src={leftImageUrl}
                alt={data.leftImageAlt || "Hand knotted rug left"}
                width={405}
                height={591}
                className="h-full w-full object-cover"
                priority
              />

              {isEditable && (
                <>
                  {/* Hover Overlay - Only shows when left image is hovered */}
                  <div
                    className={`absolute inset-0 z-15 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
                      hoveredImage === "leftImage" ? "opacity-100" : "opacity-0"
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

          {/* Right Rug Image - Desktop */}
          <div className="absolute top-0 right-0 hidden h-full w-[200px] md:block md:w-[280px] lg:w-[404px]">
            <div
              className="relative h-full w-full cursor-pointer"
              onMouseEnter={() => setHoveredImage("rightImage")}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <Image
                src={rightImageUrl}
                alt={data.rightImageAlt || "Hand knotted rug right"}
                width={404}
                height={591}
                className="h-full w-full object-cover"
                priority
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

          {/* Mobile Background Image */}
          <div className="absolute inset-0 md:hidden">
            <div
              className="relative h-full w-full cursor-pointer"
              onMouseEnter={() => setHoveredImage("mobileImage")}
              onMouseLeave={() => setHoveredImage(null)}
            >
              {isEditable && (
                <>
                  {/* Hover Overlay - Only shows when mobile image is hovered */}
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
                          .getElementById(`mobile-image-upload-${componentId}`)
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
          </div>

          {/* Gradient Overlays - Desktop only */}
          <div className="absolute top-0 left-[150px] hidden h-full w-[120px] bg-gradient-to-r from-transparent to-white/80 md:left-[200px] md:block md:w-[150px] lg:left-[280px] lg:w-[196px]" />
          <div className="absolute top-0 right-[150px] hidden h-full w-[120px] bg-gradient-to-l from-transparent to-white/80 md:right-[200px] md:block md:w-[150px] lg:right-[404px] lg:w-[196px]" />

          {/* Central Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
            {/* Main Heading */}
            <EditableText
              value={data.title || "Premium Nepali Hand Knotted Rugs"}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="mb-4 max-w-[320px] text-center text-[28px] leading-[1.15] font-bold sm:max-w-[400px] sm:text-[36px] md:mb-6 md:max-w-[500px] md:text-[42px] lg:max-w-[593px] lg:text-[54px]"
              isEditable={isEditable}
              placeholder="Enter main title..."
              multiline={true}
              style={{
                fontFamily: theme.fonts.heading,
                color: theme.colors.primary,
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
              className="mb-8 max-w-[320px] text-center text-[14px] leading-[1.5] sm:max-w-[380px] sm:text-[16px] md:mb-12 md:max-w-[450px] lg:max-w-[460px] lg:text-[18px]"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
              style={{ fontFamily: theme.fonts.body }}
            />

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              {data.buttons.length > 1 && (
                <EditableLink
                  text={data.buttons[1]?.text || "Watch Craft"}
                  href={data.buttons[1]?.href || "#"}
                  onChange={(text, href) =>
                    handleButtonUpdate(data.buttons[1]?.id || "2", text, href)
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="h-[50px] w-full rounded-lg border-2 bg-transparent px-6 py-3 text-[16px] leading-[1.5] transition-all duration-200 sm:h-[59px] sm:w-[180px] sm:px-8 sm:py-4 lg:w-[207px] lg:text-[18px] xl:text-[20px]"
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.body,
                  }}
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter URL..."
                />
              )}

              {data.buttons.length > 0 && (
                <EditableLink
                  text={data.buttons[0]?.text || "Shop Now"}
                  href={data.buttons[0]?.href || "#"}
                  onChange={(text, href) =>
                    handleButtonUpdate(data.buttons[0]?.id || "1", text, href)
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="h-[50px] w-full rounded-lg px-6 py-3 text-[16px] leading-[1.5] shadow-lg transition-all duration-200 sm:h-[59px] sm:w-[180px] sm:px-8 sm:py-4 lg:w-[207px] lg:text-[18px] xl:text-[20px]"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
