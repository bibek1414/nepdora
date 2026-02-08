"use client";

import React from "react";
import { AboutUs5Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate5Props {
  aboutUsData: AboutUs5Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs5Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate5: React.FC<AboutUsTemplate5Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#FFFFFF",
      primary: "#EF4444",
      primaryForeground: "#FFFFFF",
      secondary: "#9CA3AF",
      secondaryForeground: "#1F2937",
      background: "#111827",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleArrayItemUpdate,
  } = useBuilderLogic(aboutUsData, onUpdate);

  return (
    <div className="relative bg-gray-900 text-white">
      {/* Main Content Section */}
      <div className="bg-gray-900 py-20">
        <div className="mx-auto max-w-6xl px-4">
          {/* Section Tag */}
          <EditableText
            value={data.sectionTag}
            onChange={handleTextUpdate("sectionTag")}
            as="div"
            className="mb-6 text-xl tracking-widest uppercase"
            isEditable={isEditable}
            placeholder="Our Story"
          />

          {/* Main Content Grid */}
          <div className="mb-20 grid items-center gap-16 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <EditableText
                value={data.mainTitle}
                onChange={handleTextUpdate("mainTitle")}
                as="h2"
                className="mb-8 text-4xl leading-tight font-bold md:text-5xl"
                isEditable={isEditable}
                placeholder="Your Vision Our Expertise Your Success Get Noticed Generate Leads Dominate."
                multiline={true}
              />
            </div>

            {/* Right Content - Images */}
            <div className="grid grid-cols-2 gap-4">
              {/* Image 1 */}
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-gray-800">
                <div className="absolute top-4 right-4 z-50">
                  <span className="rounded-full bg-black/80 px-3 py-2 text-xs text-white backdrop-blur-sm">
                    <EditableText
                      value={data.image1Tag}
                      onChange={handleTextUpdate("image1Tag")}
                      as="span"
                      className="text-xs"
                      isEditable={isEditable}
                      placeholder="Tech Blog"
                    />
                  </span>
                </div>
                <EditableImage
                  src={data.image1Url}
                  alt={data.image1Alt}
                  onImageChange={handleImageUpdate("image1Url", "image1Alt")}
                  onAltChange={handleAltUpdate("image1Alt")}
                  isEditable={isEditable}
                  className="object-cover"
                  cloudinaryOptions={{
                    folder: "about-us-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 600,
                    height: 450,
                    text: "Upload image 1",
                  }}
                />
              </div>

              {/* Image 2 */}
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-gray-800">
                <div className="absolute top-4 right-4 z-50">
                  <span className="rounded-full bg-black/80 px-3 py-2 text-xs text-white backdrop-blur-sm">
                    <EditableText
                      value={data.image2Tag}
                      onChange={handleTextUpdate("image2Tag")}
                      as="span"
                      className="text-xs"
                      isEditable={isEditable}
                      placeholder="Trends"
                    />
                  </span>
                </div>
                <EditableImage
                  src={data.image2Url}
                  alt={data.image2Alt}
                  onImageChange={handleImageUpdate("image2Url", "image2Alt")}
                  onAltChange={handleAltUpdate("image2Alt")}
                  isEditable={isEditable}
                  className="object-cover"
                  cloudinaryOptions={{
                    folder: "about-us-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 600,
                    height: 450,
                    text: "Upload image 2",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Team Image */}
          <div className="relative mb-20 aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700">
            <EditableImage
              src={data.teamImageUrl}
              alt={data.teamImageAlt}
              onImageChange={handleImageUpdate("teamImageUrl", "teamImageAlt")}
              onAltChange={handleAltUpdate("teamImageAlt")}
              isEditable={isEditable}
              className="object-cover"
              cloudinaryOptions={{
                folder: "about-us-images",
                resourceType: "image",
              }}
              showAltEditor={isEditable}
              placeholder={{
                width: 800,
                height: 500,
                text: "Upload team image",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
