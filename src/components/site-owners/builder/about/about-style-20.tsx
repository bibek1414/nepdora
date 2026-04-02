"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { AboutUs20Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { hexToRgba } from "@/lib/utils";

interface AboutUsTemplate20Props {
  aboutUsData: AboutUs20Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs20Data>) => void;
}

export const AboutUsTemplate20: React.FC<AboutUsTemplate20Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
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

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleArrayItemUpdate,
    handleMultipleUpdate,
  } = useBuilderLogic(aboutUsData, onUpdate);

  return (
    <section className="relative w-full pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 text-center">
          <div
            className="mb-6 inline-flex cursor-default items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wider"
            style={{
              backgroundColor: hexToRgba(theme.colors.primary, 0.1),
              color: theme.colors.primary,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <EditableText
              value={data.badge}
              onChange={handleTextUpdate("badge")}
              isEditable={isEditable}
            />
          </div>
          <EditableText
            as="h2"
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            style={{ fontFamily: theme.fonts.heading }}
            className="mx-auto max-w-3xl text-center text-4xl leading-tight font-bold tracking-tight text-gray-950 md:text-6xl"
          />
        </div>

        {/* Sticky Scroll Items */}
        <div className="space-y-0">
          {data.items.map((item, index) => (
            <div
              key={item.id}
              className="sticky"
              style={{
                top: `${120}px`, // stacking offset
                zIndex: 2, // proper layering
                height: `${80}vh`,
              }}
            >
              <div className="cursor-default rounded-[40px] bg-gray-100 transition-all duration-300">
                <div className="flex min-h-[500px] flex-col md:flex-row">
                  {/* Text Content */}
                  <div className="flex flex-1 flex-col justify-between p-10 md:p-16 lg:p-20">
                    <div>
                      <EditableText
                        as="span"
                        value={item.number}
                        onChange={val =>
                          handleArrayItemUpdate(
                            "items",
                            item.id
                          )({
                            number: val,
                          })
                        }
                        isEditable={isEditable}
                        className="mb-12 block text-4xl font-bold tracking-tight text-gray-950 opacity-20"
                        style={{ fontFamily: theme.fonts.heading }}
                      />
                      <EditableText
                        as="h3"
                        value={item.title}
                        onChange={val =>
                          handleArrayItemUpdate(
                            "items",
                            item.id
                          )({
                            title: val,
                          })
                        }
                        isEditable={isEditable}
                        style={{ fontFamily: theme.fonts.heading }}
                        className="mb-8 text-3xl leading-tight font-bold text-gray-950 md:text-4xl"
                      />
                      <EditableText
                        as="p"
                        value={item.description}
                        onChange={val =>
                          handleArrayItemUpdate(
                            "items",
                            item.id
                          )({
                            description: val,
                          })
                        }
                        isEditable={isEditable}
                        className="max-w-md text-[17px] leading-relaxed text-gray-600"
                      />
                    </div>

                    <div className="mt-12">
                      <EditableLink
                        text={item.buttonText}
                        href={item.buttonLink}
                        isEditable={isEditable}
                        onChange={(text, href) =>
                          handleArrayItemUpdate(
                            "items",
                            item.id
                          )({ buttonText: text, buttonLink: href })
                        }
                        className="group inline-flex cursor-pointer items-center gap-3 rounded-full px-8 py-4 text-[15px] font-bold transition-all duration-200"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.primaryForeground,
                        }}
                      >
                        {item.buttonText}
                        <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </EditableLink>
                    </div>
                  </div>

                  {/* Image Content */}
                  <div className="relative min-h-[350px] flex-1 p-6 md:p-8 lg:p-10">
                    <div className="-hidden relative h-full w-full rounded-[30px]">
                      <EditableImage
                        src={item.image}
                        alt={item.title}
                        isEditable={isEditable}
                        onImageChange={url =>
                          handleArrayItemUpdate(
                            "items",
                            item.id
                          )({ image: url })
                        }
                        className="h-full w-full rounded-2xl object-cover transition-transform duration-700 hover:scale-105"
                        width={800}
                        height={600}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
