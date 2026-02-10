"use client";
import React from "react";
import { ContactForm3 } from "../contact-card/contact-form-3";
import { EditableText } from "@/components/ui/editable-text";
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

export const ContactStyle3: React.FC<ContactStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const { title = "Get in Touch", subtitle } = data || {};

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const handleDataChange = (newData: ContactData) => {
    onUpdate?.(newData);
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-4 text-4xl font-bold tracking-tight"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          {subtitle !== undefined && (
            <EditableText
              value={subtitle || ""}
              onChange={handleSubtitleChange}
              as="p"
              className="text-muted-foreground mx-auto max-w-3xl text-xl"
              isEditable={isEditable}
              placeholder="Enter subtitle..."
              multiline={true}
            />
          )}
        </div>

        <ContactForm3
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
