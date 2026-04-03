"use client";
import React from "react";
import { OurClients3 } from "../our-clients-card/our-clients-3";
import { EditableText } from "@/components/ui/editable-text";
import { OurClientsComponentData } from "@/types/owner-site/components/our-client";

interface OurClientsStyleProps {
  data: OurClientsComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OurClientsComponentData["data"]>) => void;
}

export const OurClientsStyle3: React.FC<OurClientsStyleProps> = ({
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
    <section className="bg-background py-3 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <OurClients3 data={data} />
      </div>
    </section>
  );
};
