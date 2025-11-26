"use client";
import React, { useState } from "react";
import { AboutUs10Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { Check, ArrowRight, Phone, MoveUpRight, Map } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate10Props {
  aboutUsData: AboutUs10Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs10Data>) => void;
}

const hexToRgba = (hex: string, alpha = 1) => {
  const sanitized = hex.replace("#", "");
  if (sanitized.length !== 6) {
    return hex;
  }

  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function AboutUsTemplate10({
  aboutUsData,
  isEditable = false,
  onUpdate,
}: AboutUsTemplate10Props) {
  const [data, setData] = useState(aboutUsData);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#84cc16", // Defaulting to the original lime green for fallback
      primaryForeground: "#FFFFFF",
      secondary: "#013D2F", // Defaulting to the original dark green for fallback
      secondaryForeground: "#FFFFFF",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs10Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs10Data>);
  };

  // Handle image updates
  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      imageUrl,
      imageAlt: updatedData.imageAlt,
    });
  };

  // Handle alt text updates
  const handleAltUpdate = (altText: string) => {
    const updatedData = { ...data, imageAlt: altText };
    setData(updatedData);
    onUpdate?.({ imageAlt: altText });
  };

  // Handle feature updates
  const handleFeatureUpdate =
    (featureId: string, field: "title" | "items", itemIndex?: number) =>
    (value: string) => {
      const updatedFeatures = data.features.map(feature => {
        if (feature.id === featureId) {
          if (field === "items" && typeof itemIndex === "number") {
            const newItems = [...feature.items];
            newItems[itemIndex] = value;
            return { ...feature, items: newItems };
          }
          return { ...feature, [field]: value };
        }
        return feature;
      });
      const updatedData = { ...data, features: updatedFeatures };
      setData(updatedData);
      onUpdate?.({ features: updatedFeatures });
    };

  // Handle circular stamp text update
  const handleStampTextUpdate = (value: string) => {
    const updatedData = { ...data, circularStampText: value };
    setData(updatedData);
    onUpdate?.({ circularStampText: value });
  };

  return (
    <div
      className="px-4 py-16 sm:px-6 lg:px-12"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.body,
      }}
    >
      <div className="mb-16 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Left Side Images */}
        <div className="relative">
          <div className="group relative h-[500px] w-full overflow-hidden rounded-[40px] lg:h-[600px]">
            <EditableImage
              src={data.imageUrl}
              alt={data.imageAlt}
              onImageChange={handleImageUpdate}
              onAltChange={handleAltUpdate}
              isEditable={isEditable}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              width={800}
              height={600}
              priority
              cloudinaryOptions={{
                folder: "about-us-images",
                resourceType: "image",
              }}
              showAltEditor={isEditable}
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Badge */}
          <div
            className="absolute top-8 right-8 flex h-32 w-32 cursor-default flex-col items-center justify-center rounded-2xl p-6 text-center shadow-lg transition-transform hover:rotate-0 sm:rotate-3 sm:transform"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
          >
            <EditableText
              value={data.badgeCount}
              onChange={handleTextUpdate("badgeCount")}
              as="span"
              className="block text-4xl leading-none font-extrabold"
              isEditable={isEditable}
              placeholder="25"
            />
            <EditableText
              value={data.badgeText}
              onChange={handleTextUpdate("badgeText")}
              as="span"
              className="mt-1 text-xs leading-tight font-medium"
              isEditable={isEditable}
              placeholder="Years Of experience"
            />
          </div>

          {/* Floating Circle Stamp */}
          <div
            className="absolute -bottom-10 -left-6 hidden h-32 w-32 animate-[spin_10s_linear_infinite] items-center justify-center rounded-full p-2 md:flex"
            style={{
              backgroundColor: theme.colors.background,
            }}
          >
            <div className="relative flex h-full w-full items-center justify-center rounded-full border border-dashed border-gray-300">
              <MoveUpRight
                className="h-6 w-6"
                style={{ color: theme.colors.secondary }}
              />
              <svg className="absolute h-full w-full p-1" viewBox="0 0 100 100">
                <path
                  id="curve"
                  d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0"
                  fill="transparent"
                />
                <text
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ fill: theme.colors.secondary }}
                >
                  <textPath href="#curve">
                    <EditableText
                      value={
                        data.circularStampText ||
                        "World Wide Access • Immigration Agency •"
                      }
                      onChange={handleStampTextUpdate}
                      as="span"
                      isEditable={isEditable}
                      placeholder="Circular stamp text"
                    />
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="space-y-8">
          <div
            className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase"
            style={{ color: hexToRgba(theme.colors.text, 0.6) }}
          >
            <Map size={16} />
            <EditableText
              value={data.sectionTag}
              onChange={handleTextUpdate("sectionTag")}
              as="span"
              isEditable={isEditable}
              placeholder="WHY CHOOSE US"
            />
          </div>
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-4xl leading-tight font-bold lg:text-5xl"
            style={{
              color: theme.colors.secondary,
              fontFamily: theme.fonts.heading,
            }}
            isEditable={isEditable}
            placeholder="Main Title"
          />
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            className="leading-relaxed"
            style={{ color: hexToRgba(theme.colors.text, 0.7) }}
            isEditable={isEditable}
            placeholder="Description..."
            multiline={true}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {data.features.map((feature, index) => (
              <div
                key={feature.id}
                className="rounded-2xl p-6 transition-all hover:shadow-md"
                style={{
                  backgroundColor: hexToRgba(theme.colors.primary, 0.05),
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                    }}
                  >
                    {index === 0 ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                      </svg>
                    )}
                  </div>
                  <EditableText
                    value={feature.title}
                    onChange={handleFeatureUpdate(feature.id, "title")}
                    as="h4"
                    className="font-bold"
                    style={{
                      color: theme.colors.secondary,
                      fontFamily: theme.fonts.heading,
                    }}
                    isEditable={isEditable}
                    placeholder="Feature Title"
                  />
                </div>
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: hexToRgba(theme.colors.text, 0.8) }}
                    >
                      <Check
                        size={14}
                        style={{ color: theme.colors.primary }}
                      />
                      <EditableText
                        value={item}
                        onChange={handleFeatureUpdate(
                          feature.id,
                          "items",
                          itemIndex
                        )}
                        as="span"
                        isEditable={isEditable}
                        placeholder="Feature Item"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <button
              className="flex items-center gap-2 rounded-full border border-gray-300 px-8 py-3 font-bold transition-colors hover:opacity-90"
              style={{
                color: theme.colors.secondary,
                borderColor: theme.colors.secondary,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = theme.colors.secondary;
                e.currentTarget.style.color = theme.colors.secondaryForeground;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme.colors.secondary;
              }}
            >
              <EditableText
                value={data.buttonText}
                onChange={handleTextUpdate("buttonText")}
                as="span"
                isEditable={isEditable}
                placeholder="Read More"
              />{" "}
              <ArrowRight size={16} />
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div
                className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full shadow-lg"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                  boxShadow: `0 10px 15px -3px ${hexToRgba(
                    theme.colors.primary,
                    0.3
                  )}`,
                }}
              >
                <Phone size={20} />
              </div>
              <div>
                <EditableText
                  value={data.supportText}
                  onChange={handleTextUpdate("supportText")}
                  as="div"
                  className="text-[10px] font-bold uppercase"
                  style={{ color: hexToRgba(theme.colors.text, 0.6) }}
                  isEditable={isEditable}
                  placeholder="Need help?"
                />
                <EditableText
                  value={data.supportNumber}
                  onChange={handleTextUpdate("supportNumber")}
                  as="div"
                  className="text-sm font-bold"
                  style={{ color: theme.colors.secondary }}
                  isEditable={isEditable}
                  placeholder="(808) 555-0111"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
