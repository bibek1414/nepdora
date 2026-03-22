"use client";
import React from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { motion } from "framer-motion";

interface TeamCard9Props {
  member: TEAM;
  onClick?: () => void;
  isEditable?: boolean;
}

export const TeamCard9: React.FC<TeamCard9Props> = ({
  member,
  onClick,
  isEditable = false,
}) => {
  return (
    <motion.div
      className="group relative aspect-4/5 cursor-pointer overflow-hidden rounded-2xl"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={onClick}
    >
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          width={400}
          height={500}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <Users className="h-16 w-16 text-gray-400" />
        </div>
      )}

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Name/Role card on hover */}
      <div className="absolute right-6 bottom-6 left-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-gray-900/90 p-4 text-white shadow-lg backdrop-blur-sm">
          <div>
            <h4 className="text-lg leading-tight font-bold text-white">
              {member.name}
            </h4>
            <p className="mt-0.5 text-xs font-medium text-gray-300">
              {member.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
