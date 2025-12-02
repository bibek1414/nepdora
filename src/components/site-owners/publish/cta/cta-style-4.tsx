"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import {
  CTATemplate4Data,
  defaultCTATemplate4Data,
} from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/publish/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface CTATemplate4Props {
  ctaData: CTATemplate4Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate4Data>) => void;
}

const normalizeCTAData = (ctaData: CTATemplate4Data): CTATemplate4Data => {
  const mergedButton = {
    ...defaultCTATemplate4Data.button,
    ...ctaData.button,
  };

  const mergedFeatures =
    ctaData.features && ctaData.features.length > 0
      ? ctaData.features.map((feature, index) => ({
          id: feature.id || `cta-4-feature-${index + 1}`,
          text:
            feature.text ||
            defaultCTATemplate4Data.features[
              index % defaultCTATemplate4Data.features.length
            ].text,
        }))
      : defaultCTATemplate4Data.features;

  return {
    ...defaultCTATemplate4Data,
    ...ctaData,
    button: mergedButton,
    features: mergedFeatures,
  };
};

export const CTATemplate4: React.FC<CTATemplate4Props> = ({
  ctaData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const normalizedData = useMemo(() => normalizeCTAData(ctaData), [ctaData]);
  const [data, setData] = useState(normalizedData);

  useEffect(() => {
    setData(normalizedData);
  }, [normalizedData]);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme;
  const primaryBackground =
    data.backgroundColor || theme?.colors?.primary || "#1D4ED8";
  const textColor = theme?.colors?.primaryForeground || "#FFFFFF";
  const buttonTextColor = theme?.colors?.primary || "#1D4ED8";

  const handleFieldUpdate =
    (field: keyof CTATemplate4Data) => (value: string) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);
      onUpdate?.({ [field]: value } as Partial<CTATemplate4Data>);
    };

  const handleButtonUpdate = (text: string, href: string) => {
    const updatedButton = { ...data.button, text, href };
    const updatedData = { ...data, button: updatedButton };
    setData(updatedData);
    onUpdate?.({ button: updatedButton });
  };

  const handleFeatureUpdate = (featureId: string) => (value: string) => {
    const updatedFeatures = data.features.map(feature =>
      feature.id === featureId ? { ...feature, text: value } : feature
    );
    const updatedData = { ...data, features: updatedFeatures };
    setData(updatedData);
    onUpdate?.({ features: updatedFeatures });
  };

  const handleImageChange = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      imageUrl,
      imageAlt: altText || data.imageAlt,
    });
  };

  const handleAltChange = (altText: string) => {
    const updatedData = { ...data, imageAlt: altText };
    setData(updatedData);
    onUpdate?.({ imageAlt: altText });
  };

  const overlayBackground = data.overlayColor || "#0F172A";
  const overlayOpacity = data.overlayOpacity ?? 0.2;

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto max-w-7xl px-[23px]">
        <div
          className="relative flex flex-col overflow-hidden rounded-3xl bg-blue-700 lg:flex-row"
          style={{ backgroundColor: primaryBackground }}
        >
          <div className="relative z-10 p-12 text-white lg:w-1/2 lg:p-20">
            <EditableText
              value={data.eyebrow}
              onChange={handleFieldUpdate("eyebrow")}
              as="div"
              className="text-xs font-bold tracking-[0.3em] uppercase opacity-80"
              isEditable={isEditable}
              style={{ color: textColor }}
            />

            <h2 className="mb-6 text-4xl leading-tight font-semibold text-white lg:text-5xl">
              <EditableText
                value={data.title}
                onChange={handleFieldUpdate("title")}
                as="span"
                className="block"
                isEditable={isEditable}
                style={{ color: textColor }}
                multiline
              />
            </h2>

            <EditableLink
              text={data.button.text}
              href={data.button.href || "#"}
              onChange={handleButtonUpdate}
              isEditable={isEditable}
              siteUser={siteUser}
              className="mb-10 inline-flex rounded-full px-8 py-3 text-base font-semibold shadow-lg"
              style={{
                backgroundColor: "#FFFFFF",
                color: buttonTextColor,
              }}
              textPlaceholder="Button text..."
              hrefPlaceholder="Enter URL..."
            />

            <div className="space-y-3">
              {data.features.map(feature => (
                <div
                  key={feature.id}
                  className="flex items-center gap-3 text-sm font-medium text-white"
                >
                  <CheckCircle2 size={18} />
                  <EditableText
                    value={feature.text}
                    onChange={handleFeatureUpdate(feature.id)}
                    as="span"
                    isEditable={isEditable}
                    style={{ color: textColor }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-64 lg:h-auto lg:w-1/2">
            <div className="absolute inset-0">
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt || "CTA image"}
                onImageChange={handleImageChange}
                onAltChange={handleAltChange}
                isEditable={isEditable}
                className="h-full w-full"
                width={800}
                height={800}
              />
            </div>

            {data.showOverlay && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: overlayBackground,
                  opacity: overlayOpacity,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
