"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FileText } from "lucide-react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface BannerTemplateProps {
  bannerData: BannerData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BannerData>) => void;
}

interface ProcessCardData {
  id: number;
  number: string;
  title: string;
  description: string;
}

// Background Pattern Component
const BackgroundPattern: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[50px] opacity-20">
      <svg
        className="absolute h-full w-full"
        style={{ color }}
        viewBox="0 0 1800 730"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-50 100 C 400 100, 600 600, 1850 600"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M-50 150 C 450 150, 650 650, 1850 650"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.25"
        />
        <path
          d="M-50 200 C 500 200, 700 700, 1850 700"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.2"
        />
        <path
          d="M-50 250 C 550 250, 750 750, 1850 750"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.15"
        />
        {/* Mirroring curves for the top left effect */}
        <path
          d="M-100 800 C 300 800, 500 0, 1200 -100"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M-50 800 C 350 800, 550 0, 1250 -100"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

// Process Card Component
interface ProcessCardProps {
  card: ProcessCardData;
  index: number;
  isEditable?: boolean;
  theme: {
    colors: {
      text: string;
      primary: string;
      background: string;
    };
    fonts: {
      body: string;
      heading: string;
    };
  };
  onUpdate: (
    index: number,
    field: "title" | "description",
    value: string
  ) => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  card,
  index,
  isEditable = false,
  theme,
  onUpdate,
}) => {
  const isOffset = index === 1; // Card 2 is offset

  return (
    <div
      className={`relative flex h-auto min-h-[240px] w-full flex-col items-start justify-start rounded-[20px] bg-white p-10 shadow-[0px_0px_60px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-2 md:w-[410px] ${isOffset ? "cursor-pointer lg:mt-[40px]" : ""} `}
    >
      {/* Number */}
      <div className="mb-4">
        <span
          className="text-[50px] leading-[60px] font-bold select-none"
          style={{
            WebkitTextStroke: `2px ${theme.colors.primary}`,
            WebkitTextFillColor: "transparent",
            color: "transparent",
            fontFamily: theme.fonts.heading,
          }}
        >
          {card.number}
        </span>
      </div>

      {/* Title */}
      <h3
        className="mb-4 text-[22px] leading-[30px] font-bold"
        style={{
          color: theme.colors.text,
          fontFamily: theme.fonts.heading,
        }}
      >
        <EditableText
          value={card.title}
          onChange={value => onUpdate(index, "title", value)}
          as="span"
          isEditable={isEditable}
          placeholder="Card Title"
        />
      </h3>

      {/* Description */}
      <p
        className="text-[16px] leading-[30px] font-normal"
        style={{
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
        }}
      >
        <EditableText
          value={card.description}
          onChange={value => onUpdate(index, "description", value)}
          as="span"
          isEditable={isEditable}
          placeholder="Card Description"
          multiline
        />
      </p>
    </div>
  );
};

// Process Header Component
interface ProcessHeaderProps {
  sectionTag: string;
  title: string;
  isEditable?: boolean;
  theme: {
    colors: {
      text: string;
      primary: string;
    };
    fonts: {
      body: string;
      heading: string;
    };
  };
  onSectionTagUpdate: (value: string) => void;
  onTitleUpdate: (value: string) => void;
}

const ProcessHeader: React.FC<ProcessHeaderProps> = ({
  sectionTag,
  title,
  isEditable = false,
  theme,
  onSectionTagUpdate,
  onTitleUpdate,
}) => {
  return (
    <div className="relative z-10 mb-16 flex flex-col items-center justify-center text-center">
      {/* Subtitle / Tag */}
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-5 w-5 items-center justify-center">
          <FileText
            className="h-5 w-5"
            style={{ color: theme.colors.primary }}
            strokeWidth={2}
          />
        </div>
        <span
          className="text-[14px] leading-[14px] font-semibold tracking-[0.1em] uppercase"
          style={{
            color: theme.colors.primary,
            fontFamily: theme.fonts.body,
          }}
        >
          <EditableText
            value={sectionTag}
            onChange={onSectionTagUpdate}
            as="span"
            isEditable={isEditable}
            placeholder="Process Overview"
          />
        </span>
      </div>

      {/* Main Title */}
      <h2
        className="max-w-[630px] text-[40px] leading-[1.2] font-bold md:text-[50px]"
        style={{
          color: theme.colors.text,
          fontFamily: theme.fonts.heading,
        }}
      >
        <EditableText
          value={title}
          onChange={onTitleUpdate}
          as="span"
          isEditable={isEditable}
          placeholder="Unforgettable Getaways Escaping Routine"
          multiline
        />
      </h2>
    </div>
  );
};

// Main Banner Template Component
export const BannerTemplate5: React.FC<BannerTemplateProps> = ({
  bannerData,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(bannerData);
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#034833",
          primary: "#034833",
          primaryForeground: "#FFFFFF",
          secondary: "#F59E0B",
          secondaryForeground: "#1F2937",
          background: "#FFFFFF",
        },
        fonts: {
          body: "Plus Jakarta Sans",
          heading: "Plus Jakarta Sans",
        },
      },
    [themeResponse]
  );

  // Parse cards data from bannerData
  // We'll store cards as JSON string in subtitle or use a custom approach
  const defaultCards: ProcessCardData[] = [
    {
      id: 1,
      number: "01",
      title: "Visa Voyage Agency",
      description: "Lorem Ipsum is simply dummy text the printing and typeser",
    },
    {
      id: 2,
      number: "02",
      title: "International Access Visas",
      description: "Lorem Ipsum is simply dummy text the printing and typeser",
    },
    {
      id: 3,
      number: "03",
      title: "Gateway to Global Citizenship",
      description: "Lorem Ipsum is simply dummy text the printing and typeser",
    },
  ];

  // Parse cards from data - store as JSON in a custom field or use images metadata
  // For now, we'll use a simple approach: store in subtitle as JSON or use default
  const parseCards = (dataToParse: BannerData): ProcessCardData[] => {
    try {
      // Try to parse from a custom field stored in images metadata
      const firstImage = dataToParse.images?.[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (firstImage && (firstImage as any).cardsData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return JSON.parse((firstImage as any).cardsData);
      }
      // Fallback: try parsing from subtitle if it's JSON
      if (dataToParse.subtitle && dataToParse.subtitle.startsWith("[")) {
        return JSON.parse(dataToParse.subtitle);
      }
    } catch (e) {
      // If parsing fails, use default
    }
    return defaultCards;
  };

  const [cards, setCards] = useState<ProcessCardData[]>(() =>
    parseCards(bannerData)
  );

  // Sync cards when bannerData changes
  useEffect(() => {
    setData(bannerData);
    const parsedCards = parseCards(bannerData);
    setCards(parsedCards);
  }, [bannerData]);

  // Save cards to data
  const saveCards = (updatedCards: ProcessCardData[]) => {
    setCards(updatedCards);
    // Store cards data in first image's metadata
    const updatedImages = [...(data.images || [])];
    if (updatedImages.length === 0) {
      updatedImages.push({
        id: 1,
        image: "",
        image_alt_description: "",
        link: "",
        is_active: true,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updatedImages[0] as any).cardsData = JSON.stringify(updatedCards);
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  // Handle section tag update
  const handleSectionTagUpdate = (value: string) => {
    // Don't overwrite if it's JSON cards data
    if (!value.startsWith("[")) {
      const updatedData = { ...data, subtitle: value };
      setData(updatedData);
      onUpdate?.({ subtitle: value });
    }
  };

  // Handle title update
  const handleTitleUpdate = (value: string) => {
    const updatedData = { ...data, title: value };
    setData(updatedData);
    onUpdate?.({ title: value });
  };

  // Handle card update
  const handleCardUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    saveCards(updatedCards);
  };

  // Get section tag and title
  const sectionTag =
    data.subtitle && !data.subtitle.startsWith("[")
      ? data.subtitle
      : "Process Overview";
  const title = data.title || "Unforgettable Getaways Escaping Routine";

  return (
    <section className="relative mx-auto mt-8 w-full max-w-7xl overflow-hidden rounded-[50px] border border-gray-200">
      {/* Decorative Background Layer */}
      <BackgroundPattern color={theme.colors.primary} />

      {/* Content Container */}
      <div className="relative z-10 w-full px-4 py-20 md:px-[60px]">
        <ProcessHeader
          sectionTag={sectionTag}
          title={title}
          isEditable={isEditable}
          theme={theme}
          onSectionTagUpdate={handleSectionTagUpdate}
          onTitleUpdate={handleTitleUpdate}
        />

        {/* Cards Layout */}
        <div className="flex flex-col items-start justify-center gap-8 lg:flex-row lg:gap-[30px]">
          {cards.map((card, index) => (
            <ProcessCard
              key={card.id}
              card={card}
              index={index}
              isEditable={isEditable}
              theme={theme}
              onUpdate={handleCardUpdate}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
