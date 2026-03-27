"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ServicesPost } from "@/types/owner-site/admin/services";

interface ServicesCard4Props {
  service: ServicesPost;
  idx: number;
  isEditable?: boolean;
  onServiceClick?: (serviceSlug: string) => void;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

export const ServicesCard4: React.FC<ServicesCard4Props> = ({
  service,
  idx,
  isEditable = false,
  onServiceClick,
}) => {
  const plainDescription = stripHtml(service.description || "");

  return (
    <div
      className="block"
      onClick={() => !isEditable && onServiceClick?.(service.slug)}
    >
      <motion.div
        className="group h-full cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: idx * 0.08,
        }}
      >
        {service.thumbnail_image && (
          <div className="relative mb-6 h-48 w-full overflow-hidden rounded-t-xl">
            <Image
              src={service.thumbnail_image}
              alt={
                service.thumbnail_image_alt_description ||
                service.title
              }
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <h3 className="group-hover:text-primary-600 mb-2 text-lg font-bold text-gray-900 transition-colors">
          {service.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
          {plainDescription}
        </p>
      </motion.div>
    </div>
  );
};
