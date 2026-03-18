"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { AboutUs22Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate22Props {
  aboutUsData: AboutUs22Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs22Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate22: React.FC<AboutUsTemplate22Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(aboutUsData, onUpdate);

  const { data: themeResponse } = useThemeQuery();
  const theme =
    themeResponse?.data?.[0]?.data?.theme ||
    ({
      colors: {
        primary: "#3B82F6",
      },
    } as any);

  const primaryColor = theme.colors.primary;

  const renderTitle = () => {
    if (!data.italicWord || !data.title.includes(data.italicWord)) {
      return data.title;
    }
    const parts = data.title.split(data.italicWord);
    return (
      <>
        {parts[0]}
        <span className="italic" style={{ color: primaryColor }}>
          {data.italicWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section id="about" className="bg-gray-50/50 pt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
          {/* Left Text */}
          <motion.div
            className="md:col-span-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <EditableText
                value={data.tag}
                onChange={handleTextUpdate("tag")}
                as="p"
                className="mb-2 text-sm font-medium tracking-wider uppercase"
                style={{ color: primaryColor }}
                isEditable={isEditable}
              />
              <div className="space-y-4">
                <EditableText
                  value={data.title}
                  onChange={handleTextUpdate("title")}
                  as="h2"
                  className="text-4xl font-bold text-gray-900 md:text-5xl"
                  isEditable={isEditable}
                />
              </div>
            </motion.div>

            <EditableText
              value={data.description1}
              onChange={handleTextUpdate("description1")}
              as="p"
              className="mb-6 text-xl leading-relaxed font-medium text-gray-900"
              isEditable={isEditable}
              multiline
            />

            <EditableText
              value={data.description2}
              onChange={handleTextUpdate("description2")}
              as="p"
              className="mb-8 leading-relaxed text-gray-500"
              isEditable={isEditable}
              multiline
            />

            <div className="mb-8 flex gap-8 border-t border-gray-100 pt-8">
              <div>
                <EditableText
                  value={data.experienceYears}
                  onChange={handleTextUpdate("experienceYears")}
                  as="div"
                  className="mb-1 text-4xl font-bold"
                  style={{ color: primaryColor }}
                  isEditable={isEditable}
                />
                <EditableText
                  value={data.experienceLabel}
                  onChange={handleTextUpdate("experienceLabel")}
                  as="div"
                  className="text-sm font-medium text-gray-600"
                  isEditable={isEditable}
                />
              </div>
              <div>
                <EditableText
                  value={data.clientsCount}
                  onChange={handleTextUpdate("clientsCount")}
                  as="div"
                  className="mb-1 text-4xl font-bold"
                  style={{ color: primaryColor }}
                  isEditable={isEditable}
                />
                <EditableText
                  value={data.clientsLabel}
                  onChange={handleTextUpdate("clientsLabel")}
                  as="div"
                  className="text-sm font-medium text-gray-600"
                  isEditable={isEditable}
                />
              </div>
            </div>

            <EditableLink
              text={data.buttonText}
              href={data.buttonLink}
              onChange={(text, href) => {
                handleTextUpdate("buttonText")(text);
                handleTextUpdate("buttonLink")(href);
              }}
              className="inline-flex h-16! cursor-pointer items-center justify-center gap-2 rounded-full px-8 py-4 text-center text-sm font-bold transition-all sm:text-base"
              style={{
                background: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
              isEditable={isEditable}
              siteUser={siteUser}
            >
              {data.buttonText}
              <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-105">
                <ArrowUpRight />
              </div>
            </EditableLink>
          </motion.div>

          {/* Right Image/Card */}
          <motion.div
            className="relative pl-0 md:col-span-6 md:pl-10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl">
              <EditableImage
                src={data.image}
                alt={data.imageAlt}
                onImageChange={(url, alt) => {
                  handleTextUpdate("image")(url);
                  if (alt) handleTextUpdate("imageAlt")(alt);
                }}
                isEditable={isEditable}
                className="h-150 w-full object-cover"
                width={1000}
                height={1000}
              />
            </div>

            {/* Floating Card */}
            <motion.div
              className="absolute bottom-10 left-0 max-w-xs rounded-xl border border-gray-100 bg-white p-6 shadow-xl md:left-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"
                  style={{
                    color: primaryColor,
                    backgroundColor: `${primaryColor}1A`,
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <EditableText
                    value={data.floatingCardTitle}
                    onChange={handleTextUpdate("floatingCardTitle")}
                    as="h4"
                    className="z-50 mb-1 font-bold text-gray-900"
                    isEditable={isEditable}
                  />
                  <EditableText
                    value={data.floatingCardDescription}
                    onChange={handleTextUpdate("floatingCardDescription")}
                    as="p"
                    className="z-50 text-xs text-gray-500"
                    isEditable={isEditable}
                    multiline
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
