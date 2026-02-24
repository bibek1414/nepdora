"use client";
import React from "react";
import { OurClients4 } from "./our-clients-4";
import { OurClientsComponentData } from "@/types/owner-site/components/our-client";

interface OurClientsStyleProps {
  data: OurClientsComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OurClientsComponentData["data"]>) => void;
}

export const OurClientsStyle4: React.FC<OurClientsStyleProps> = ({ data }) => {
  return (
    <section className="bg-background py-8 md:py-12">
      <div className="container mx-auto max-w-[1400px]">
        <OurClients4 data={data} />
      </div>
    </section>
  );
};
