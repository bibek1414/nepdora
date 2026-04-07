"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Plus, ChevronRight } from "lucide-react";

interface ServicesCard6Props {
  service: ServicesPost;
  siteUser?: string;
  className?: string;
  isFirst?: boolean;
}

export const ServicesCard6: React.FC<ServicesCard6Props> = ({
  service,
  siteUser,
  className,
  isFirst,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const { title, description, thumbnail_image } = service;

  const [isHovered, setIsHovered] = useState(false);

  // Provide fallback image to ensure dynamic visuals load properly
  const imageSrc =
    thumbnail_image || "https://picsum.photos/seed/placeholder/800/600";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[2rem] p-8 flex flex-col justify-between min-h-[400px] cursor-pointer transition-all duration-500 h-full ${
        className || ""
      }`}
      style={{
        backgroundColor: "var(--bg-card, #f7f7f7)",
        transform: isHovered ? "translateY(-10px)" : "translateY(0px)",
      }}
    >
      {/* Absolute Image Background */}
      <div 
        className="absolute inset-0 transition-opacity duration-700 z-0"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <Image
          src={imageSrc}
          alt={title || "Service"}
          fill
          className="object-cover transition-transform duration-1000 ease-out"
          style={{ transform: isHovered ? "scale(1)" : "scale(1.1)" }}
          referrerPolicy="no-referrer"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col h-full bg-transparent flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3
            className="text-2xl font-medium transition-colors duration-500"
            style={{ 
              fontFamily: theme?.fonts?.heading,
              color: isHovered ? "white" : "inherit"
            }}
          >
            {title}
          </h3>
          
          <div 
            className="w-10 h-10 rounded-full border border-black/10 flex-shrink-0 flex items-center justify-center transition-all duration-300 relative overflow-hidden bg-transparent"
            style={{ 
              backgroundColor: isHovered ? "white" : "transparent",
              color: isHovered ? "black" : "inherit"
            }}
          >
            <Plus 
              className="w-5 h-5 absolute transition-all duration-300 text-black" 
              style={{
                opacity: isHovered ? 0 : 1,
                transform: isHovered ? "scale(0) rotate(90deg)" : "scale(1) rotate(0deg)"
              }}
            />
            <ChevronRight 
              className="w-5 h-5 absolute transition-all duration-300 text-black" 
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)"
              }}
            />
          </div>
        </div>
        
        <p 
          className="max-w-xs transition-colors duration-500 line-clamp-3"
          style={{ color: isHovered ? "rgba(255,255,255,0.8)" : "rgba(26,26,26,0.6)" }}
        >
          {description}
        </p>

        {/* Static Image for mobile/non-hover when it's just the card bg */}
        <div className="mt-auto pt-8 relative w-full rounded-2xl overflow-hidden md:hidden block min-h-[200px]">
          <Image
            src={imageSrc}
            alt={title || "Service"}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
};
