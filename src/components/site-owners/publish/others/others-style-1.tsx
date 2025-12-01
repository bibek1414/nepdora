"use client";

import React, { useState, useEffect } from "react";
import { OthersTemplate1Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/publish/editable-link";
import { CheckCircle2, Phone } from "lucide-react";

interface OthersTemplate1Props {
  othersData: OthersTemplate1Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate1Data>) => void;
}

export const OthersTemplate1: React.FC<OthersTemplate1Props> = ({
  othersData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(othersData);
  const { data: themeResponse } = useThemeQuery();

  useEffect(() => {
    setData(othersData);
  }, [othersData]);

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
      body: "Inter",
      heading: "Poppins",
    },
  };

  const handleUpdate = (newData: Partial<OthersTemplate1Data>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    if (onUpdate) {
      onUpdate(updatedData);
    }
  };

  const handleFeatureUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    handleUpdate({ features: newFeatures });
  };

  return (
    <section
      className="relative w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8"
      style={{
        backgroundColor:
          data.backgroundType === "color"
            ? data.backgroundColor
            : theme.colors.background,
        backgroundImage:
          data.backgroundType === "image"
            ? `url(${data.backgroundImageUrl})`
            : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-full">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-3xl bg-gray-100 shadow-xl">
                <EditableImage
                  src={data.image.url}
                  alt={data.image.alt}
                  isEditable={isEditable}
                  onImageChange={(url, alt) =>
                    handleUpdate({ image: { url, alt: alt || data.image.alt } })
                  }
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>

              {/* Decorative Border/Frame */}
              <div
                className="absolute -top-6 -right-6 -bottom-6 -left-6 -z-10 rounded-[2.5rem] border-4"
                style={{ borderColor: "#84CC16" }} // Using a lime green color as per design
              />

              {/* Experience Badge */}
              <div
                className="absolute right-8 bottom-8 flex flex-col items-center justify-center rounded-2xl px-6 py-4 shadow-lg"
                style={{
                  backgroundColor: "#84CC16", // Lime green
                  color: "#FFFFFF",
                }}
              >
                <EditableText
                  value={data.experienceBadge.count}
                  onChange={val =>
                    handleUpdate({
                      experienceBadge: { ...data.experienceBadge, count: val },
                    })
                  }
                  isEditable={isEditable}
                  className="text-4xl leading-none font-bold"
                />
                <EditableText
                  value={data.experienceBadge.text}
                  onChange={val =>
                    handleUpdate({
                      experienceBadge: { ...data.experienceBadge, text: val },
                    })
                  }
                  isEditable={isEditable}
                  className="mt-1 text-center text-sm leading-tight font-medium"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col justify-center">
            {/* Subheading */}
            <div className="mb-4 flex items-center">
              <EditableText
                value={data.subHeading}
                onChange={val => handleUpdate({ subHeading: val })}
                isEditable={isEditable}
                className="text-sm font-bold tracking-wider uppercase"
                style={{ color: theme.colors.text }}
              />
              <svg
                className="ml-2 h-4 w-12"
                viewBox="0 0 50 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5C10 5 10 1 25 1C40 1 40 9 49 9"
                  stroke={theme.colors.text}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Heading */}
            <EditableText
              value={data.heading}
              onChange={val => handleUpdate({ heading: val })}
              isEditable={isEditable}
              as="h2"
              className="mb-8 text-4xl leading-tight font-bold md:text-5xl"
              style={{
                fontFamily: theme.fonts.heading,
                color: "#064E3B", // Dark green
              }}
            />

            {/* Features List */}
            <div className="mb-10 space-y-8">
              {data.features.map((feature, index) => (
                <div key={feature.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2
                      className="h-6 w-6"
                      style={{ color: "#064E3B" }}
                    />
                  </div>
                  <div>
                    <EditableText
                      value={feature.title}
                      onChange={val => handleFeatureUpdate(index, "title", val)}
                      isEditable={isEditable}
                      as="h3"
                      className="mb-2 text-xl font-bold"
                      style={{ color: "#064E3B" }}
                    />
                    <EditableText
                      value={feature.description}
                      onChange={val =>
                        handleFeatureUpdate(index, "description", val)
                      }
                      isEditable={isEditable}
                      className="text-gray-600"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Actions & Contact */}
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              {/* Primary Button */}
              {data.buttons.length > 0 && (
                <EditableLink
                  text={data.buttons[0].text}
                  href={data.buttons[0].href || "#"}
                  isEditable={isEditable}
                  siteUser={siteUser}
                  onChange={(text, href) => {
                    const newButtons = [...data.buttons];
                    newButtons[0] = { ...newButtons[0], text, href };
                    handleUpdate({ buttons: newButtons });
                  }}
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold transition-transform hover:scale-105"
                  style={{
                    backgroundColor: "#84CC16",
                    color: "#FFFFFF",
                  }}
                />
              )}

              {/* Contact Info */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#84CC16" }}
                >
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <EditableText
                    value={data.contact.label}
                    onChange={val =>
                      handleUpdate({
                        contact: { ...data.contact, label: val },
                      })
                    }
                    isEditable={isEditable}
                    className="text-sm text-gray-500"
                  />
                  <EditableText
                    value={data.contact.phone}
                    onChange={val =>
                      handleUpdate({
                        contact: { ...data.contact, phone: val },
                      })
                    }
                    isEditable={isEditable}
                    className="text-lg font-bold"
                    style={{ color: "#064E3B" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
