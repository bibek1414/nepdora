"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  OthersTemplate22Data,
  OthersTemplate22Step,
} from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersTemplate22Props {
  othersData: OthersTemplate22Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate22Data>) => void;
}

export const OthersTemplate22: React.FC<OthersTemplate22Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      primaryForeground: "#ffffff",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  };

  const handleUpdate = (field: keyof OthersTemplate22Data) => (value: any) => {
    onUpdate?.({ [field]: value });
  };

  const handleStepUpdate = (index: number, field: string) => (value: any) => {
    const newSteps = [...othersData.steps];
    if (field === "image") {
      newSteps[index] = {
        ...newSteps[index],
        image: { ...newSteps[index].image, ...value },
      };
    } else {
      newSteps[index] = {
        ...newSteps[index],
        [field as keyof OthersTemplate22Step]: value,
      };
    }
    onUpdate?.({ steps: newSteps });
  };

  return (
    <section className="px-4 py-20 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 text-left md:flex-row md:items-end">
          <EditableText
            as="h2"
            value={othersData.heading}
            onChange={handleUpdate("heading")}
            isEditable={isEditable}
            className="text-4xl leading-[1.1] font-bold tracking-tight whitespace-pre-wrap md:text-6xl"
            style={{ fontFamily: theme.fonts.heading }}
            multiline
          />
          <EditableText
            as="p"
            value={othersData.description}
            onChange={handleUpdate("description")}
            isEditable={isEditable}
            className="max-w-md text-lg leading-relaxed text-gray-600"
            style={{ fontFamily: theme.fonts.body }}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {othersData.steps.map((step, index) => (
            <StepCard
              key={step.id || index}
              step={step}
              index={index}
              isEditable={isEditable}
              onUpdate={(field: string, value: any) =>
                handleStepUpdate(index, field)(value)
              }
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface StepCardProps {
  step: OthersTemplate22Step;
  index: number;
  isEditable: boolean;
  onUpdate: (field: string, value: any) => void;
  theme: any;
}

const StepCard = ({
  step,
  index,
  isEditable,
  onUpdate,
  theme,
}: StepCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine styles based on index to fulfill user request:
  // index 0: Gray background (#f7f7f7)
  // index 1: Primary color
  // index 2: Secondary color
  const getStyles = () => {
    switch (index % 3) {
      case 0:
        return {
          bgColor: "#f7f7f7",
          textColor: "text-gray-950",
          style: { backgroundColor: "#f7f7f7" },
        };
      case 1:
        return {
          bgColor: theme.colors.primary,
          textColor: "", // Color set via style prop
          style: {
            backgroundColor: theme.colors.primary,
            color: theme.colors.primaryForeground || "#ffffff",
          },
        };
      case 2:
        return {
          bgColor: theme.colors.secondary,
          textColor: "", // Color set via style prop
          style: {
            backgroundColor: theme.colors.secondary,
            color: theme.colors.secondaryForeground || "#ffffff",
          },
        };
      default:
        return {
          bgColor: "#f7f7f7",
          textColor: "text-gray-950",
          style: { backgroundColor: "#f7f7f7" },
        };
    }
  };

  const activeStyle = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="-sm relative flex min-h-[620px] cursor-pointer flex-col justify-between overflow-hidden rounded-[2.5rem] border border-transparent p-10 transition-all duration-300"
      style={activeStyle.style}
    >
      <div>
        <div
          className={`mb-6 flex items-baseline gap-2 ${activeStyle.textColor}`}
        >
          <span className="text-xl font-semibold">{step.number}.</span>
          <EditableText
            as="span"
            value={step.title}
            onChange={(val: string) => onUpdate("title", val)}
            isEditable={isEditable}
            className="text-xl font-semibold"
          />
        </div>
        <EditableText
          as="p"
          value={step.description}
          onChange={(val: string) => onUpdate("description", val)}
          isEditable={isEditable}
          className={`text-lg leading-relaxed ${activeStyle.textColor} opacity-80`}
          style={{ fontFamily: theme.fonts.body }}
        />
      </div>

      <div
        className={`-md relative mt-12 h-80 overflow-hidden rounded-2xl transition-transform duration-500 ease-out ${
          isHovered ? "scale-105" : "scale-100"
        }`}
      >
        <EditableImage
          src={step.image.url}
          alt={step.image.alt}
          onImageChange={(url: string) => onUpdate("image", { url })}
          onAltChange={(alt: string) => onUpdate("image", { alt })}
          isEditable={isEditable}
          className="h-full w-full object-cover"
        />
      </div>
    </motion.div>
  );
};
