"use client";

import React, { useState } from "react";
import { AboutUs4Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";

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
  const [data, setData] = useState(aboutUsData);

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs4Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs4Data>);
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

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
          {/* Text Content */}
          <div className="text-center lg:col-span-6 lg:text-left">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="p"
              className="text-base leading-7 font-semibold text-blue-600"
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

          {/* Image */}
          <div className="relative mt-16 sm:mt-24 lg:col-span-6 lg:mt-0">
            <EditableImage
              src={data.imageUrl}
              alt={data.imageAlt}
              onImageChange={handleImageUpdate}
              onAltChange={handleAltUpdate}
              isEditable={isEditable}
              className="relative mx-auto w-full max-w-xl overflow-hidden rounded-xl lg:max-w-none"
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
      </div>
    </section>
  );
};
