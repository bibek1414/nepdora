"use client";

import React from "react";
import { ContactData } from "@/types/owner-site/components/contact";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ContactForm5 } from "../contact-card/contact-form-5";

interface ContactStyleProps {
  data: ContactData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<ContactData>) => void;
}

export const ContactStyle5: React.FC<ContactStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { handleTextUpdate } = useBuilderLogic(data, onUpdate);

  return (
    <div className="bg-background">
      {/* Header Section */}
      <section className="container mx-auto max-w-4xl px-6 pt-20 pb-12 md:pt-28">
        <EditableText
          value={data.subtitle || "Contact"}
          onChange={(val: string) => handleTextUpdate("subtitle")(val)}
          isEditable={isEditable}
          className="text-primary text-xs font-bold tracking-[0.2em] uppercase"
          style={{ fontFamily: theme?.fonts?.body }}
        />
        <EditableText
          value={data.title}
          onChange={(val: string) => handleTextUpdate("title")(val)}
          isEditable={isEditable}
          as="h1"
          className="text-foreground mt-4 font-serif text-5xl leading-tight sm:text-6xl"
          style={{ fontFamily: "Georgia, serif" }}
        />
        <EditableText
          value={data.description || ""}
          onChange={(val: string) => handleTextUpdate("description")(val)}
          isEditable={isEditable}
          className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed"
          style={{ fontFamily: theme?.fonts?.body }}
        />
      </section>

      {/* Main Content Section */}
        {/* Form Part */}

        {/* Aside Part */}
        <ContactForm5
          data={data}
          isEditable={isEditable}
          onUpdate={onUpdate}
          theme={theme}
        />

    </div>
  );
};
