"use client";
import React from "react";
import { ContactForm10 } from "../contact-card/contact-form-10";
import {
  ContactComponentData,
  ContactData,
} from "@/types/owner-site/components/contact";

interface ContactStyleProps {
  data: ContactComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ContactComponentData["data"]>) => void;
}

export const ContactStyle10: React.FC<ContactStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const handleDataChange = (newData: ContactData) => {
    onUpdate?.(newData);
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ContactForm10
          data={data}
          siteUser={isEditable ? undefined : siteUser}
          isPreview={isEditable}
          isEditable={isEditable}
          onDataChange={isEditable ? handleDataChange : undefined}
        />
      </div>
    </section>
  );
};
