"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { hexToRgba } from "@/lib/utils";

interface ServicesCard5Props {
  service: ServicesPost;
  isFirst?: boolean;
  isLast?: boolean;
  onServiceClick?: (serviceSlug: string) => void;
  isEditable?: boolean;
}

export const ServicesCard5: React.FC<ServicesCard5Props> = ({
  service,
  isFirst,
  isLast,
  onServiceClick,
  isEditable = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const secondaryColor = theme?.colors?.secondary || "#EEF5C8";
  const primaryColor = theme?.colors?.primary || "#3B82F6";
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isEditable && onServiceClick?.(service.slug)}
      className="cursor-pointer"
    >
      {/* Background Highlight — bleeds using viewport-wide negative positioning */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key={`bg-${service.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "calc(-50vw + 50%)",
              right: "calc(-50vw + 50%)",
              backgroundColor: hexToRgba(secondaryColor, 0.25),
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Row content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 56px",
          alignItems: "center",
          gap: "1.5rem",
          padding: "2.25rem 2.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "black",
            margin: 0,
            fontFamily: theme?.fonts?.heading,
          }}
        >
          {service.title}
        </h3>

        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.65,
            color: hexToRgba("black", 0.65),
            margin: 0,
            fontFamily: theme?.fonts?.body,
          }}
        >
          {service.description.length > 200
            ? service.description.substring(0, 200) + "..."
            : service.description}
        </p>

        {/* Arrow — hidden on hover */}
        <div
          style={{ width: 44, height: 44, position: "relative", flexShrink: 0 }}
        >
          <AnimatePresence>
            {!isHovered && (
              <motion.div
                key={`arrow-${service.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: `1px solid ${hexToRgba(primaryColor, 0.1)}`,
                  backgroundColor: "#fff",
                }}
              >
                <ArrowUpRight size={16} color={primaryColor} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating image — just outside the right edge of the card, near the arrow */}
      <AnimatePresence>
        {isHovered && service.thumbnail_image && (
          <motion.div
            key={`img-${service.id}`}
            initial={{ opacity: 0, scale: 0.88, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.88, x: 16 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{
              position: "absolute",
              right: -100,
              top: "50%",
              y: "-50%",
              width: 180,
              height: 175,
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 8px 28px rgba(0,0,0,0.16)",
              zIndex: 50,
              pointerEvents: "none",
            }}
          >
            <img
              src={service.thumbnail_image}
              alt={service.thumbnail_image_alt_description || service.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashed divider between rows */}
      {!isLast && (
        <div
          style={{
            borderTop: `1px dashed ${hexToRgba("textColor", 0.1)}`,
            margin: "0 2.5rem",
          }}
        />
      )}
    </div>
  );
};
