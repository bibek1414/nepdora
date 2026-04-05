"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight,  } from "lucide-react";
import { OthersTemplate20Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { hexToRgba } from "@/lib/utils";

interface OthersTemplate20Props {
  othersData: OthersTemplate20Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate20Data>) => void;
}

export const OthersTemplate20: React.FC<OthersTemplate20Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#FFFFFF",
    },
    fonts: { heading: "sans-serif", body: "sans-serif" },
  };

  const { data, handleTextUpdate } = useBuilderLogic(othersData, onUpdate);

  const [activeId, setActiveId] = useState<string | null>(
    data.accordionItems[2]?.id || null
  );

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-8 md:px-16">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
          {/* ── Left Column ── */}
          <div className="flex flex-col gap-10">
            {/* Heading */}
            <EditableText
              as="h2"
              value={data.heading}
              onChange={handleTextUpdate("heading")}
              isEditable={isEditable}
              className="text-[2.1rem] leading-[1.18] font-bold tracking-tight text-gray-900 md:text-[2.6rem]"
              style={{ fontFamily: theme.fonts.heading }}
              multiline
            />

            {/* Accordion */}
            <div className="flex flex-col">
              {data.accordionItems.map((item, idx) => {
                const isActive = activeId === item.id;
                return (
                  <div key={item.id} className="border-b border-gray-200">
                    <button
                      onClick={() => setActiveId(isActive ? null : item.id)}
                      className="flex w-full cursor-pointer items-center justify-between py-5 text-left"
                    >
                      <EditableText
                        as="h6"
                        value={item.title}
                        onChange={val => {
                          const newItems = [...data.accordionItems];
                          newItems[idx] = { ...newItems[idx], title: val };
                          onUpdate?.({ accordionItems: newItems });
                        }}
                        isEditable={isEditable}
                        className={`text-[1.05rem] font-bold transition-colors duration-200 ${
                          isActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      />
                      <motion.div
                        animate={{ rotate: isActive ? -45 : 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <ChevronRight
                          size={18}
                          className={`transition-colors duration-200 ${
                            isActive ? "text-gray-900" : "text-gray-400"
                          }`}
                        />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="desc"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <EditableText
                            as="p"
                            value={item.description}
                            onChange={val => {
                              const newItems = [...data.accordionItems];
                              newItems[idx] = {
                                ...newItems[idx],
                                description: val,
                              };
                              onUpdate?.({ accordionItems: newItems });
                            }}
                            isEditable={isEditable}
                            className="pb-5 text-[14.5px] leading-relaxed text-gray-500"
                            multiline
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Donate button */}
            <div>
              <EditableLink
                text={data.donateButtonText}
                href={data.donateButtonLink}
                onChange={(text, href) =>
                  onUpdate?.({ donateButtonText: text, donateButtonLink: href })
                }
                isEditable={isEditable}
                className="hover:group/btn inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold text-gray-900 transition-colors active:scale-95"
                style={{
                  backgroundColor: hexToRgba(theme.colors.primary, 0.1),
                  color: theme.colors.primary,
                }}
              >
                {data.donateButtonText}
                <ChevronRight size={18} />
              </EditableLink>
            </div>
          </div>

          {/* ── Right Column - Auto-height Bento grid ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="grid gap-3"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridAutoRows: "auto",
              }}
            >
              {/* Top-left - TALL (cols 1-2) */}
              <div
                className="overflow-hidden rounded-2xl"
                style={{ gridColumn: "span 2", gridRow: "span 2" }}
              >
                <EditableImage
                  src={data.bentoImages[0].url}
                  alt={data.bentoImages[0].alt}
                  onImageChange={url => {
                    const newImages = [...data.bentoImages];
                    newImages[0] = { ...newImages[0], url };
                    onUpdate?.({ bentoImages: newImages });
                  }}
                  isEditable={isEditable}
                  className="h-full w-full cursor-pointer object-cover"
                  style={{ aspectRatio: "4/5" }}
                />
              </div>

              {/* Top-right - SHORT (cols 3-4) */}
              <div
                className="overflow-hidden rounded-2xl"
                style={{ gridColumn: "span 2", gridRow: "span 1" }}
              >
                <EditableImage
                  src={data.bentoImages[1].url}
                  alt={data.bentoImages[1].alt}
                  onImageChange={url => {
                    const newImages = [...data.bentoImages];
                    newImages[1] = { ...newImages[1], url };
                    onUpdate?.({ bentoImages: newImages });
                  }}
                  isEditable={isEditable}
                  className="h-full w-full cursor-pointer object-cover"
                  style={{ aspectRatio: "2/1" }}
                />
              </div>
              {/* Bottom-right - TALL (cols 3-4) */}
              <div
                className="overflow-hidden rounded-2xl"
                style={{ gridColumn: "span 2", gridRow: "span 2" }}
              >
                <EditableImage
                  src={data.bentoImages[3].url}
                  alt={data.bentoImages[3].alt}
                  onImageChange={url => {
                    const newImages = [...data.bentoImages];
                    newImages[3] = { ...newImages[3], url };
                    onUpdate?.({ bentoImages: newImages });
                  }}
                  isEditable={isEditable}
                  className="h-full w-full cursor-pointer rounded-2xl object-cover"
                  style={{ aspectRatio: "4/5" }}
                />
              </div>
              {/* Bottom-left - SHORT (cols 1-2) */}
              <div
                className="rounded-2xl"
                style={{ gridColumn: "span 2", gridRow: "span 1" }}
              >
                <EditableImage
                  src={data.bentoImages[2].url}
                  alt={data.bentoImages[2].alt}
                  onImageChange={url => {
                    const newImages = [...data.bentoImages];
                    newImages[2] = { ...newImages[2], url };
                    onUpdate?.({ bentoImages: newImages });
                  }}
                  isEditable={isEditable}
                  className="h-full w-full cursor-pointer rounded-2xl object-cover"
                  style={{ aspectRatio: "2/1" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
