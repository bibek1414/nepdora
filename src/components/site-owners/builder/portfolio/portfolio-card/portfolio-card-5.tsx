"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Portfolio } from "@/types/owner-site/admin/portfolio";

interface PortfolioCard5Props {
  portfolio: Portfolio;
  idx: number;
  isEditable?: boolean;
  siteUser?: string;
  onPortfolioClick?: (slug: string) => void;
}

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
};

/**
 * @beautifulMention: Portfolio Card 5
 * Premium layout based on ServicesCard4 design.
 * Features a slide-up animation and detailed meta info.
 */
export const PortfolioCard5: React.FC<PortfolioCard5Props> = ({
  portfolio,
  idx,
  isEditable = false,
  siteUser,
  onPortfolioClick,
}) => {
  const pathname = usePathname();
  const plainDescription = stripHtml(
    portfolio.meta_description || portfolio.content || ""
  );
  const portfolioImage =
    portfolio.thumbnail_image || "/fallback/image-not-found.png";

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/portfolio-details-draft"
      : "/portfolio-details";
    return generateLinkHref(`${basePath}/${portfolio.slug}`, siteUser, pathname);
  };

  const handleActivate = () => {
    if (isEditable) return;

    if (onPortfolioClick) {
      onPortfolioClick(portfolio.slug);
      return;
    }

    window.location.href = getDetailsUrl();
  };

  return (
    <div className="block h-full" onClick={handleActivate}>
      <motion.div
        className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: idx * 0.05,
        }}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={portfolioImage}
            alt={portfolio.thumbnail_image_alt_description || portfolio.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Category Tag Overlay */}
          <div className="absolute top-4 left-4 z-20">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-gray-900 uppercase shadow-sm backdrop-blur-sm">
              {portfolio.category?.name || "Project"}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors">
            {portfolio.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
            {plainDescription}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
