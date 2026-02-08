"use client";

import React from "react";
import { CTATemplate3Data } from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface CTATemplate3Props {
  ctaData: CTATemplate3Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate3Data>) => void;
}

export const CTATemplate3: React.FC<CTATemplate3Props> = ({
  ctaData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
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
      body: "Inter",
      heading: "Poppins",
    },
  };

  const { data, handleTextUpdate, handleButtonUpdate } = useBuilderLogic(
    ctaData,
    onUpdate
  );

  const getButtonClassesLocal = (variant: string) => {
    const baseClasses =
      "inline-block px-6 py-3 font-bold transition-colors min-w-[120px] text-center rounded-lg";

    const buttonStyles = {
      backgroundColor:
        variant === "primary"
          ? theme.colors.primary
          : variant === "secondary"
            ? theme.colors.secondary
            : "transparent",
      color:
        variant === "primary"
          ? theme.colors.primaryForeground
          : variant === "secondary"
            ? theme.colors.secondaryForeground
            : theme.colors.primary,
      border:
        variant === "outline" ? `2px solid ${theme.colors.primary}` : "none",
      borderRadius: "8px",
      fontFamily: theme.fonts.body,
    };

    return { className: baseClasses, style: buttonStyles };
  };

  const getBackgroundStyle = () => {
    switch (data.backgroundType) {
      case "gradient":
        return { background: data.backgroundColor };
      case "image":
        return {
          backgroundImage: `url(${data.backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      default:
        return {
          backgroundColor: data.backgroundColor || theme.colors.background,
        };
    }
  };

  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
      style={getBackgroundStyle()}
    >
      <div className="relative z-10 container mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow-xl sm:p-12 md:p-16">
          <div className="text-center">
            {/* Title */}
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl"
              style={{ color: theme.colors.text }}
              isEditable={isEditable}
              placeholder="Enter CTA title..."
            />

            {/* Description */}
            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="mx-auto mb-8 max-w-2xl text-lg text-gray-600"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {/* Feature Icons */}
            {data.showFeatureIcons && data.featureIcons && (
              <div className="mb-8 flex justify-center gap-6">
                {data.featureIcons.map((icon, index) => (
                  <div
                    key={index}
                    className="text-2xl"
                    style={{ color: theme.colors.primary }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            {data.buttons.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {data.buttons.map(button => {
                  const buttonClass = getButtonClassesLocal(button.variant);
                  return (
                    <EditableLink
                      key={button.id}
                      text={button.text || "Button text"}
                      href={button.href || "#"}
                      onChange={(text, href) =>
                        handleButtonUpdate("buttons")(button.id, text, href)
                      }
                      isEditable={isEditable}
                      siteUser={siteUser}
                      className={buttonClass.className}
                      style={buttonClass.style}
                      textPlaceholder="Button text..."
                      hrefPlaceholder="Enter URL..."
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
