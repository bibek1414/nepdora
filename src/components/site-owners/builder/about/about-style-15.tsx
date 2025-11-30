"use client";

import React, { useState, useMemo } from "react";
import { Puzzle, TrendingUp, Lightbulb, ArrowUpRight } from "lucide-react";
import {
  AboutUs15Data,
  AboutUs15Card,
} from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate15Props {
  aboutUsData: AboutUs15Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs15Data>) => void;
  siteUser?: string;
}

const iconMap = {
  Puzzle,
  TrendingUp,
  Lightbulb,
};

export const AboutUsTemplate15: React.FC<AboutUsTemplate15Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [data, setData] = useState(aboutUsData);
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

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs15Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs15Data>);
  };

  // Handle card updates
  const handleCardUpdate =
    (cardId: string, field: keyof AboutUs15Card) => (value: string) => {
      const updatedCards = data.cards.map(card =>
        card.id === cardId ? { ...card, [field]: value } : card
      );
      const updatedData = { ...data, cards: updatedCards };
      setData(updatedData);
      onUpdate?.({ cards: updatedCards });
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

  // Handle button link updates
  const handleButtonLinkUpdate = (text: string, href: string) => {
    const updatedData = {
      ...data,
      buttonText: text,
      buttonLink: href,
    };
    setData(updatedData);
    onUpdate?.({
      buttonText: text,
      buttonLink: href,
    });
  };

  return (
    <section
      className="bg-gray-50 py-16 md:py-24"
      style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.fonts.body,
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Row - Spans Full Width */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-4xl">
            <h2
              className="text-3xl leading-[1.1] font-semibold md:text-5xl lg:text-6xl"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
              }}
            >
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                as="span"
                isEditable={isEditable}
                placeholder="We Believe In Results With"
              />
              <br />
              <span className="font-serif font-normal italic">
                <EditableText
                  value={data.italicWord}
                  onChange={handleTextUpdate("italicWord")}
                  as="span"
                  isEditable={isEditable}
                  placeholder="Consulting."
                />
              </span>
            </h2>
          </div>
          <div className="flex-shrink-0">
            <EditableLink
              text={data.buttonText}
              href={data.buttonLink || "#"}
              onChange={handleButtonLinkUpdate}
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
                fontFamily: theme.fonts.body,
              }}
              className="inline-flex items-center justify-between rounded-full py-2 pr-2 pl-6 text-[15px] font-medium shadow-lg shadow-blue-900/10 transition-colors hover:opacity-90 [&:hover_.icon-rotate]:rotate-45"
              textPlaceholder="Get Started"
              hrefPlaceholder="#"
              isEditable={isEditable}
              siteUser={siteUser}
            >
              <>
                <span>{data.buttonText || "Get Started"}</span>
                <span className="icon-rotate ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300">
                  <ArrowUpRight
                    className="h-5 w-5"
                    style={{ color: theme.colors.primary }}
                  />
                </span>
              </>
            </EditableLink>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Text & Cards */}
          <div className="lg:col-span-7">
            <div className="max-w-3xl">
              <EditableText
                value={data.primaryDescription}
                onChange={handleTextUpdate("primaryDescription")}
                as="p"
                isEditable={isEditable}
                multiline
                placeholder="At Optimo, we believe that real business growth is rooted in strategy, insight, and execution. As a results-driven consulting firm for you."
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                }}
                className="mb-6 text-xl leading-relaxed font-medium md:text-2xl"
              />
              <EditableText
                value={data.secondaryDescription}
                onChange={handleTextUpdate("secondaryDescription")}
                as="p"
                isEditable={isEditable}
                multiline
                placeholder="Our approach blends deep industry insight, extensive experience, and strategic thinking to solve complex challenges, innovation, and deliver measurable, lasting business value"
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                }}
                className="mb-10 text-sm leading-relaxed text-gray-500 md:text-base"
              />

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {data.cards.map((card, idx) => {
                  const IconComponent = iconMap[card.icon];
                  return (
                    <div
                      key={card.id}
                      className="flex h-full flex-col items-start rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
                      style={{
                        backgroundColor: theme.colors.background,
                      }}
                    >
                      <div
                        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${theme.colors.primary}15`,
                          color: theme.colors.primary,
                        }}
                      >
                        {IconComponent && <IconComponent size={18} />}
                      </div>
                      <EditableText
                        value={card.title}
                        onChange={handleCardUpdate(card.id, "title")}
                        as="h4"
                        isEditable={isEditable}
                        placeholder="Card Title"
                        style={{
                          color: theme.colors.text,
                          fontFamily: theme.fonts.heading,
                        }}
                        className="mb-2 text-sm font-bold"
                      />
                      <EditableText
                        value={card.description}
                        onChange={handleCardUpdate(card.id, "description")}
                        as="p"
                        isEditable={isEditable}
                        multiline
                        placeholder="Card description"
                        style={{
                          color: theme.colors.text,
                          fontFamily: theme.fonts.body,
                        }}
                        className="text-xs leading-relaxed text-gray-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex flex-col items-end justify-end lg:col-span-5 lg:pl-4">
            {/* Image - Constrained width */}
            <div className="relative w-full max-w-[380px]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <EditableImage
                  src={data.imageUrl}
                  alt={data.imageAlt}
                  onImageChange={handleImageUpdate}
                  onAltChange={handleAltUpdate}
                  isEditable={isEditable}
                  className="h-full w-full object-cover"
                  width={380}
                  height={470}
                  cloudinaryOptions={{
                    folder: "about-us-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 380,
                    height: 470,
                    text: "Upload consultant image",
                  }}
                />
                {/* Subtle Gradient Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
