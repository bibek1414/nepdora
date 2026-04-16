import React, { useState, useId } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { HeroTemplate15Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useRouter, usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { toast } from "sonner";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { EditableLink } from "@/components/ui/editable-link";

interface HeroTemplate15Props {
  heroData: HeroTemplate15Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate15Data>) => void;
  siteUser: string;
}

export const HeroTemplate15: React.FC<HeroTemplate15Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const componentId = useId();

  const router = useRouter();
  const pathname = usePathname();
  const {
    data,
    setData,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleArrayItemUpdate,
  } = useBuilderLogic(heroData, onUpdate);

  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
      text: "#0F172A",
    },
  };

  const primaryColor = theme.colors.primary;

  const handleButtonClick = (e: React.MouseEvent, href?: string) => {
    if (isEditable || !href) {
      e.preventDefault();
      return;
    }
  };

  return (
    <section className="relative flex min-h-[500px] items-center overflow-hidden bg-gray-900 pt-16 sm:min-h-[600px] sm:pt-20 lg:h-screen">
      {/* Background Image */}
      <div className="group absolute inset-0 z-0">
        <EditableImage
          src={data.backgroundImageUrl}
          alt={data.imageAlt}
          onImageChange={handleImageUpdate("backgroundImageUrl", "imageAlt")}
          onAltChange={handleAltUpdate("imageAlt")}
          isEditable={isEditable}
          className="h-full w-full object-cover opacity-50"
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Upload Hero Background",
          }}
          disableImageChange={true}
        />
        <ImageEditOverlay
          onImageSelect={url => {
            const update = { backgroundImageUrl: url };
            setData({ ...data, ...update });
            onUpdate?.(update);
          }}
          imageWidth={1920}
          imageHeight={1080}
          isEditable={isEditable}
          label="Change Background"
          folder="hero-backgrounds"
          className="absolute top-0 right-0 z-20 flex items-center justify-center"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-white sm:px-6">
        <motion.div
          className="mt-6 sm:mt-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Credibility Badge */}
          <div className="mb-6">
            <EditableText
              value={data.eyebrow}
              onChange={handleTextUpdate("eyebrow")}
              as="div"
              isEditable={isEditable}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md sm:text-xs"
            />
          </div>

          <div className="mb-6">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h1"
              isEditable={isEditable}
              className="text-3xl leading-tight font-black tracking-tight sm:text-4xl md:text-5xl lg:text-7xl"
            />
          </div>

          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            isEditable={isEditable}
            className="mb-10 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg lg:text-xl"
            multiline
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {data.buttons.map(button => (
              <EditableLink
                key={button.id}
                text={button.text}
                href={button.href || "#"}
                isEditable={isEditable}
                siteUser={siteUser}
                onChange={(text, href) =>
                  handleArrayItemUpdate("buttons", button.id)({ text, href })
                }
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-8 py-4 text-center text-sm font-bold transition-all sm:text-base"
                style={{
                  backgroundColor:
                    button.variant === "primary" ? primaryColor : "#FFFFFF",
                  color: button.variant === "primary" ? "#FFFFFF" : "#0F172A",
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{button.text}</span>
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor:
                        button.variant === "primary" ? "#FFFFFF" : primaryColor,
                      color:
                        button.variant === "primary" ? primaryColor : "#FFFFFF",
                    }}
                  >
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </EditableLink>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
