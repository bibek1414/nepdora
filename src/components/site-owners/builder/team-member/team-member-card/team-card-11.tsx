"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Linkedin, Instagram, X } from "lucide-react";
import Image from "next/image";
import { TEAM } from "@/types/owner-site/admin/team-member";

interface TeamCard11Props {
  member: TEAM;
  index: number;
  onClick?: () => void;
}

export const TeamCard11: React.FC<TeamCard11Props> = ({
  member,
  index,
  onClick,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseOver = (idx: number | null) => {
    setHoveredIndex(idx);
  };

  return (
    <motion.div
      key={member.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => handleMouseOver(index)}
      onMouseLeave={() => handleMouseOver(null)}
      className="relative h-[400px] cursor-pointer overflow-hidden rounded-xl group"
      onClick={onClick}
    >
      {/* Photo */}
      <Image
        src={member.photo}
        alt={member.name}
        fill
        className="object-cover transition-transform duration-500 ease-out"
        style={{ transform: hoveredIndex === index ? "scale(1.04)" : "scale(1)" }}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end pb-7 transition-opacity duration-300"
        style={{ opacity: hoveredIndex === index ? 1 : 0 }}
      >
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="text-center px-4">
            <p className="text-base font-semibold text-white">{member.name}</p>
            <p className="text-sm font-medium text-white/80">{member.role}</p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {member.facebook && (
              <a
                href={member.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                onClick={(e) => e.stopPropagation()}
              >
                <Facebook size={14} />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin size={14} />
              </a>
            )}
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram size={14} />
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                onClick={(e) => e.stopPropagation()}
              >
                <X size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
