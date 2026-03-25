"use client";

import React from "react";
import { ContactData } from "@/types/owner-site/components/contact";
import { ContactForm4 } from "../contact-card/contact-form-4";
import { motion, Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

interface ContactStyle4Props {
  data: ContactData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ContactData>) => void;
}

export const ContactStyle4: React.FC<ContactStyle4Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const handleDataChange = (newData: ContactData) => {
    onUpdate?.(newData);
  };

  return (
    <motion.section
      className="relative overflow-hidden bg-white py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <div className="relative z-10 container mx-auto max-w-7xl px-4">
        <ContactForm4
          data={data}
          siteUser={isEditable ? undefined : siteUser}
          isPreview={isEditable}
          isEditable={isEditable}
          onDataChange={isEditable ? handleDataChange : undefined}
        />
      </div>
    </motion.section>
  );
};
