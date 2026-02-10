"use client";
import React from "react";
import { OurClients2 } from "./our-clients-2";
import { EditableText } from "@/components/ui/editable-text";
import { OurClientsComponentData } from "@/types/owner-site/components/our-client";

interface OurClientsStyleProps {
  data: OurClientsComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OurClientsComponentData["data"]>) => void;
}

export const OurClientsStyle2: React.FC<OurClientsStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const { title = "Our Clients", subtitle } = data || {};

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background md:py-1">
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
          {subtitle && (
            <div className="mb-10 flex items-center justify-center gap-3 opacity-80">
              <EditableText
                value={subtitle}
                onChange={handleSubtitleChange}
                as="p"
                className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase"
                isEditable={isEditable}
                placeholder="Enter subtitle..."
              />
            </div>
          )}
        </div>

        <OurClients2 data={data} />
      </div>
    </section>
  );
};
