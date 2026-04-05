"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { HeroTemplate20Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { cn } from "@/lib/utils";

interface HeroTemplate20Props {
  heroData: HeroTemplate20Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate20Data>) => void;
  siteUser?: string;
}

export const HeroTemplate20: React.FC<HeroTemplate20Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#ffffff",
    },
    fonts: {
      heading: "inherit",
      body: "inherit",
    },
  };

  const { data, handleTextUpdate, handleImageUpdate, handleAltUpdate } =
    useBuilderLogic(heroData, onUpdate);

  // Fetch products for "New Arrivals"
  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    page_size: 1,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const product = productsData?.results?.[0];

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-5">
        <EditableImage
          src={data.backgroundImageUrl}
          alt={data.backgroundImageAlt}
          onImageChange={handleImageUpdate(
            "backgroundImageUrl",
            "backgroundImageAlt"
          )}
          onAltChange={handleAltUpdate("backgroundImageAlt")}
          isEditable={isEditable}
          className="h-full w-full object-cover"
          buttonPosition="top-right"
          height={1080}
          width={1920}
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Background Image",
          }}
        />
      </div>

      {/* Overlays to achieve the brown tint/depth */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full pt-20 lg:max-w-3xl lg:pt-0"
          >
            <h1
              className="mb-8 text-[4.5rem] leading-[0.9] font-black tracking-[-0.04em] text-white sm:text-[6rem] md:text-[7.5rem] lg:mb-12 lg:text-[8.5rem]"
              style={{ fontFamily: theme.fonts.heading }}
            >
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                isEditable={isEditable}
                multiline
                as="span"
              />
            </h1>

            <div className="flex flex-wrap gap-4">
              <EditableLink
                text={data.primaryButtonText}
                href={data.primaryButtonHref}
                isEditable={isEditable}
                siteUser={siteUser}
                onChange={(text, href) => {
                  handleTextUpdate("primaryButtonText")(text);
                  handleTextUpdate("primaryButtonHref")(href);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-black transition-colors hover:bg-gray-100"
                textPlaceholder="Shop Now"
              >
                {data.primaryButtonText}
                <ChevronRight className="h-5 w-5" />
              </EditableLink>
            </div>
          </motion.div>

          {/* Right Floating Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10, x: 50 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 mt-16 hidden lg:mt-0 lg:block"
          >
            <motion.div
              animate={{ y: [-12, 12, -12] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-72 bg-white p-4 shadow-2xl lg:w-[320px]"
            >
              <div className="relative mb-4 aspect-square overflow-hidden bg-[#EAE6E1]">
                <AnimatePresence mode="wait">
                  {isProductsLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-full w-full items-center justify-center"
                    >
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </motion.div>
                  ) : product ? (
                    <motion.img
                      key="product"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1.1 }}
                      src={
                        product.thumbnail_image ||
                        product.images?.[0]?.image ||
                        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 hover:scale-125"
                    />
                  ) : (
                    <motion.img
                      key="fallback"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop"
                      alt="Premium Shoe"
                      className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 hover:scale-125"
                    />
                  )}
                </AnimatePresence>

                {product && (
                  <div className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-black shadow-sm">
                    {product.market_price
                      ? `Ref. ${product.market_price}`
                      : product.price
                        ? `Ref. ${product.price}`
                        : "New Arrival"}
                  </div>
                )}
              </div>

              <EditableLink
                text={data.cardButtonText}
                href={data.cardButtonHref}
                isEditable={isEditable}
                siteUser={siteUser}
                onChange={(text, href) => {
                  handleTextUpdate("cardButtonText")(text);
                  handleTextUpdate("cardButtonHref")(href);
                }}
                className="group flex w-full cursor-pointer items-center justify-between px-2 py-2 text-sm font-bold text-black"
                textPlaceholder="Explore New Arrivals"
              >
                {data.cardButtonText}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </EditableLink>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
