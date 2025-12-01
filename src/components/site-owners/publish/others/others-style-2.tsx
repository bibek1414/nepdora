"use client";

import React, { useState, useEffect } from "react";
import { OthersTemplate2Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/publish/editable-link";
import { Globe, ArrowRight } from "lucide-react";

interface OthersTemplate2Props {
  othersData: OthersTemplate2Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate2Data>) => void;
}

export const OthersTemplate2: React.FC<OthersTemplate2Props> = ({
  othersData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(othersData);
  const { data: themeResponse } = useThemeQuery();

  useEffect(() => {
    setData(othersData);
  }, [othersData]);

  const theme = themeResponse?.data?.[0]?.data?.theme || {
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
  };

  const handleUpdate = (newData: Partial<OthersTemplate2Data>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    if (onUpdate) {
      onUpdate(updatedData);
    }
  };

  const handleStatUpdate = (
    index: number,
    field: "value" | "label",
    value: string
  ) => {
    const newStats = [...data.statistics];
    newStats[index] = { ...newStats[index], [field]: value };
    handleUpdate({ statistics: newStats });
  };

  // Default images for the gray areas
  const defaultLeftImage =
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2874&auto=format&fit=crop";
  const defaultRightImage =
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop";

  return (
    <section
      className="relative w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8"
      style={{
        backgroundColor:
          data.backgroundType === "color"
            ? data.backgroundColor
            : theme.colors.background,
        backgroundImage:
          data.backgroundType === "image"
            ? `url(${data.backgroundImageUrl})`
            : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column - Large Image */}
          <div className="lg:col-span-5">
            <div className="relative h-auto min-h-[600px] w-full">
              <EditableImage
                src={data.leftImage?.url || defaultLeftImage}
                alt={data.leftImage?.alt || "Team collaboration"}
                isEditable={isEditable}
                onImageChange={(url, alt) =>
                  handleUpdate({
                    leftImage: { url, alt: alt || data.leftImage.alt },
                  })
                }
                className="h-150 w-full rounded-[2.5rem] object-cover"
                cloudinaryOptions={{
                  folder: "template-images",
                  resourceType: "image",
                }}
                disableImageChange={false}
                showAltEditor={isEditable}
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col justify-between gap-8 lg:col-span-7">
            {/* Top Section: Text + Small Image */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Text Content */}
              <div className="flex flex-col justify-center">
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#84CC16" }}
                  >
                    <Globe className="h-10 w-10 text-white" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Heading */}
                <EditableText
                  value={data.heading || "Get our best offers quickly"}
                  onChange={val => handleUpdate({ heading: val })}
                  isEditable={isEditable}
                  as="h2"
                  className="mb-4 text-2xl leading-tight font-bold md:text-3xl lg:text-4xl"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: "#064E3B",
                  }}
                />

                {/* Description */}
                <EditableText
                  value={
                    data.description ||
                    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy"
                  }
                  onChange={val => handleUpdate({ description: val })}
                  isEditable={isEditable}
                  className="mb-8 text-sm text-gray-500 md:text-base"
                />

                {/* Button */}
                {data.buttons.length > 0 && (
                  <div>
                    <EditableLink
                      text={data.buttons[0].text || "Contact us"}
                      href={data.buttons[0].href || "#"}
                      isEditable={isEditable}
                      siteUser={siteUser}
                      onChange={(text, href) => {
                        const newButtons = [...data.buttons];
                        newButtons[0] = { ...newButtons[0], text, href };
                        handleUpdate({ buttons: newButtons });
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-all hover:bg-gray-50"
                      style={{
                        borderColor: "#E5E7EB",
                        color: "#064E3B",
                        backgroundColor: "white",
                      }}
                    >
                      {data.buttons[0].text || "Contact us"}
                      <ArrowRight className="h-4 w-4" />
                    </EditableLink>
                  </div>
                )}
              </div>

              {/* Right Small Image */}
              <div
                className="relative h-auto min-h-[300px]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)",
                }}
              >
                <EditableImage
                  src={data.rightImage?.url || defaultRightImage}
                  alt={data.rightImage?.alt || "Business meeting"}
                  isEditable={isEditable}
                  onImageChange={(url, alt) =>
                    handleUpdate({
                      rightImage: { url, alt: alt || data.rightImage.alt },
                    })
                  }
                  className="h-85 w-full rounded-[2.5rem] object-cover"
                  cloudinaryOptions={{
                    folder: "template-images",
                    resourceType: "image",
                  }}
                  disableImageChange={false}
                  showAltEditor={isEditable}
                />
              </div>
            </div>

            {/* Bottom Section: Statistics */}
            <div
              className="rounded-[2.5rem] px-8 py-10 shadow-sm"
              style={{ backgroundColor: "#84CC16" }}
            >
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {data.statistics.map((stat, index) => (
                  <div key={stat.id} className="text-center">
                    <EditableText
                      value={
                        stat.value ||
                        (index === 0
                          ? "10k+"
                          : index === 1
                            ? "20+"
                            : index === 2
                              ? "5k+"
                              : "100+")
                      }
                      onChange={val => handleStatUpdate(index, "value", val)}
                      isEditable={isEditable}
                      as="h2"
                      className="mb-1 text-3xl leading-none font-bold md:text-4xl lg:text-5xl"
                      style={{ color: "#FFFFFF" }}
                    />
                    <EditableText
                      value={
                        stat.label ||
                        (index === 0
                          ? "Complete project"
                          : index === 1
                            ? "Team member"
                            : index === 2
                              ? "Winning award"
                              : "Complete project")
                      }
                      onChange={val => handleStatUpdate(index, "label", val)}
                      isEditable={isEditable}
                      as="p"
                      className="!text-xs font-medium md:text-sm"
                      style={{ color: "#FFFFFF", opacity: 0.9 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
