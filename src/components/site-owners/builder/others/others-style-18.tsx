"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  OthersTemplate18Data,
  OthersAvatar,
  OthersTag,
} from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { cn, hexToRgba } from "@/lib/utils";

interface OthersTemplate18Props {
  othersData: OthersTemplate18Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate18Data>) => void;
}

export const OthersTemplate18: React.FC<OthersTemplate18Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme =
    themeResponse?.data?.[0]?.data?.theme ||
    ({
      colors: {
        background: "#FFFFFF",
        primary: "#000000",
        primaryForeground: "#FFFFFF",
        secondary: "#f0f4e4",
        text: "#1a1a1a",
      },
      fonts: { heading: "sans-serif", body: "sans-serif" },
    } as any);

  const { data, handleTextUpdate, handleArrayItemUpdate } = useBuilderLogic(
    othersData,
    onUpdate
  );

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20 lg:py-24">
        {/* Outer grid - left content | right image */}
        <div className="grid lg:grid-cols-[1fr_490px] lg:items-stretch">
          {/* ── Left Column ── */}
          <div className="flex flex-col gap-0 py-0 lg:py-10 lg:pr-10">
            {/* Heading block */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              <EditableText
                as="h2"
                value={data.heading}
                onChange={handleTextUpdate("heading")}
                isEditable={isEditable}
                className="text-[1.9rem] leading-[1.22] font-bold tracking-tight text-gray-900"
                style={{ fontFamily: theme.fonts.heading }}
                multiline
              />

              <EditableText
                as="p"
                value={data.description}
                onChange={handleTextUpdate("description")}
                isEditable={isEditable}
                className="max-w-[400px] text-[15px] leading-relaxed text-gray-600"
                multiline
              />

              <div className="mt-1">
                <EditableLink
                  text={data.buttonText}
                  href={data.buttonLink}
                  onChange={(text, href) =>
                    onUpdate?.({ buttonText: text, buttonLink: href })
                  }
                  isEditable={isEditable}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-3 text-[13.5px] font-semibold transition-all hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: hexToRgba(theme.colors.primary, 0.1),
                    color: theme.colors.primary,
                  }}
                >
                  {data.buttonText} <ArrowUpRight size={14} strokeWidth={2.5} />
                </EditableLink>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="mt-8 mb-8 h-px w-full bg-gray-200" />

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-xl border border-gray-100 bg-white px-7 py-6 shadow-sm"
            >
              {/* Stat + avatars row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                  <EditableText
                    as="h3"
                    value={data.statValue}
                    onChange={handleTextUpdate("statValue")}
                    isEditable={isEditable}
                    className="text-[1.9rem] leading-none font-bold tracking-tight text-gray-900"
                  />
                </div>
                <div className="flex -space-x-3">
                  {data.avatars?.map((avatar: OthersAvatar, i: number) => (
                    <div
                      key={avatar.id || i}
                      className="h-10 w-10 overflow-hidden rounded-full border-[3px] border-white bg-gray-100"
                    >
                      <EditableImage
                        src={avatar.url}
                        alt={avatar.id}
                        onImageChange={url =>
                          handleArrayItemUpdate("avatars", avatar.id)({ url })
                        }
                        isEditable={isEditable}
                        className="h-full w-full cursor-pointer object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <EditableText
                as="p"
                value={data.statDescription}
                onChange={handleTextUpdate("statDescription")}
                isEditable={isEditable}
                className="mt-5 text-[14px] leading-relaxed text-gray-600"
                multiline
              />

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {data.tags?.map((tag: OthersTag, i: number) => (
                  <span
                    key={tag.id || i}
                    className="rounded-xl px-4 py-2 text-[12.5px] font-semibold"
                    style={{
                      backgroundColor: hexToRgba(theme.colors.primary, 0.08),
                    }}
                  >
                    <EditableText
                      as="span"
                      value={tag.label}
                      onChange={val =>
                        handleArrayItemUpdate("tags", tag.id)({ label: val })
                      }
                      isEditable={isEditable}
                      className="cursor-pointer"
                    />
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right Column - Image stretches full column height ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative my-5 rounded-xl lg:my-10"
            style={{ minHeight: "560px" }}
          >
            <EditableImage
              src={data.mainImage.url}
              alt={data.mainImage.alt}
              onImageChange={url =>
                onUpdate?.({ mainImage: { ...data.mainImage, url } })
              }
              isEditable={isEditable}
              className="inset-0 h-135 w-full cursor-pointer rounded-2xl object-cover object-top"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
