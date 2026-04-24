"use client";

import React from "react";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { sanitizeContent } from "@/utils/html-sanitizer";

interface ServicesCard8Props {
  service: ServicesPost;
  theme: any;
  isEditable?: boolean;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesCard8: React.FC<ServicesCard8Props> = ({
  service,
  theme,
  isEditable = false,
  onServiceClick,
}) => {
  return (
    <li
      className="group cursor-pointer border-t border-gray-100 pt-6"
      onClick={() => !isEditable && onServiceClick?.(service.slug)}
    >
      <h3
        className="font-serif text-xl text-gray-950 transition-colors"
        style={{
          fontFamily: theme?.fonts?.heading,
        }}
      >
        {service.title}
      </h3>
      <div
        className="mt-2 text-sm leading-relaxed text-gray-600"
        style={{ fontFamily: theme?.fonts?.body }}
        dangerouslySetInnerHTML={{
          __html: sanitizeContent(service.description || ""),
        }}
      />
    </li>
  );
};
