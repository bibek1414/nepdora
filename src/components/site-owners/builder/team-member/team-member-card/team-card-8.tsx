"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { EditableImage } from "@/components/ui/editable-image";

interface TeamCard8Props {
  member: TEAM;
  index: number;
  onClick: () => void;
  theme: any;
  isEditable?: boolean;
}

export function TeamCard8({
  member,
  index,
  onClick,
  theme,
  isEditable = false,
}: TeamCard8Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative aspect-3/4 overflow-hidden rounded-3xl ${
        isEditable ? "cursor-default" : "cursor-pointer"
      }`}
      onMouseEnter={() => !isEditable && setIsHovered(true)}
      onMouseLeave={() => !isEditable && setIsHovered(false)}
      onClick={() => !isEditable && onClick()}
    >
      <EditableImage
        src={member.photo}
        alt={member.name}
        isEditable={false} // Dynamic data
        onImageChange={() => {}}
        className={`h-full w-full object-cover transition-transform duration-700 ${
          isHovered ? "scale-110" : "scale-100"
        }`}
        width={600}
        height={800}
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute right-0 bottom-0 left-0 p-8 transition-all duration-500 ${
          isHovered
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 md:translate-y-0 md:opacity-100"
        }`}
      >
        <p
          className="mb-1 text-2xl font-medium text-white"
          style={{ fontFamily: theme.fonts.heading }}
        >
          {member.name}
        </p>
        <p
          className="text-sm text-white/70"
          style={{ fontFamily: theme.fonts.body }}
        >
          {member.role}
        </p>
      </div>

      <div
        className={`absolute right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all duration-500 ${
          isHovered ? "scale-100" : "scale-0 md:scale-100 md:opacity-0"
        }`}
      >
        {isHovered ? (
          <ChevronRight className="h-6 w-6 text-gray-900" />
        ) : (
          <Plus className="h-6 w-6 text-gray-900" />
        )}
      </div>
    </motion.div>
  );
}
