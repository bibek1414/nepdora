"use client";

import React from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { HeroTemplate17Data } from "@/types/owner-site/components/hero";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface HeroTemplate17Props {
  heroData: HeroTemplate17Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate17Data>) => void;
}

export const HeroTemplate17: React.FC<HeroTemplate17Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const componentId = React.useId();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#A3E635",
      text: "#000000",
      background: "#FFFFFF",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  };

  const defaultFeatures = [
    { id: "1", text: "Free Shipping|Free Shipping for orders over $90" },
    { id: "2", text: "Money Back guarantee|100% money back guarantee" },
    { id: "3", text: "24/7 online support|24 hours a day, 7 days a week" },
    { id: "4", text: "Flexible Payment|Pay with Multiple Credit Cards" },
  ];

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
    },
    onUpdate
  );

  const rightImageUrl =
    data.rightImageUrl ||
    "/images/site-owners/hero/hero-style-17/hero-right-image.webp";

  return (
    <section
      className="relative overflow-hidden bg-white"
      data-component-id={componentId}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Column: Text */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-6 inline-block">
              <span
                className="rounded-full px-2 py-1.5 text-sm font-medium text-black"
                style={{
                  backgroundColor: theme.colors.primary || "#B9FF66",
                }}
              >
                <EditableText
                  value={data.badgeText || "New Trend 2025"}
                  onChange={handleTextUpdate("badgeText")}
                  as="span"
                  className="text-white"
                  isEditable={isEditable}
                  placeholder="Badge text..."
                />
              </span>
            </div>
            {/* Title */}
            <EditableText
              value={data.title || "Waves Puffer<br />Coat Black"}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="mb-8 !text-5xl leading-relaxed tracking-tight text-gray-900 lg:text-7xl"
              isEditable={isEditable}
              placeholder="Main Headline"
              multiline
              style={{ fontFamily: theme.fonts.heading }}
            />

            {/* Button */}
            <div className="mt-8">
              {data.buttons.length > 0 && (
                <EditableLink
                  text={data.buttons[0]?.text || "Shop Now"}
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
                  className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full border border-black bg-transparent px-8 py-3 text-base font-medium text-black transition-colors hover:bg-black hover:text-white"
                  style={{ fontFamily: theme.fonts.body }}
                />
              )}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative">
            {/* Main Model Image */}
            <div className="relative flex aspect-4/5 w-full items-end justify-center lg:aspect-auto lg:h-[600px]">
              {/* Decorative Green Starburst behind image */}
              <div className="absolute top-1/2 left-1/2 z-0 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 text-[#B9FF66]">
                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full fill-current"
                >
                  <path d="M50 0 L54 36 L92 15 L64 43 L100 50 L64 57 L92 85 L54 64 L50 100 L46 64 L8 85 L36 57 L0 50 L36 43 L8 15 L46 36 Z" />
                </svg>
              </div>

              <div className="pointer-events-none relative z-10 mx-auto h-full w-full max-w-[500px] overflow-visible">
                <div className="pointer-events-auto absolute bottom-0 h-full w-full">
                  <EditableImage
                    src={rightImageUrl}
                    alt={data.rightImageAlt || "Model"}
                    onImageChange={(url, altText) => {
                      const updatedData = {
                        ...data,
                        rightImageUrl: url,
                        rightImageAlt: altText,
                      };
                      setData(updatedData);
                      onUpdate?.(updatedData);
                    }}
                    onAltChange={altText => {
                      const updatedData = { ...data, rightImageAlt: altText };
                      setData(updatedData);
                      onUpdate?.(updatedData);
                    }}
                    isEditable={isEditable}
                    className="h-full w-full bg-transparent"
                    width={500}
                    height={600}
                    priority
                    showAltEditor={true}
                    disableImageChange={!isEditable}
                    showDimensionGuide={false}
                  />
                </div>
              </div>
            </div>

            {/* Circular Stamp Overlay */}
          </div>
        </div>
      </div>

      {/* Bottom Features Banner */}
      <div className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {data.features?.map((feature, index) => {
              const [title, subtitle] = (feature.text || "").split("|");

              // We can use a simple mapping or just render simple SVG paths for icons based on index
              // For simplicity, we'll try to use a generic icon approach or fixed icons as per design
              const renderIcon = (idx: number) => {
                switch (idx) {
                  case 0:
                    return (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="16"
                          height="12"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="19" y1="9" x2="23" y2="15"></line>
                        <line x1="23" y1="15" x2="23" y2="21"></line>
                        <rect x="19" y="15" width="4" height="6"></rect>
                        <circle cx="6" cy="19" r="2"></circle>
                        <circle cx="15" cy="19" r="2"></circle>
                      </svg>
                    );
                  case 1:
                    return (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    );
                  case 2:
                    return (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    );
                  case 3:
                    return (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black"
                      >
                        <rect
                          x="2"
                          y="5"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="2" y1="10" x2="22" y2="10"></line>
                      </svg>
                    );
                  default:
                    return (
                      <div className="h-6 w-6 rounded-full border-2 border-black" />
                    );
                }
              };

              return (
                <div key={feature.id} className="flex items-start gap-4">
                  <div className="mt-1">{renderIcon(index % 4)}</div>
                  <div>
                    <h3 className="mb-1 text-[15px] font-semibold text-black">
                      <EditableText
                        value={title || `Feature ${index + 1}`}
                        onChange={newTitle =>
                          handleArrayItemUpdate(
                            "features",
                            feature.id
                          )({ text: `${newTitle}|${subtitle || ""}` })
                        }
                        as="span"
                        isEditable={isEditable}
                      />
                    </h3>
                    <p className="text-sm text-gray-500">
                      <EditableText
                        value={
                          subtitle ||
                          `Feature ${index + 1} description goes here`
                        }
                        onChange={newSubtitle =>
                          handleArrayItemUpdate(
                            "features",
                            feature.id
                          )({ text: `${title || ""}|${newSubtitle}` })
                        }
                        as="span"
                        isEditable={isEditable}
                        multiline
                      />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
