"use client";

import React from "react";
import { OthersTemplate8Data } from "@/types/owner-site/components/others";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ChevronRight } from "lucide-react";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

interface OthersTemplate8Props {
  othersData: OthersTemplate8Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate8Data>) => void;
}

export const OthersTemplate8: React.FC<OthersTemplate8Props> = ({
  othersData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleArrayItemUpdate, handleTextUpdate } = useBuilderLogic(
    othersData,
    onUpdate
  );

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const activeImage =
    data.images?.find((img: any) => img.is_active !== false) ||
    data.images?.[0];

  const handleImageUpdateLocal = (imageUrl: string, altText?: string) => {
    if (activeImage && activeImage.id !== undefined) {
      handleArrayItemUpdate(
        "images",
        activeImage.id
      )({
        image: imageUrl,
        image_alt_description: altText,
      });
    }
  };

  const getImageUrl = (image: any) => {
    if (typeof image === "string") return image;
    return "https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=765&auto=format&fit=crop";
  };

  const currentBgClass = "bg-gradient-to-br from-slate-900 to-gray-800";

  return (
    <section className="w-full space-y-2 py-8 sm:space-y-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`relative overflow-hidden rounded-3xl ${currentBgClass} group flex min-h-[360px] items-center text-white shadow-2xl md:min-h-[420px]`}
          style={{ backgroundColor: "#0f172a" }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50"></div>
          </div>

          <div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 p-8 md:grid-cols-2 md:p-16">
            <div className="order-2 md:order-2 md:pl-12">
              <div className="mb-6 inline-block rounded-full border border-white/10 bg-white/20 px-3 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                <EditableText
                  value={data.subtitle || "Workstations & Laptops"}
                  onChange={handleTextUpdate("subtitle")}
                  isEditable={isEditable}
                  as="span"
                />
              </div>

              <div className="mb-6 text-4xl leading-tight font-extrabold md:text-5xl">
                <EditableText
                  value={data.title || "Power for Professionals"}
                  onChange={handleTextUpdate("title")}
                  isEditable={isEditable}
                  as="h2"
                />
              </div>

              <div className="mb-8 text-lg leading-relaxed text-white/80">
                <EditableText
                  value={
                    data.description ||
                    "Engineered for performance. Built for creators. Discover the ultimate portable powerhouses."
                  }
                  onChange={handleTextUpdate("description")}
                  isEditable={isEditable}
                  as="p"
                  multiline
                />
              </div>

              <div className="group/btn relative inline-flex">
                <EditableLink
                  text={data.buttonText || "Explore Collection"}
                  href={activeImage?.link || "#"}
                  onChange={(text, href) => {
                    handleTextUpdate("buttonText")(text);
                    if (activeImage && activeImage.id !== undefined) {
                      handleArrayItemUpdate(
                        "images",
                        activeImage.id
                      )({ link: href });
                    }
                  }}
                  className="inline-flex transform items-center rounded-full px-8 py-3.5 font-bold shadow-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: theme?.colors?.primary || "#ffffff",
                    color: theme?.colors?.primaryForeground || "#111827",
                  }}
                  isEditable={isEditable}
                  siteUser={siteUser}
                  textPlaceholder="Explore Collection"
                  hrefPlaceholder="#explore"
                >
                  {data.buttonText || "Explore Collection"}
                  <ChevronRight size={18} className="ml-2" />
                </EditableLink>
              </div>
            </div>

            <div className="relative order-1 flex justify-center md:order-1">
              {activeImage ? (
                <div className="group/image relative">
                  <EditableImage
                    src={getImageUrl(activeImage.image)}
                    alt={
                      activeImage.image_alt_description ||
                      "Product Banner Image"
                    }
                    onImageChange={(imageUrl, altText) =>
                      handleImageUpdateLocal(imageUrl, altText)
                    }
                    isEditable={isEditable}
                    className="w-full max-w-sm object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:translate-x-4 group-hover:-rotate-2 md:max-w-md"
                    s3Options={{
                      folder: "banner-images",
                    }}
                    showAltEditor={isEditable}
                    disableImageChange={true}
                  />
                  <ImageEditOverlay
                    onImageSelect={handleImageUpdateLocal}
                    imageWidth={800}
                    imageHeight={800}
                    isEditable={isEditable}
                    label="Change"
                    folder="banner-images"
                    className="absolute top-0 right-0 z-20 flex items-center justify-center"
                  />
                </div>
              ) : (
                <div className="flex h-64 w-full max-w-sm items-center justify-center rounded-xl bg-white/10 md:max-w-md">
                  <span className="text-white/50">No Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
