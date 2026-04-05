"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2, ArrowUpRight } from "lucide-react";
import { OthersTemplate19Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { hexToRgba } from "@/lib/utils";

interface OthersTemplate19Props {
  othersData: OthersTemplate19Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate19Data>) => void;
}

export const OthersTemplate19: React.FC<OthersTemplate19Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#FFFFFF",
      secondary: "#f0f4e4",
    },
    fonts: { heading: "sans-serif", body: "sans-serif" },
  };

  const { data, handleTextUpdate } = useBuilderLogic(othersData, onUpdate);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        {/* Heading */}
        <EditableText
          as="h2"
          value={data.heading}
          onChange={handleTextUpdate("heading")}
          isEditable={isEditable}
          className="mb-10 text-center text-[1.8rem] leading-[1.2] font-bold tracking-tight text-gray-900 sm:text-[2.2rem] md:mb-14 md:text-[2.8rem]"
          style={{ fontFamily: theme.fonts.heading }}
          multiline
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:items-start">
          {/* ── Left Column - desktop only ── */}
          <div className="hidden lg:col-span-3 lg:mt-36 lg:flex lg:flex-col lg:gap-4">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[14.5px] font-bold text-gray-900"
              style={{
                backgroundColor: hexToRgba(theme.colors.secondary, 0.4),
              }}
            >
              <Star size={15} className="shrink-0 fill-gray-900" />
              <EditableText
                as="span"
                value={data.projectsCompletedLabel}
                onChange={handleTextUpdate("projectsCompletedLabel")}
                isEditable={isEditable}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-2xl p-7"
              style={{ backgroundColor: hexToRgba(theme.colors.primary, 0.05) }}
            >
              <EditableText
                as="h3"
                value={data.resilientLiving.title}
                onChange={val =>
                  onUpdate?.({
                    resilientLiving: { ...data.resilientLiving, title: val },
                  })
                }
                isEditable={isEditable}
                className="mb-3 text-[1.05rem] font-bold text-gray-900"
              />
              <EditableText
                as="p"
                value={data.resilientLiving.description}
                onChange={val =>
                  onUpdate?.({
                    resilientLiving: {
                      ...data.resilientLiving,
                      description: val,
                    },
                  })
                }
                isEditable={isEditable}
                className="mb-6 text-[13.5px] leading-relaxed text-gray-600"
                multiline
              />
              <ul className="mb-7 space-y-3">
                {data.resilientLiving.items.map((item, idx) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2.5 text-[13.5px] font-semibold text-gray-900"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 fill-gray-900 text-white"
                    />
                    <EditableText
                      as="p"
                      value={item.label}
                      onChange={val => {
                        const newItems = [...data.resilientLiving.items];
                        newItems[idx] = { ...newItems[idx], label: val };
                        onUpdate?.({
                          resilientLiving: {
                            ...data.resilientLiving,
                            items: newItems,
                          },
                        });
                      }}
                      isEditable={isEditable}
                    />
                  </li>
                ))}
              </ul>
              <EditableLink
                text={data.resilientLiving.buttonText}
                href={data.resilientLiving.buttonLink}
                onChange={(text, href) =>
                  onUpdate?.({
                    resilientLiving: {
                      ...data.resilientLiving,
                      buttonText: text,
                      buttonLink: href,
                    },
                  })
                }
                isEditable={isEditable}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border text-[13.5px] font-bold text-gray-900 transition-opacity hover:opacity-60"
              >
                {data.resilientLiving.buttonText} <ArrowUpRight size={15} />
              </EditableLink>
            </motion.div>
          </div>

          {/* ── Center Column - tall portrait ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="aspect-3/4 max-h-[600px] overflow-hidden rounded-3xl md:col-span-1 lg:col-span-5"
          >
            <EditableImage
              src={data.portraitImage.url}
              alt={data.portraitImage.alt}
              onImageChange={url =>
                onUpdate?.({ portraitImage: { ...data.portraitImage, url } })
              }
              isEditable={isEditable}
              className="h-full w-full object-cover"
              width={800}
              height={1100}
            />
          </motion.div>

          {/* ── Right Column ── */}
          <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-4">
            {/* Badge + green card - mobile/tablet only (left col hidden on those) */}
            <div className="flex flex-col gap-4 lg:hidden">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[14.5px] font-bold text-gray-900"
                style={{
                  backgroundColor: hexToRgba(theme.colors.secondary, 0.4),
                }}
              >
                <Star size={15} className="shrink-0 fill-gray-900" />
                {data.projectsCompletedLabel}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: hexToRgba(theme.colors.primary, 0.05),
                }}
              >
                <EditableText
                  as="h3"
                  value={data.resilientLiving.title}
                  onChange={val =>
                    onUpdate?.({
                      resilientLiving: { ...data.resilientLiving, title: val },
                    })
                  }
                  isEditable={isEditable}
                  className="mb-3 text-[1.05rem] font-bold text-gray-900"
                />
                <EditableText
                  as="p"
                  value={data.resilientLiving.description}
                  onChange={val =>
                    onUpdate?.({
                      resilientLiving: {
                        ...data.resilientLiving,
                        description: val,
                      },
                    })
                  }
                  isEditable={isEditable}
                  className="mb-5 text-[13.5px] leading-relaxed text-gray-600"
                  multiline
                />
                <ul className="mb-6 space-y-3">
                  {data.resilientLiving.items.map(item => (
                    <li
                      key={item.id}
                      className="flex items-center gap-2.5 text-[13.5px] font-semibold text-gray-900"
                    >
                      <CheckCircle2
                        size={18}
                        className="shrink-0 fill-gray-900 text-white"
                      />
                      <EditableText
                        as="p"
                        value={item.label}
                        onChange={val => {
                          const newItems = [...data.resilientLiving.items];
                          const idx = newItems.findIndex(i => i.id === item.id);
                          newItems[idx] = { ...newItems[idx], label: val };
                          onUpdate?.({
                            resilientLiving: {
                              ...data.resilientLiving,
                              items: newItems,
                            },
                          });
                        }}
                        isEditable={isEditable}
                      />
                    </li>
                  ))}
                </ul>
                <EditableLink
                  text={data.resilientLiving.buttonText}
                  href={data.resilientLiving.buttonLink}
                  onChange={(text, href) =>
                    onUpdate?.({
                      resilientLiving: {
                        ...data.resilientLiving,
                        buttonText: text,
                        buttonLink: href,
                      },
                    })
                  }
                  isEditable={isEditable}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border text-[13.5px] font-bold text-gray-900 transition-opacity hover:opacity-60"
                >
                  {data.resilientLiving.buttonText} <ArrowUpRight size={15} />
                </EditableLink>
              </motion.div>
            </div>

            {/* Landscape image */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="aspect-4/3 rounded-xl"
            >
              <EditableImage
                src={data.landscapeImage.url}
                alt={data.landscapeImage.alt}
                onImageChange={url =>
                  onUpdate?.({
                    landscapeImage: { ...data.landscapeImage, url },
                  })
                }
                isEditable={isEditable}
                className="h-full w-full rounded-2xl object-cover"
                width={800}
                height={560}
              />
            </motion.div>

            {/* Text + button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex flex-col gap-5"
            >
              <EditableText
                as="p"
                value={data.bottomDescription}
                onChange={handleTextUpdate("bottomDescription")}
                isEditable={isEditable}
                className="text-[14.5px] leading-relaxed text-gray-600"
                multiline
              />
              <div>
                <EditableLink
                  text={data.bottomButtonText}
                  href={data.bottomButtonLink}
                  onChange={(text, href) =>
                    onUpdate?.({
                      bottomButtonText: text,
                      bottomButtonLink: href,
                    })
                  }
                  isEditable={isEditable}
                  className="hover:group/btn inline-flex cursor-pointer items-center gap-2 rounded-2xl px-7 py-3.5 text-[14px] font-semibold text-gray-900 transition-colors active:scale-95"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                >
                  {data.bottomButtonText}{" "}
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </EditableLink>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
