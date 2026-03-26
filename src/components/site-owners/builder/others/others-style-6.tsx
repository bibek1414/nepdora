"use client";

import React, { useMemo } from "react";
import { FileText } from "lucide-react";
import {
  OthersTemplate6Data,
  OthersProcessCard,
} from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface OthersTemplate6Props {
  othersData: OthersTemplate6Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate6Data>) => void;
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
  card: OthersProcessCard;
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
  const isOffset = index === 1;

  return (
    <div
      className={`relative flex h-auto min-h-[240px] w-full flex-col items-start justify-start rounded-[20px] bg-white p-10 shadow-[0px_0px_60px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-2 md:w-[410px] ${isOffset ? "cursor-pointer lg:mt-[40px]" : ""} `}
    >
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
      <h3 className="mb-4 text-[22px] leading-[30px] font-bold">
        <EditableText
          value={card.title}
          onChange={value => onUpdate(index, "title", value)}
          as="span"
          isEditable={isEditable}
          placeholder="Card Title"
        />
      </h3>
      <p className="text-[16px] leading-[30px] font-normal">
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
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-5 w-5 items-center justify-center">
          <FileText
            className="h-5 w-5"
            style={{ color: theme.colors.primary }}
            strokeWidth={2}
          />
        </div>
        <span
          className="text-[14px] leading-[14px] font-semibold tracking-widest uppercase"
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
      <h2 className="max-w-[630px] text-[40px] leading-[1.2] font-bold md:text-[50px]">
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

// Main Others Template Component
export const OthersTemplate6: React.FC<OthersTemplate6Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();

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

  const { data, handleTextUpdate, handleArrayItemUpdate } = useBuilderLogic(
    othersData,
    onUpdate
  );

  // Default cards data for template 6
  const defaultCards: OthersProcessCard[] = [
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

  // Get process cards - now directly from processCards property
  const getProcessCards = (
    dataToParse: OthersTemplate6Data
  ): OthersProcessCard[] => {
    // First check if processCards exists and has data
    if (dataToParse.processCards && dataToParse.processCards.length > 0) {
      return dataToParse.processCards;
    }

    // Fallback: try to parse from images for backward compatibility
    try {
      if (dataToParse.images && dataToParse.images.length > 0) {
        const firstImage = dataToParse.images[0];
        if (
          firstImage &&
          typeof firstImage === "object" &&
          "cardsData" in firstImage &&
          firstImage.cardsData
        ) {
          return JSON.parse(firstImage.cardsData as string);
        }
      }

      // Fallback: check if subtitle contains JSON array
      if (dataToParse.subtitle && dataToParse.subtitle.startsWith("[")) {
        return JSON.parse(dataToParse.subtitle);
      }
    } catch (e) {
      console.error("Error parsing cards data from legacy format:", e);
    }

    // Return default cards if no data found
    return defaultCards;
  };

  const processCards = getProcessCards(data);

  // Handle section tag update (subtitle)
  const handleSectionTagUpdate = (value: string) => {
    if (!value.startsWith("[")) {
      handleTextUpdate("subtitle")(value);
    }
  };

  // Handle title update
  const handleTitleUpdate = (value: string) => {
    handleTextUpdate("title")(value);
  };

  // Handle card update - now update processCards directly
  const handleCardUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedCards = [...processCards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };

    // Update directly in the data using processCards property
    if (onUpdate) {
      onUpdate({ processCards: updatedCards });
    }
  };

  // Get section tag (subtitle) and title
  const sectionTag =
    data.subtitle && !data.subtitle.startsWith("[")
      ? data.subtitle
      : "Process Overview";
  const title = data.title || "Unforgettable Getaways Escaping Routine";

  return (
    <section className="relative mx-auto mt-8 w-full max-w-7xl overflow-hidden rounded-[50px] border border-gray-200">
      <BackgroundPattern color={theme.colors.primary} />
      <div className="relative z-10 w-full px-4 py-20 md:px-[60px]">
        <ProcessHeader
          sectionTag={sectionTag}
          title={title}
          isEditable={isEditable}
          theme={theme}
          onSectionTagUpdate={handleSectionTagUpdate}
          onTitleUpdate={handleTitleUpdate}
        />
        <div className="flex flex-col items-start justify-center gap-8 lg:flex-row lg:gap-[30px]">
          {processCards.map((card, index) => (
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
