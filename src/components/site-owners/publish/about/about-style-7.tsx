"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AboutUs7Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/publish/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate7Props {
  aboutUsData: AboutUs7Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs7Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate7: React.FC<AboutUsTemplate7Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [data, setData] = useState(aboutUsData);
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#111827",
      primary: "#22C55E",
      primaryForeground: "#FFFFFF",
      secondary: "#6B7280",
      secondaryForeground: "#FFFFFF",
      background: "#FFFFFF",
      darkText: "#E5E7EB",
      darkBackground: "#111827",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs7Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs7Data>);
  };

  // Handle training item updates
  const handleTrainingUpdate =
    (index: number, field: "title" | "description") => (value: string) => {
      const updatedTrainings = [...data.trainings];
      updatedTrainings[index] = { ...updatedTrainings[index], [field]: value };

      const updatedData = { ...data, trainings: updatedTrainings };
      setData(updatedData);
      onUpdate?.({ trainings: updatedTrainings } as Partial<AboutUs7Data>);
    };

  // Handle training image updates
  const handleTrainingImageUpdate =
    (index: number) => (imageUrl: string, altText?: string) => {
      const updatedTrainings = [...data.trainings];
      updatedTrainings[index] = {
        ...updatedTrainings[index],
        imageUrl,
        imageAlt: altText || updatedTrainings[index].imageAlt,
      };

      const updatedData = { ...data, trainings: updatedTrainings };
      setData(updatedData);
      onUpdate?.({ trainings: updatedTrainings } as Partial<AboutUs7Data>);
    };

  // Handle training alt updates
  const handleTrainingAltUpdate = (index: number) => (altText: string) => {
    const updatedTrainings = [...data.trainings];
    updatedTrainings[index] = { ...updatedTrainings[index], imageAlt: altText };

    const updatedData = { ...data, trainings: updatedTrainings };
    setData(updatedData);
    onUpdate?.({ trainings: updatedTrainings } as Partial<AboutUs7Data>);
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
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen text-gray-800 dark:text-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <EditableText
            value={data.subtitle}
            onChange={handleTextUpdate("subtitle")}
            as="p"
            style={{
              color: theme.colors.primary,
            }}
            className="text-2xl font-bold"
            isEditable={isEditable}
            placeholder="What we do"
          />
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h1"
            style={{
              color: theme.colors.secondary,
              fontFamily: theme.fonts.heading,
            }}
            className="mt-2 text-3xl leading-tight font-bold tracking-tight md:text-5xl md:leading-snug"
            isEditable={isEditable}
            placeholder="Where athletes push their limits and train with purpose."
            multiline={true}
          />
        </div>

        {/* Training Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.trainings.map((training, idx) => (
            <div
              key={training.id}
              className="group relative h-96 overflow-hidden rounded-lg bg-cover bg-center"
            >
              <EditableImage
                src={training.imageUrl}
                alt={training.imageAlt}
                onImageChange={handleTrainingImageUpdate(idx)}
                onAltChange={handleTrainingAltUpdate(idx)}
                isEditable={isEditable}
                className="object-cover"
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 400,
                  height: 500,
                  text: "Upload training image",
                }}
              />
              <div className="bg-opacity-40 group-hover:bg-opacity-20 absolute inset-0 flex flex-col justify-end p-6 transition-all duration-300">
                <EditableText
                  value={training.title}
                  onChange={handleTrainingUpdate(idx, "title")}
                  as="h3"
                  className="text-xl font-bold text-white"
                  isEditable={isEditable}
                  placeholder="Training Title"
                />
                {training.description && (
                  <EditableText
                    value={training.description}
                    onChange={handleTrainingUpdate(idx, "description")}
                    as="p"
                    className="mt-2 text-sm text-gray-200"
                    isEditable={isEditable}
                    placeholder="Training description"
                    multiline={true}
                  />
                )}
              </div>
              <div className="absolute bottom-[-1.25rem] left-1/2 -translate-x-1/2"></div>
            </div>
          ))}
        </div>

        {/* Learn More Button */}
        <div className="mt-20 text-center">
          <EditableLink
            text={data.buttonText}
            href={data.buttonLink}
            onChange={handleButtonLinkUpdate}
            className="rounded-lg px-8 py-3 font-bold transition-transform duration-200 hover:scale-105"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
            isEditable={isEditable}
            textPlaceholder="Learn more"
            hrefPlaceholder="#learn-more"
            siteUser={siteUser}
          >
            {data.buttonText || "Learn more"}
          </EditableLink>
        </div>
      </div>
    </div>
  );
};
