"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AboutTeam: React.FC = () => {
  const teamMembers = [
    {
      name: "Sushil Sharma",
      role: "CEO",
      img: "/fallback/image-not-found.png",
      delay: 0,
    },
    {
      name: "Priya KC",
      role: "Product",
      img: "/fallback/image-not-found.png",
      delay: 0.2,
    },
    {
      name: "Amit Pradhan",
      role: "Tech Lead",
      img: "/fallback/image-not-found.png",
      delay: 0.4,
    },
    {
      name: "Sita Gurung",
      role: "Customer Success",
      img: "/fallback/image-not-found.png",
      delay: 0.6,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mx-auto mb-16 border-t border-slate-100 px-4 pt-12 sm:mb-20 sm:px-6 sm:pt-24 lg:max-w-7xl lg:px-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end sm:gap-8"
      >
        <div>
          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            Real people. Real support.
          </h2>
          <p className="max-w-lg text-sm text-slate-500 sm:text-base">
            We don't hide behind chatbots. We work out of Sankhamul. Come say
            hi.
          </p>
        </div>
        <Button variant="outline" size="sm" className="sm:size-default">
          Join the Team
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
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
    </motion.section>
  );
};

export default AboutTeam;
