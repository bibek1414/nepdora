"use client";

import React from "react";
import { CTATemplate2Data } from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { Badge } from "@/components/ui/badge";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface CTATemplate2Props {
  ctaData: CTATemplate2Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate2Data>) => void;
}

export const CTATemplate2: React.FC<CTATemplate2Props> = ({
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
      " px-8 py-4 font-bold transition-all duration-300 min-w-[140px] text-center rounded-full text-lg hover:shadow-lg hover:-translate-y-0.5";

    const buttonStyles = {
      backgroundColor:
        variant === "primary"
          ? theme.colors.primaryForeground
          : variant === "secondary"
            ? theme.colors.secondary
            : "transparent",
      color:
        variant === "primary"
          ? theme.colors.primary
          : variant === "secondary"
            ? theme.colors.secondaryForeground
            : theme.colors.primaryForeground,
      border:
        variant === "outline"
          ? `2px solid ${theme.colors.primaryForeground}`
          : "none",
      borderRadius: "9999px",
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
          backgroundColor: data.backgroundColor || theme.colors.primary,
        };
    }
  };

  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      style={getBackgroundStyle()}
    >
      <div className="relative z-10 container mx-auto max-w-7xl">
        <div className="flex max-w-4xl flex-col items-start text-left">
          {/* Badge */}
          {data.showBadge && data.badgeText && (
            <div className="mb-6">
              <Badge
                variant="secondary"
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                }}
              >
                <EditableText
                  value={data.badgeText}
                  onChange={handleTextUpdate("badgeText")}
                  as="span"
                  isEditable={isEditable}
                  placeholder="Badge text..."
                />
              </Badge>
            </div>
          )}

          {/* Subtitle */}
          {data.subtitle && (
            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              as="h3"
              className="mb-4 text-lg font-bold tracking-wide uppercase opacity-90"
              style={{ color: theme.colors.primaryForeground }}
              isEditable={isEditable}
              placeholder="Enter subtitle..."
            />
          )}

          {/* Title */}
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
            style={{ color: theme.colors.primaryForeground }}
            isEditable={isEditable}
            placeholder="Enter CTA title..."
          />

          {/* Description */}
          {data.description && (
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="mb-10 max-w-2xl text-xl leading-relaxed opacity-90"
              style={{ color: theme.colors.primaryForeground }}
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          )}

          {/* Buttons */}
          {data.buttons.length > 0 && (
            <div className="flex flex-wrap gap-4">
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
    </section>
  );
};
