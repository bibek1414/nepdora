"use client";

import React, { useState } from "react";
import { AboutUs8Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";

interface AboutUsTemplate8Props {
  aboutUsData: AboutUs8Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs8Data>) => void;
}

export const AboutUsTemplate8: React.FC<AboutUsTemplate8Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(aboutUsData);

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs8Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs8Data>);
  };

  // Handle feature updates
  const handleFeatureUpdate =
    (featureId: string, field: "name" | "description") => (value: string) => {
      const updatedFeatures = data.features.map(feature =>
        feature.id === featureId ? { ...feature, [field]: value } : feature
      );
      const updatedData = { ...data, features: updatedFeatures };
      setData(updatedData);
      onUpdate?.({ features: updatedFeatures });
    };

  // Handle image updates
  const handleImageUpdate =
    (imageId: string) => (imageUrl: string, altText?: string) => {
      const updatedImages = data.images.map(image =>
        image.id === imageId
          ? { ...image, url: imageUrl, alt: altText || image.alt }
          : image
      );
      const updatedData = { ...data, images: updatedImages };
      setData(updatedData);
      onUpdate?.({ images: updatedImages });
    };

  // Handle alt text updates
  const handleAltUpdate = (imageId: string) => (altText: string) => {
    const updatedImages = data.images.map(image =>
      image.id === imageId ? { ...image, alt: altText } : image
    );
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            className="mt-4 text-gray-500"
            isEditable={isEditable}
            placeholder="Enter description..."
            multiline={true}
          />

          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            {data.features.map(feature => (
              <div key={feature.id} className="border-t border-gray-200 pt-4">
                <EditableText
                  value={feature.name}
                  onChange={handleFeatureUpdate(feature.id, "name")}
                  as="div"
                  className="font-medium text-gray-900"
                  isEditable={isEditable}
                  placeholder="Enter feature name..."
                />
                <EditableText
                  value={feature.description}
                  onChange={handleFeatureUpdate(feature.id, "description")}
                  as="div"
                  className="mt-2 text-sm text-gray-500"
                  isEditable={isEditable}
                  placeholder="Enter feature description..."
                  multiline={true}
                />
              </div>
            ))}
          </dl>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
          {data.images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100"
            >
              <EditableImage
                src={image.url}
                alt={image.alt}
                onImageChange={handleImageUpdate(image.id)}
                onAltChange={handleAltUpdate(image.id)}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={600}
                height={600}
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 600,
                  height: 600,
                  text: `Upload image ${index + 1}`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
