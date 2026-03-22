"use client";

import React from "react";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  img: string;
  delay: number;
}

interface AboutTeamClientProps {
  teamMembers: TeamMember[];
}

export const AboutTeamAnimations: React.FC<AboutTeamClientProps> = ({
  teamMembers,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
      {teamMembers.map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: member.delay }}
          className="group cursor-pointer"
        >
          <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-slate-100 grayscale transition-all duration-500 group-hover:grayscale-0 sm:mb-4 sm:rounded-2xl">
            <img
              src={member.img}
              alt={member.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            {member.name}
          </h3>
          <p className="text-xs text-slate-400 sm:text-sm">{member.role}</p>
        </motion.div>
      ))}
    </div>
  );
};

export const AboutTeamHeaderFadeIn: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end sm:gap-8"
    >
      {children}
    </motion.div>
  );
};

export const AboutTeamSectionWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mx-auto mb-16 border-t border-slate-100 px-4 pt-12 sm:mb-20 sm:px-6 sm:pt-24 lg:max-w-7xl lg:px-20"
    >
      {children}
    </motion.section>
  );
};
