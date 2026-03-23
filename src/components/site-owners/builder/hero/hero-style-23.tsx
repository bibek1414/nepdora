import React, { useState, useId } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { HeroTemplate23Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useRouter, usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { uploadToS3 } from "@/utils/s3";
import { toast } from "sonner";
import { EditableLink } from "@/components/ui/editable-link";

interface HeroTemplate23Props {
  heroData: HeroTemplate23Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate23Data>) => void;
  siteUser: string;
}

export const HeroTemplate23: React.FC<HeroTemplate23Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
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

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingBackground(true);
    try {
      const url = await uploadToS3(file, "hero-backgrounds");
      const update = {
        backgroundImageUrl: url,
        imageAlt: file.name.split(".")[0] || data.imageAlt,
      };
      setData({ ...data, ...update });
      onUpdate?.(update);
      toast.success("Background updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setIsUploadingBackground(false);
      event.target.value = "";
    }
  };
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
      {isEditable && (
        <div className="absolute top-6 left-6 z-30">
          <label
            htmlFor={`hero-23-background-upload-${componentId}`}
            className={`cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white ${
              isUploadingBackground ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {isUploadingBackground ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              "Change Background"
            )}
          </label>
          <input
            id={`hero-23-background-upload-${componentId}`}
            type="file"
            accept="image/*"
            onChange={handleBackgroundFileChange}
            className="hidden"
            disabled={isUploadingBackground}
          />
        </div>
      )}
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
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
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-gray-900/95 via-gray-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto flex h-full flex-col justify-center px-4 text-white md:px-8">
        <motion.div
          className="mt-6 max-w-4xl sm:mt-10"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest uppercase backdrop-blur-md"
            />
          </div>

          <div className="mb-6">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h1"
              isEditable={isEditable}
              className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
            />
          </div>

          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            isEditable={isEditable}
            className="sm:text-md mb-10 max-w-2xl text-sm leading-relaxed text-gray-300 md:text-lg"
            multiline
          />

          <div className="flex flex-col gap-4 sm:flex-row">
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
                className="inline-flex h-16! cursor-pointer items-center justify-center gap-2 rounded-full px-8 py-4 text-center text-sm font-bold transition-all sm:text-base"
                style={{
                  backgroundColor:
                    button.variant === "primary" ? primaryColor : "#FFFFFF",
                  color: button.variant === "primary" ? "#FFFFFF" : "#0F172A",
                  height: "auto",
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
