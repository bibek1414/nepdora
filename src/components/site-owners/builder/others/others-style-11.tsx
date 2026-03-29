"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { OthersTemplate11Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { cn } from "@/lib/utils";

interface OthersTemplate11Props {
  othersData: OthersTemplate11Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate11Data>) => void;
}

const CIRCLE_SIZE = 220;

export const OthersTemplate11: React.FC<OthersTemplate11Props> = ({
  othersData,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(othersData, onUpdate);

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const colors = theme?.colors || {
    primary: "#C07A58",
    primaryForeground: "#ffffff",
    secondary: "#1A1A1A",
  };

  const handleStatUpdate = (idx: number, field: string, value: string) => {
    const newStats = [...(data.stats || [])];
    newStats[idx] = { ...newStats[idx], [field]: value };
    onUpdate?.({ stats: newStats });
  };

  const handleDestinationUpdate = (idx: number, field: string, value: any) => {
    const newDestinations = [...(data.destinations || [])];
    newDestinations[idx] = { ...newDestinations[idx], [field]: value };
    onUpdate?.({ destinations: newDestinations });
  };

  return (
    <section className="overflow-hidden py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Side */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                isEditable={isEditable}
                as="h2"
                multiline
                className="mb-8 font-serif text-5xl leading-[1.05] font-normal text-slate-900 md:text-6xl"
                style={{
                  fontFamily: theme?.fonts?.heading || "Georgia, serif",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                isEditable={isEditable}
                as="p"
                multiline
                className="mb-8 max-w-md text-lg leading-relaxed text-slate-900 opacity-65"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-12"
            >
              <EditableLink
                text={data.buttonText || "LEARN MORE"}
                href={data.buttonLink || "#"}
                isEditable={isEditable}
                onChange={(text, href) =>
                  onUpdate?.({ buttonText: text, buttonLink: href })
                }
                className="group flex items-center gap-2 rounded-full border px-4 py-2 font-semibold text-slate-900 transition-opacity"
              >
                {data.buttonText}
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </EditableLink>
            </motion.div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 sm:flex-nowrap">
              {data.stats?.map((stat, idx) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
                  className="flex-1 rounded-2xl border border-[#E5DED5] bg-white p-6 md:p-8"
                >
                  <EditableText
                    value={stat.value}
                    onChange={val => handleStatUpdate(idx, "value", val)}
                    isEditable={isEditable}
                    as="div"
                    className="mb-2 text-5xl leading-none font-light tracking-tight md:text-6xl"
                    style={{ color: colors.primary }}
                  />
                  <EditableText
                    value={stat.label}
                    onChange={val => handleStatUpdate(idx, "label", val)}
                    isEditable={isEditable}
                    as="div"
                    multiline
                    className="text-[10px] font-semibold tracking-wider text-slate-900 opacity-60"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Circular cluster */}
          <div className="relative h-[450px] w-full scale-75 items-center justify-center overflow-visible lg:h-[600px] lg:scale-100">
            <div className="absolute inset-0 flex items-center justify-center lg:block">
              {data.destinations?.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                  className="group absolute overflow-hidden shadow-2xl transition-transform hover:z-50"
                  style={{
                    width: `${CIRCLE_SIZE}px`,
                    height: `${CIRCLE_SIZE}px`,
                    borderRadius: "50%",
                    top: `${dest.top}px`,
                    left: `${dest.left}px`,
                    zIndex: 10 + i,
                  }}
                >
                  <EditableImage
                    src={dest.image.url}
                    alt={dest.image.alt || dest.name}
                    onImageChange={img =>
                      handleDestinationUpdate(i, "image", {
                        ...dest.image,
                        url: img,
                      })
                    }
                    isEditable={isEditable}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/40">
                    <div className={cn(isEditable && "pointer-events-auto")}>
                      <EditableText
                        value={dest.name}
                        onChange={val =>
                          handleDestinationUpdate(i, "name", val)
                        }
                        isEditable={isEditable}
                        as="span"
                        className="z-20 text-center font-serif text-2xl text-white italic drop-shadow-md"
                        style={{
                          fontFamily: theme?.fonts?.heading || "Georgia, serif",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
