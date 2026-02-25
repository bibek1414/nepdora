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
      className="relative overflow-hidden bg-gray-100"
      data-component-id={componentId}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mr-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
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
                  as="p"
                  className="text-center! text-white"
                  isEditable={isEditable}
                  placeholder="Badge text..."
                />
              </span>
            </div>
            {/* Title */}
            <EditableText
              value={data.title || "Waves Puffer<br />Coat Black"}
              onChange={handleTextUpdate("title")}
              as="h3"
              className="mb-8 text-5xl! leading-relaxed font-semibold! tracking-tight text-gray-900 lg:text-7xl"
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
                const primaryColor = theme.colors.primary || "#C1F377";
                const textColor = "black";

                switch (idx) {
                  case 0:
                    return (
                      <svg
                        width="2.8125em"
                        height="2.25em"
                        viewBox="0 0 45 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <ellipse
                          cx="32.4999"
                          cy="30"
                          rx="4"
                          ry="4"
                          stroke={textColor}
                          strokeWidth="3.4375"
                        ></ellipse>
                        <ellipse
                          cx="12.5"
                          cy="30"
                          rx="4"
                          ry="4"
                          stroke={textColor}
                          strokeWidth="3.4375"
                        ></ellipse>
                        <path
                          d="M8.50006 29.9449C6.30661 29.8356 4.93827 29.5093 3.96453 28.5355C2.99079 27.5618 2.6645 26.1934 2.55516 24M16.5001 30H28.5001M36.5001 29.9449C38.6935 29.8356 40.0619 29.5093 41.0356 28.5355C42.5001 27.0711 42.5001 24.714 42.5001 20V16H33.1001C31.611 16 30.8665 16 30.264 15.8042C29.0462 15.4086 28.0915 14.4538 27.6958 13.2361C27.5001 12.6335 27.5001 11.889 27.5001 10.4C27.5001 8.16646 27.5001 7.04969 27.2064 6.1459C26.6129 4.31927 25.1808 2.88717 23.3542 2.29366C22.4504 2 21.3336 2 19.1001 2H2.50006"
                          stroke={textColor}
                          strokeWidth="3.4375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M2.50006 10H14.5001"
                          stroke={primaryColor}
                          strokeWidth="3.4375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M2.50006 16H10.5001"
                          stroke={primaryColor}
                          strokeWidth="3.4375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M27.5 6H31.1424C34.0531 6 35.5085 6 36.6928 6.70742C37.8772 7.41484 38.5672 8.69623 39.9472 11.259L42.5 16"
                          stroke={textColor}
                          strokeWidth="3.4375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    );
                  case 1:
                    return (
                      <svg
                        width="2.8125em"
                        height="2.75em"
                        viewBox="0 0 45 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.0237 5.19874C24.8912 3.06625 23.825 2 22.5 2C21.175 2 20.1088 3.06625 17.9763 5.19874C16.6966 6.47841 15.4285 7.07251 13.6042 7.07251C12.0112 7.07251 9.74485 6.76357 8.5 8.01889C7.26499 9.26429 7.57256 11.5213 7.57256 13.1041C7.57256 14.9286 6.9784 16.1966 5.69871 17.4763C3.56625 19.6088 2.50002 20.675 2.5 22C2.50003 23.3249 3.56627 24.3912 5.69876 26.5237C7.13231 27.9572 7.57256 28.8828 7.57256 30.8958C7.57256 32.4888 7.26362 34.7551 8.51898 36C9.76437 37.235 12.0214 36.9274 13.6041 36.9274C15.547 36.9274 16.4826 37.3074 17.8691 38.694C19.0498 39.8748 20.6326 42 22.5 42C24.3675 42 25.9502 39.8747 27.1309 38.694C28.5174 37.3074 29.453 36.9274 31.3959 36.9274C32.9786 36.9274 35.2356 37.235 36.481 36M39.3013 17.4763C41.4338 19.6088 42.5 20.675 42.5 22C42.5 23.3249 41.4337 24.3912 39.3012 26.5237C37.8677 27.9572 37.4274 28.8829 37.4274 30.8958C37.4274 32.4888 37.7364 34.7551 36.481 36M36.481 36H36.5"
                          stroke={textColor}
                          strokeWidth="3.4375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M14.5 18.6154C14.5 18.6154 19 18 22.5 26C22.5 26 32.6176 6 42.5 2"
                          stroke={primaryColor}
                          strokeWidth="3.4375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    );
                  case 2:
                    return (
                      <svg
                        width="2.8125em"
                        height="2.75em"
                        viewBox="0 0 45 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.05524 21.8847C4.15919 18.5786 3.24369 15.879 2.69167 13.1424C1.87524 9.09515 3.74362 5.14161 6.83876 2.61895C8.14689 1.55277 9.64646 1.91704 10.42 3.3048L12.1664 6.43782C13.5506 8.92113 14.2427 10.1628 14.1054 11.4792C13.9681 12.7956 13.0347 13.8677 11.1679 16.012L6.05524 21.8847ZM6.05524 21.8847C9.89301 28.5765 15.9157 34.6025 22.6153 38.4448M22.6153 38.4448C25.9214 40.3408 28.621 41.2563 31.3576 41.8083C35.4048 42.6248 39.3584 40.7564 41.8811 37.6612C42.9472 36.3531 42.583 34.8535 41.1952 34.08L38.0622 32.3336C35.5789 30.9494 34.3372 30.2573 33.0208 30.3946C31.7044 30.5319 30.6323 31.4653 28.488 33.3321L22.6153 38.4448Z"
                          stroke={textColor}
                          strokeWidth="3.4375"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M26.5 11.6637C29.3465 12.8725 31.6276 15.1535 32.8364 18M27.8081 2C34.8825 4.04152 40.4582 9.61704 42.5 16.6913"
                          stroke={primaryColor}
                          strokeWidth="3.4375"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                    );
                  case 3:
                    return (
                      <svg
                        width="2.8125em"
                        height="2.25em"
                        viewBox="0 0 45 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 18C2.5 10.925 2.5 7.38755 4.6056 5.0258C4.94238 4.64805 5.31356 4.29871 5.71491 3.98174C8.22427 2 11.9828 2 19.5 2L25.5 2C33.0172 2 36.7757 2 39.2851 3.98174C39.6864 4.29871 40.0576 4.64805 40.3944 5.0258C42.5 7.38755 42.5 10.925 42.5 18C42.5 25.075 42.5 28.6125 40.3944 30.9742C40.0576 31.3519 39.6864 31.7013 39.2851 32.0183C36.7757 34 33.0172 34 25.5 34L19.5 34C11.9828 34 8.22427 34 5.71491 32.0183C5.31356 31.7013 4.94238 31.3519 4.6056 30.9742C2.5 28.6125 2.5 25.075 2.5 18Z"
                          stroke={textColor}
                          strokeWidth="3.4375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M18.5 26H21.5"
                          stroke={primaryColor}
                          strokeWidth="3.4375"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M27.5 26L34.5 26"
                          stroke={primaryColor}
                          strokeWidth="3.4375"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M2.5 12L42.5 12"
                          stroke={textColor}
                          strokeWidth="3.4375"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    );
                  default:
                    return (
                      <div
                        className="h-6 w-6 rounded-full border-2"
                        style={{ borderColor: textColor }}
                      />
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
