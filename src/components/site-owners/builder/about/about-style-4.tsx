"use client";

import React from "react";
import { AboutUs4Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate4Props {
  aboutUsData: AboutUs4Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs4Data>) => void;
}

export const AboutUsTemplate4: React.FC<AboutUsTemplate4Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleTextUpdate, handleImageUpdate, handleAltUpdate } =
    useBuilderLogic(aboutUsData, onUpdate);

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
          <div className="relative order-2 mt-16 sm:mt-24 lg:order-1 lg:col-span-6 lg:mt-0">
            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-xl shadow-xl lg:max-w-none">
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt}
                onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                onAltChange={handleAltUpdate("imageAlt")}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={700}
                height={500}
                priority
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 700,
                  height: 500,
                  text: "Upload your about us image",
                }}
              />
            </div>
          </div>

          {/* Text on the right */}
          <div className="mb-12 text-left lg:order-2 lg:col-span-6 lg:mb-0">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="p"
              className="text-primary text-base leading-7 font-semibold"
              isEditable={isEditable}
              placeholder="Enter section title..."
            />

            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              as="h2"
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              isEditable={isEditable}
              placeholder="Enter main heading..."
            />

            <EditableText
              value={data.subSubtitle}
              onChange={handleTextUpdate("subSubtitle")}
              as="p"
              className="mt-6 text-lg leading-8 text-gray-600"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
