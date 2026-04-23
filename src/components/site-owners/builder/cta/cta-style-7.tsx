"use client";

import React from "react";
import { CTATemplate7Data } from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ChevronRight } from "lucide-react";
import { hexToRgba } from "@/lib/utils";

interface CTATemplate7Props {
  ctaData: CTATemplate7Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate7Data>) => void;
}

export const CTATemplate7: React.FC<CTATemplate7Props> = ({
  ctaData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate } = useBuilderLogic(ctaData, onUpdate);

  const handleButtonUpdate = (text: string, href: string) => {
    onUpdate?.({ buttonText: text, buttonHref: href });
  };

  return (
    <section className="mx-auto max-w-7xl px-8 pb-24">
      <div className="border-input grid grid-cols-1 items-end gap-8 rounded-2xl border p-10 md:grid-cols-12 md:p-16">
        <div className="md:col-span-8">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="label"
            isEditable={isEditable}
            style={{
              fontFamily: theme?.fonts?.heading,
            }}
          />
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            isEditable={isEditable}
            className="mt-4"
            style={{ fontFamily: theme?.fonts?.body }}
          />
        </div>
        <div className="md:col-span-4 md:text-right">
          <div className="relative z-30 inline-block">
            <EditableLink
              text={data.buttonText}
              href={data.buttonHref}
              onChange={handleButtonUpdate}
              isEditable={isEditable}
              siteUser={siteUser}
              className="inline-flex cursor-pointer items-center justify-center rounded-full px-8 py-3.5 text-lg font-medium transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: theme?.colors?.primary,
                color: theme?.colors?.primaryForeground,
                fontFamily: theme?.fonts?.body,
              }}
            >
              {data.buttonText} <ChevronRight className="ml-2 h-4 w-4" />
            </EditableLink>
          </div>
        </div>
      </div>
    </section>
  );
};
