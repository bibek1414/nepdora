"use client";

import React, { useState } from "react";
import { CTATemplate1Data } from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface CTATemplate1Props {
  ctaData: CTATemplate1Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate1Data>) => void;
}

export const CTATemplate1: React.FC<CTATemplate1Props> = ({
  ctaData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(ctaData);
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

  const handleTextUpdate =
    (field: keyof CTATemplate1Data) => (value: string) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);
      onUpdate?.({ [field]: value } as Partial<CTATemplate1Data>);
    };

  const handleButtonUpdate = (buttonId: string, text: string, href: string) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, text, href } : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };

  const getButtonClasses = (variant: string) => {
    const baseClasses =
      "inline-block px-6 py-3 font-bold transition-colors min-w-[120px] text-center rounded-lg";

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
          backgroundColor: data.backgroundColor || theme.colors.primary,
        };
    }
  };

  const getLayoutClasses = () => {
    switch (data.layout) {
      case "text-left":
        return "text-left items-start";
      case "text-right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  };

  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
      style={getBackgroundStyle()}
    >
      {data.backgroundType === "image" && data.showOverlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${data.overlayOpacity || 0.5})`,
          }}
        />
      )}

      <div className="relative z-10 container mx-auto max-w-4xl">
        <div className={`flex flex-col ${getLayoutClasses()} gap-6`}>
          {/* Title */}
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-3xl font-bold sm:text-4xl md:text-5xl"
            style={{
              color:
                data.backgroundType === "color" ||
                data.backgroundType === "gradient"
                  ? theme.colors.primaryForeground
                  : theme.colors.text,
            }}
            isEditable={isEditable}
            placeholder="Enter CTA title..."
          />

          {/* Description */}
          {data.description && (
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="max-w-2xl text-lg"
              style={{
                color:
                  data.backgroundType === "color" ||
                  data.backgroundType === "gradient"
                    ? theme.colors.primaryForeground
                    : theme.colors.text,
              }}
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          )}

          {/* Buttons */}
          {data.buttons.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {data.buttons.map(button => {
                const buttonClass = getButtonClasses(button.variant);
                return (
                  <EditableLink
                    key={button.id}
                    text={button.text || "Button text"}
                    href={button.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate(button.id, text, href)
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
