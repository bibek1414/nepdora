"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, CheckSquare, Send } from "lucide-react";
import { AboutUs18Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate18Props {
  aboutUsData: AboutUs18Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs18Data>) => void;
  siteUser?: string;
}

export function AboutUsTemplate18({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}: AboutUsTemplate18Props) {
  const [data, setData] = useState(aboutUsData);
  const { data: themeResponse } = useThemeQuery();

  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#0F172A",
          primary: "#84cc16",
          primaryForeground: "#FFFFFF",
          secondary: "#F59E0B",
          secondaryForeground: "#1F2937",
          background: "#FFFFFF",
        },
        fonts: {
          body: "Inter",
          heading: "Poppins",
        },
      },
    [themeResponse]
  );

  const handleTextUpdate = (field: keyof AboutUs18Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs18Data>);
  };

  const handleMainImageUpdate = (url: string) => {
    const updatedData = { ...data, mainImageUrl: url };
    setData(updatedData);
    onUpdate?.({ mainImageUrl: url });
  };

  const handleSecondaryImageUpdate = (url: string) => {
    const updatedData = { ...data, secondaryImageUrl: url };
    setData(updatedData);
    onUpdate?.({ secondaryImageUrl: url });
  };

  const handleButtonLinkUpdate = (text: string, href: string) => {
    const updatedData = { ...data, buttonText: text, buttonLink: href };
    setData(updatedData);
    onUpdate?.({ buttonText: text, buttonLink: href });
  };

  const handleFeatureUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedFeatures = [...data.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value,
    };
    const updatedData = { ...data, features: updatedFeatures };
    setData(updatedData);
    onUpdate?.({ features: updatedFeatures });
  };

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* LEFT COLUMN — Enhanced Image Composition */}
        <div className="relative h-[600px] w-full select-none lg:h-[700px]">
          {/* MAIN IMAGE */}
          <div
            className="absolute top-0 left-0 z-10 h-[55%] w-[65%] overflow-hidden rounded-2xl shadow-xl"
            style={{
              clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)",
              backgroundColor: "#00000010",
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/10 to-black/0" />
            <div className="absolute inset-0">
              <EditableImage
                src={data.mainImageUrl}
                alt={data.mainImageAlt}
                onImageChange={handleMainImageUpdate}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={600}
                height={900}
              />
            </div>
          </div>

          {/* SECONDARY IMAGE */}
          <div
            className="absolute right-4 bottom-0 z-20 h-[50%] w-[55%] overflow-hidden rounded-xl shadow-2xl"
            style={{
              clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
              backgroundColor: "#00000010",
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-10 bg-white/10 backdrop-blur-[1px]" />
            <div className="absolute inset-0">
              <EditableImage
                src={data.secondaryImageUrl}
                alt={data.secondaryImageAlt}
                onImageChange={handleSecondaryImageUpdate}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={600}
                height={600}
              />
            </div>
          </div>

          {/* DOT PATTERN */}
          <div
            className="absolute top-16 right-0 -z-0 h-64 w-64 opacity-70"
            style={{
              transform: "translate(30%, -20%)",
              backgroundImage: `radial-gradient(circle, ${theme.colors.primary}55 2px, transparent 2px)`,
              backgroundSize: "18px 18px",
            }}
          />

          {/* EXPERIENCE BADGE */}
          <div
            className="absolute bottom-20 left-10 z-30 flex h-44 w-44 flex-col items-center justify-center rounded-3xl border-[6px] text-white shadow-2xl lg:h-52 lg:w-52"
            style={{
              backgroundColor: theme.colors.primary,
              borderColor: "rgba(255,255,255,0.7)",
              boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
            }}
          >
            <EditableText
              value={data.experienceYears}
              onChange={handleTextUpdate("experienceYears")}
              as="span"
              isEditable={isEditable}
              placeholder="10+"
              className="text-center text-5xl font-bold lg:text-6xl"
              style={{ fontFamily: theme.fonts.heading }}
            />
            <span className="mt-1 max-w-[80%] text-center text-sm leading-tight font-medium lg:text-base">
              years of
              <br />
              experiences
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN — Content */}
        <div className="flex flex-col space-y-8 pr-4">
          {/* Subheader */}
          <div className="flex items-center gap-2 text-sm font-bold tracking-widest text-green-800 uppercase">
            <EditableText
              value={data.sectionTag}
              onChange={handleTextUpdate("sectionTag")}
              as="span"
              isEditable={isEditable}
              placeholder="About Us"
            />
            <Send
              className="-rotate-45 fill-current"
              size={16}
              style={{ color: theme.colors.primary }}
            />
          </div>

          {/* Headings */}
          <div
            className="flex flex-col"
            style={{ fontFamily: theme.fonts.heading }}
          >
            <EditableText
              value={data.headline}
              onChange={handleTextUpdate("headline")}
              as="h1"
              isEditable={isEditable}
              placeholder="Unknown Wanderlust"
              className="text-4xl leading-tight font-extrabold lg:text-5xl"
              style={{ color: theme.colors.text }}
              useHeadingFont
            />
            <EditableText
              value={data.subheadline}
              onChange={handleTextUpdate("subheadline")}
              as="h2"
              isEditable={isEditable}
              placeholder="Your Journey into"
              className="mt-2 text-4xl font-extrabold lg:text-5xl"
              style={{ color: theme.colors.primary }}
              useHeadingFont
            />
          </div>

          {/* Description */}
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            isEditable={isEditable}
            placeholder="Enter description..."
            multiline
            className="text-lg leading-relaxed text-gray-500"
          />

          {/* Features */}
          <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
            {data.features.map((feature, idx) => (
              <div key={feature.id} className="flex flex-col space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="rounded p-0.5 text-white"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <CheckSquare
                      className="h-5 w-5"
                      style={{ fill: "white", color: theme.colors.primary }}
                    />
                  </div>
                  <EditableText
                    value={feature.title}
                    onChange={value => handleFeatureUpdate(idx, "title", value)}
                    as="h3"
                    isEditable={isEditable}
                    placeholder="Feature Title"
                    className="text-lg font-bold"
                    style={{ color: `${theme.colors.primary}E6` }}
                  />
                </div>
                <EditableText
                  value={feature.description}
                  onChange={value =>
                    handleFeatureUpdate(idx, "description", value)
                  }
                  as="p"
                  isEditable={isEditable}
                  placeholder="Feature description..."
                  multiline
                  className="text-sm leading-relaxed text-gray-500"
                />
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="pt-6">
            <EditableLink
              text={data.buttonText}
              href={data.buttonLink || "#"}
              onChange={handleButtonLinkUpdate}
              isEditable={isEditable}
              siteUser={siteUser}
              className="group flex items-center gap-3 rounded-full px-10 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                backgroundColor: theme.colors.primary,
                fontFamily: theme.fonts.body,
              }}
              textPlaceholder="Read More"
              hrefPlaceholder="#"
            >
              <>
                <span>{data.buttonText || "Read More"}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            </EditableLink>
          </div>
        </div>
      </div>
    </section>
  );
}
