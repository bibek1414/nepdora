"use client";
import React from "react";
import { ContactForm9 } from "../contact-card/contact-form-9";
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

export const ContactStyle9: React.FC<ContactStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const handleDataChange = (newData: ContactData) => {
    onUpdate?.(newData);
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <ContactForm9
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
