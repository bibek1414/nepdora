"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pin } from "lucide-react";
import { AboutUs21Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate21Props {
  aboutUsData: AboutUs21Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs21Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate21: React.FC<AboutUsTemplate21Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data, handleTextUpdate, handleArrayItemUpdate } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  const { data: themeResponse } = useThemeQuery();
  const theme =
    themeResponse?.data?.[0]?.data?.theme ||
    ({
      colors: {
        primary: "#3B82F6",
      },
    } as any);

  const primaryColor = theme.colors.primary;

  return (
    <section id="about" className="bg-gray-50/50 py-16 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 max-w-4xl"
        >
          <div className="space-y-4">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl"
              isEditable={isEditable}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12">
          {/* Left Text */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-8 flex flex-col sm:mb-20 lg:mb-36">
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="text-xs leading-relaxed text-gray-500 sm:text-sm"
                isEditable={isEditable}
                multiline
              />
            </div>

            <div
              className="border-l-2 pl-4 sm:pl-6"
              style={{ borderColor: primaryColor }}
            >
              <EditableText
                value={data.statsValue}
                onChange={handleTextUpdate("statsValue")}
                as="div"
                className="mb-1 text-4xl font-bold text-gray-900 sm:mb-2 sm:text-5xl lg:text-6xl"
                isEditable={isEditable}
              />
              <EditableText
                value={data.statsLabel}
                onChange={handleTextUpdate("statsLabel")}
                as="div"
                className="text-xs font-medium text-gray-500 sm:text-sm"
                isEditable={isEditable}
              />
            </div>
          </motion.div>

          {/* Center Image */}
          <motion.div
            className="md:col-span-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="h-64 w-full overflow-hidden rounded-2xl sm:h-80 md:h-[400px]">
              <EditableImage
                src={data.image}
                alt={data.imageAlt}
                onImageChange={(url, alt) => {
                  handleTextUpdate("image")(url);
                  if (alt) handleTextUpdate("imageAlt")(alt);
                }}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={800}
                height={800}
              />
            </div>
          </motion.div>

          {/* Right Floating Card */}
          <motion.div
            className="mt-10 flex h-full flex-col md:col-span-3 md:mt-16 lg:mt-24"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-6 rounded-2xl bg-gray-50 p-5 sm:mb-8 sm:p-6">
              <div
                className="mb-4 flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${primaryColor}1A`,
                  color: primaryColor,
                }}
              >
                <Pin size={16} fill="currentColor" />
              </div>
              <ul className="space-y-3 text-sm font-medium text-gray-800">
                {data.features.map(feature => (
                  <li key={feature.id} className="flex items-center gap-2">
                    <EditableText
                      value={feature.text}
                      onChange={val =>
                        handleArrayItemUpdate(
                          "features",
                          feature.id
                        )({ text: val })
                      }
                      as="span"
                      isEditable={isEditable}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <EditableLink
              text={data.buttonText}
              href={data.buttonLink}
              onChange={(text, href) => {
                handleTextUpdate("buttonText")(text);
                handleTextUpdate("buttonLink")(href);
              }}
              isEditable={isEditable}
              siteUser={siteUser}
              className="w-full justify-center text-center font-bold"
              style={{
                backgroundColor: primaryColor,
                color: "white",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
