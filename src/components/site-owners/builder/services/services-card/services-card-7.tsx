"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ServicesPost } from "@/types/owner-site/admin/services";

interface ServicesCard7Props {
  service: ServicesPost;
  idx: number;
  isEditable?: boolean;
  onServiceClick?: (serviceSlug: string) => void;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

/**
 * @beautifulMention: Services Card 7
 * Design based on ServicesCard4 premium layout.
 * Includes horizontal slide-up animation and refined shadow.
 */
export const ServicesCard7: React.FC<ServicesCard7Props> = ({
  service,
  idx,
  isEditable = false,
  onServiceClick,
}) => {
  const plainDescription = stripHtml(service.description || "");
  const serviceImage =
    service.thumbnail_image || "/fallback/image-not-found.png";

  return (
    <div
      className="block h-full"
      onClick={() => !isEditable && onServiceClick?.(service.slug)}
    >
      <motion.div
        className="relative h-full cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
            src={serviceImage}
            alt={service.thumbnail_image_alt_description || service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-6">
          <h3 className="mb-2 cursor-pointer text-xl font-bold text-gray-900 transition-colors">
            {service.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
            {plainDescription}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
