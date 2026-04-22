"use client";

import React from "react";
import { CTATemplate6Data } from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ChevronRight } from "lucide-react";

interface CTATemplate6Props {
  ctaData: CTATemplate6Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate6Data>) => void;
}

export const CTATemplate6: React.FC<CTATemplate6Props> = ({
  ctaData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate, handleButtonUpdate } = useBuilderLogic(
    {
      ...ctaData,
      eyebrow: ctaData.eyebrow || "Let's talk",
      title:
        ctaData.title || "Have a project in mind? I'd love to hear about it.",
      buttons: ctaData.buttons?.length
        ? ctaData.buttons
        : [
            { id: "1", text: "Send a note", variant: "primary", href: "#" },
            { id: "2", text: "View resume", variant: "outline", href: "#" },
          ],
    },
    onUpdate
  );

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="bg-foreground text-background animate-in fade-in slide-in-from-bottom-8 rounded-2xl p-10 duration-1000 md:p-16">
          <EditableText
            value={data.eyebrow}
            onChange={(val: string) => handleTextUpdate("eyebrow")(val)}
            isEditable={isEditable}
            as="title"
            multiline
            style={{ fontFamily: theme?.fonts?.body }}
          />

          <EditableText
            value={data.title}
            onChange={(val: string) => handleTextUpdate("title")(val)}
            as="title"
            multiline
            isEditable={isEditable}
            className="mt-4"
          />

          <div className="mt-8 flex flex-wrap gap-3">
            {data.buttons?.slice(0, 2).map((button, index) => (
              <EditableLink
                key={button.id}
                text={button.text}
                href={button.href || "#"}
                onChange={(newText, newHref) =>
                  handleButtonUpdate("buttons")(button.id, newText, newHref)
                }
                isEditable={isEditable}
                siteUser={siteUser}
                className={
                  index === 0
                    ? "border-background/30 inline-flex h-auto items-center gap-2 rounded-full border bg-white px-5 py-2.5 text-sm text-black"
                    : "border-background/30 inline-flex h-auto items-center gap-2 rounded-full border px-5 py-2.5 text-sm text-white"
                }
                style={{ fontFamily: theme?.fonts?.body }}
              >
                <span>{button.text}</span>
                {index === 0 && (
                  <ChevronRight className="h-4 w-4 transition-transform" />
                )}
              </EditableLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
