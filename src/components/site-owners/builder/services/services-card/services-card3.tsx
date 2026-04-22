"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { EditableText } from "@/components/ui/editable-text";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ServicesCard3Props {
  component: ServicesComponentData;
  services: ServicesPost[];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ServicesComponentData["data"]>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesCard3: React.FC<ServicesCard3Props> = ({
  component,
  services,
  isEditable = false,
  siteUser,
  onUpdate,
  onServiceClick,
}) => {
  const {
    title = "Fields of expertise that our great team excels in",
    subtitle = "Consulting Services",
  } = component.data || {};
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#0A3D3D",
      secondary: "#DFFF5E",
      text: "#FFFFFF",
      background: "#0A3D3D",
    },
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const getDetailsUrl = (slug: string): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/service-details-draft"
      : "/service-details";
    return generateLinkHref(`${basePath}/${slug}`, siteUser, pathname);
  };

  const handleActivate = (slug: string) => {
    if (isEditable) return;

    if (onServiceClick) {
      onServiceClick(slug);
      return;
    }

    window.location.href = getDetailsUrl(slug);
  };

  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  return (
    <section
      className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-20 font-sans md:px-10"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="w-full max-w-7xl">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-3xl text-4xl leading-tight font-bold text-white md:text-6xl"
          >
            <EditableText
              value={title}
              onChange={handleTitleChange}
              isEditable={isEditable}
              as="h1"
              placeholder="Enter title..."
            />
          </motion.h2>
        </div>

        <div
          className="relative mx-auto flex h-[725px] w-[1200px] flex-col items-stretch gap-4 md:flex-row md:justify-center"
          onMouseLeave={() => setActiveIndex(null)}
        >
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            const serviceImage =
              service.thumbnail_image ||
              "https://picsum.photos/seed/service/800/600";
            const serviceNumber = (index + 1).toString().padStart(2, "0");

            return (
              <motion.div
                key={service.id}
                layout
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                    mass: 1,
                  },
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleActivate(service.slug)}
                className={`relative flex cursor-pointer flex-col overflow-hidden ${
                  isActive
                    ? "flex-5 rounded-[40px] p-6 md:rounded-[60px] md:p-10"
                    : "w-full flex-none rounded-[40px] bg-white p-6 md:w-24 md:rounded-[60px] md:py-10"
                }`}
                style={{
                  backgroundColor: isActive ? "white" : "white",
                  willChange: "flex, background-color",
                }}
              >
                {/* Number Circle */}
                <motion.div
                  layout
                  className="mb-2 flex h-12 w-12 flex-none items-center justify-center rounded-full border border-black/20 text-sm font-medium"
                >
                  {serviceNumber}
                </motion.div>
                <div className="relative flex w-full flex-1 flex-col">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="active-content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0, delay: 0 },
                        }}
                        transition={{
                          duration: 0.38,
                          delay: 0.25,
                          ease: "easeOut",
                        }}
                        className="flex h-full w-full flex-col text-left"
                      >
                        <h2 className="mb-6 text-xl leading-tight font-bold md:text-3xl">
                          {service.title}
                        </h2>

                        <div className="mb-6">
                          <Image
                            unoptimized
                            src={serviceImage}
                            alt={service.title}
                            height={600}
                            width={600}
                            className="rounded-2xl object-cover"
                          />
                        </div>
                        <p className="mb-4 line-clamp-3 max-w-2xl text-sm md:line-clamp-3 md:text-base">
                          {stripHtml(service.description || "")}
                        </p>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleActivate(service.slug);
                          }}
                          className="group flex w-fit items-center gap-2 rounded-full px-8 py-3 font-medium text-white transition-all hover:opacity-90"
                          style={{ backgroundColor: theme.colors.primary }}
                        >
                          Read More
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="collapsed-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0, delay: 0 },
                        }}
                        transition={{
                          duration: 0.25,
                          delay: 0.3,
                        }}
                        className="flex flex-1 flex-col items-center justify-center"
                      >
                        <span
                          className="text-lg font-bold tracking-tight whitespace-nowrap md:rotate-180 md:text-2xl md:[writing-mode:vertical-rl]"
                          style={{ color: theme.colors.primary }}
                        >
                          {service.title}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
