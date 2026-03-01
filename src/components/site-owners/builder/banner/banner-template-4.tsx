"use client";

import React, { useMemo } from "react";
import { Pin, Plus, X } from "lucide-react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { Button } from "@/components/ui/button";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface BannerTemplateProps {
  bannerData: BannerData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BannerData>) => void;
}

export const BannerTemplate4: React.FC<BannerTemplateProps> = ({
  bannerData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#0F172A",
          primary: "#3B82F6",
          primaryForeground: "#FFFFFF",
          secondary: "#F59E0B",
          secondaryForeground: "#1F2937",
          background: "#FFFFFF",
        },
        fonts: {
          body: "Inter",
          heading: "Poppins",
        },
      },
    [themeResponse]
  );

  const { data, handleTextUpdate, handleArrayItemUpdate } = useBuilderLogic(
    bannerData,
    onUpdate
  );

  // Extract section tag, title, and italic word from title/subtitle
  const sectionTag = data.subtitle || "[Our Process]";
  const fullTitle = data.title || "Optimo Your Strategic Growth Partner";
  const titleParts = fullTitle.split(" ");
  const italicWord = titleParts[titleParts.length - 1] || "Partner";
  const titleWithoutItalic = titleParts.slice(0, -1).join(" ");

  // Get main image
  const mainImage = data.images?.[0] || {
    id: 1,
    image: "/fallback/image-not-found.png",
    image_alt_description: "Optimo Team",
    link: "",
    is_active: true,
  };

  const defaultItems = [
    "Strategic Planning",
    "Operational Excellence",
    "Market Expansion",
    "Risk Management",
  ];
  const imageData = mainImage as any;
  const showFloatingCard =
    imageData.showFloatingCard !== undefined
      ? imageData.showFloatingCard
      : true;
  const cardItemsString = imageData.cardItems || defaultItems.join(",");
  const cardItems = cardItemsString
    .split(",")
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0);

  // Handle section tag update
  const handleSectionTagUpdate = (value: string) => {
    handleTextUpdate("subtitle")(value);
  };

  // Handle title update
  const handleTitleUpdate = (value: string) => {
    handleTextUpdate("title")(value);
  };

  // Handle image update
  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    if (mainImage.id !== undefined) {
      handleArrayItemUpdate(
        "images",
        mainImage.id
      )({
        image: imageUrl,
        image_alt_description: altText,
      });
    }
  };

  // Handle card item update
  const handleCardItemUpdate = (index: number, value: string) => {
    const updatedItems = [...cardItems];
    updatedItems[index] = value;
    if (mainImage.id !== undefined) {
      handleArrayItemUpdate(
        "images",
        mainImage.id
      )({
        cardItems: updatedItems.join(","),
      });
    }
  };

  // Handle add card item
  const handleAddCardItem = () => {
    const updatedItems = [...cardItems, "New Item"];
    if (mainImage.id !== undefined) {
      handleArrayItemUpdate(
        "images",
        mainImage.id
      )({
        cardItems: updatedItems.join(","),
      });
    }
  };

  // Handle remove card item
  const handleRemoveCardItem = (index: number) => {
    const updatedItems = cardItems.filter(
      (_: string, i: number) => i !== index
    );
    if (mainImage.id !== undefined) {
      handleArrayItemUpdate(
        "images",
        mainImage.id
      )({
        cardItems: updatedItems.join(","),
        showFloatingCard: updatedItems.length > 0 ? showFloatingCard : false,
      });
    }
  };

  // Handle remove entire floating card
  const handleRemoveFloatingCard = () => {
    if (mainImage.id !== undefined) {
      handleArrayItemUpdate(
        "images",
        mainImage.id
      )({
        showFloatingCard: false,
      });
    }
  };

  // Handle show floating card again
  const handleShowFloatingCard = () => {
    if (mainImage.id !== undefined) {
      handleArrayItemUpdate(
        "images",
        mainImage.id
      )({
        showFloatingCard: true,
        cardItems: imageData.cardItems || defaultItems.join(","),
      });
    }
  };

  return (
    <section
      className="bg-white py-20"
      style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.fonts.body,
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <div className="mb-0">
            {/* Section Tag */}
            <EditableText
              value={sectionTag}
              onChange={handleSectionTagUpdate}
              as="span"
              isEditable={isEditable}
              placeholder="[Our Process]"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.body,
              }}
              className="mb-3 block text-xs font-bold tracking-wide text-blue-600 uppercase"
            />
            {/* Title */}
            <h2
              className="text-3xl leading-[1.1] font-semibold md:text-5xl lg:text-6xl"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
              }}
            >
              <EditableText
                value={titleWithoutItalic}
                onChange={value => {
                  const updatedTitle = `${value} ${italicWord}`;
                  handleTitleUpdate(updatedTitle);
                }}
                as="span"
                isEditable={isEditable}
                placeholder="Optimo Your Strategic Growth"
              />
            </h2>
          </div>
        </div>

        <div className="group relative h-[600px] w-full overflow-hidden rounded-3xl">
          <EditableImage
            src={
              typeof mainImage.image === "string"
                ? mainImage.image
                : URL.createObjectURL(mainImage.image)
            }
            alt={mainImage.image_alt_description || "Optimo Team"}
            onImageChange={handleImageUpdate}
            isEditable={isEditable}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            width={1742}
            height={600}
            cloudinaryOptions={{
              folder: "banner-images",
              resourceType: "image",
            }}
            showAltEditor={isEditable}
            placeholder={{
              width: 1742,
              height: 600,
              text: "Upload team image",
            }}
          />

          {/* Floating Card */}
          {showFloatingCard && (
            <div className="group/card absolute bottom-8 left-8 max-w-xs rounded-2xl bg-white p-8 shadow-xl md:bottom-12 md:left-12 md:max-w-sm">
              {isEditable && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveFloatingCard}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover/card:opacity-100"
                  title="Remove floating card"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div
                className="mb-6 flex h-10 w-10 items-center justify-center rounded-full text-white"
                style={{
                  backgroundColor: theme.colors.primary,
                }}
              >
                <Pin size={18} fill="currentColor" />
              </div>
              <ul className="space-y-3">
                {cardItems.length > 0 ? (
                  cardItems.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm font-medium text-gray-800"
                    >
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: theme.colors.primary,
                        }}
                      ></div>
                      <EditableText
                        value={item}
                        onChange={value => handleCardItemUpdate(i, value)}
                        as="span"
                        isEditable={isEditable}
                        placeholder="Item text"
                        className="flex-1"
                      />
                      {isEditable && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveCardItem(i)}
                          className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover/card:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">
                    No items yet. Add items below.
                  </li>
                )}
                {isEditable && (
                  <li>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddCardItem}
                      className="mt-2 w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Show Floating Card Button (when hidden) */}
          {isEditable && !showFloatingCard && (
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
              <Button
                size="sm"
                variant="outline"
                onClick={handleShowFloatingCard}
                className="bg-white/90 backdrop-blur-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Show Floating Card
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
