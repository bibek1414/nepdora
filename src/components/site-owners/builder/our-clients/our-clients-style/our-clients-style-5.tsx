"use client";
import React from "react";
import { OurClients5 } from "../our-clients-card/our-clients-5";
import { EditableText } from "@/components/ui/editable-text";
import { OurClientsComponentData } from "@/types/owner-site/components/our-client";

interface OurClientsStyleProps {
  data: OurClientsComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OurClientsComponentData["data"]>) => void;
}

export const OurClientsStyle5: React.FC<OurClientsStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const { title = "Our Clients", subtitle = "Authorized Excellence Partner" } =
    data || {};

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background py-3 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {title && (
          <div className="mb-4 text-center">
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="text-foreground text-3xl font-bold tracking-tight md:text-4xl"
              isEditable={isEditable}
              placeholder="Enter title..."
            />
          </div>
        )}

        <div className="mb-12 flex justify-center text-center">
          <EditableText
            value={subtitle}
            onChange={handleSubtitleChange}
            as="p"
            className="text-center text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
          />
        </div>

        <OurClients5 data={data} />
      </div>
    </section>
  );
};
