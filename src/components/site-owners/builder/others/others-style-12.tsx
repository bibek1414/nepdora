"use client";

import React from "react";
import { motion } from "framer-motion";
import { OthersTemplate12Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { cn } from "@/lib/utils";

interface OthersTemplate12Props {
  othersData: OthersTemplate12Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate12Data>) => void;
}

export const OthersTemplate12: React.FC<OthersTemplate12Props> = ({
  othersData,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(othersData, onUpdate);

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const colors = theme?.colors || {
    primary: "#D67B61",
    primaryForeground: "#ffffff",
    secondary: "#1A1A1A",
  };

  const handleStepUpdate = (idx: number, field: string, value: string) => {
    const newSteps = [...(data.steps || [])];
    newSteps[idx] = { ...newSteps[idx], [field]: value };
    onUpdate?.({ steps: newSteps });
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-8 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="relative flex flex-col items-start gap-12 lg:flex-row">
            {/* Left Sticky Card */}
            <div className="lg:sticky lg:top-32 lg:w-[360px]">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-gray-50 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]"
              >
                <EditableText
                  value={data.heading}
                  onChange={handleTextUpdate("heading")}
                  isEditable={isEditable}
                  as="h2"
                  multiline
                  className="mb-8 font-serif text-3xl leading-tight font-medium text-[#1A1A1A]"
                  style={{
                    fontFamily: theme?.fonts?.heading || "inherit",
                  }}
                />
                <div className="mb-8">
                  <EditableLink
                    text={data.buttonText}
                    href={data.buttonLink}
                    isEditable={isEditable}
                    onChange={(text, href) =>
                      onUpdate?.({ buttonText: text, buttonLink: href })
                    }
                    className="w-full rounded-full py-4 text-center font-sans font-semibold text-white shadow-lg transition-all duration-500"
                    style={{
                      backgroundColor: colors.primary,
                    }}
                  >
                    {data.buttonText}
                  </EditableLink>
                </div>
                <div className="aspect-4/3 overflow-hidden rounded-2xl shadow-sm">
                  <EditableImage
                    src={data.image.url}
                    alt={data.image.alt}
                    onImageChange={img =>
                      onUpdate?.({ image: { ...data.image, url: img } })
                    }
                    isEditable={isEditable}
                    className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Scrollable Timeline */}
            <div className="relative flex-1">
              {/* Vertical Line */}
              <div className="absolute top-0 bottom-0 left-0 hidden w-px bg-gray-200 lg:-left-6 lg:block" />

              <div className="ml-auto w-full space-y-12 lg:max-w-[576px]">
                {data.steps.map((step, index) => (
                  <div key={step.id} className="relative flex items-start">
                    {/* Timeline Dot (Desktop) */}
                    <div className="absolute top-10 -left-20 z-10 hidden items-center lg:flex">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-50 bg-white shadow-sm">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                      </div>
                    </div>

                    {/* Step Card with Speech Bubble Pointer */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="relative h-full w-full rounded-3xl border border-gray-50 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]"
                    >
                      {/* Speech Bubble Pointer (Triangle) */}
                      <div
                        className="absolute top-10 left-[-14px] hidden h-0 w-0 border-t-14 border-r-14 border-b-14 border-t-transparent border-r-white border-b-transparent lg:block"
                        style={{
                          filter: "drop-shadow(-1px 0 1px rgba(0,0,0,0.01))",
                        }}
                      />

                      <div className="mb-6 flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 font-serif text-lg font-light italic"
                          style={{
                            color: colors.primary,
                            fontFamily: theme?.fonts?.heading || "inherit",
                          }}
                        >
                          {step.id}
                        </div>
                      </div>
                      <EditableText
                        value={step.title}
                        onChange={val => handleStepUpdate(index, "title", val)}
                        isEditable={isEditable}
                        as="h3"
                        className="mb-4 font-serif text-2xl font-normal text-[#1A1A1A]"
                        style={{
                          fontFamily: theme?.fonts?.heading || "inherit",
                        }}
                      />
                      <EditableText
                        value={step.description}
                        onChange={val =>
                          handleStepUpdate(index, "description", val)
                        }
                        isEditable={isEditable}
                        as="p"
                        multiline
                        className="text-base leading-relaxed font-light text-[#1A1A1A]/70"
                      />
                    </motion.div>
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
