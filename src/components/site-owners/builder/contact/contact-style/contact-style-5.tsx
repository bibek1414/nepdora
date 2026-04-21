"use client";

import React from "react";
import { ContactData } from "@/types/owner-site/components/contact";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

  const { handleTextUpdate } = useBuilderLogic(
    data,
    onUpdate
  );

  return (
    <section className="bg-background py-16 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-2 lg:gap-24">
          {/* Left Column: Info */}
          <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="flex flex-col gap-6">
              <EditableText
                value={data.title}
                onChange={(val: string) => handleTextUpdate("title")(val)}
                isEditable={isEditable}
                className="text-4xl font-normal leading-tight tracking-tight md:text-5xl lg:text-6xl"
                style={{ fontFamily: theme?.fonts?.heading }}
              />
              <EditableText
                value={data.subtitle || ""}
                onChange={(val: string) => handleTextUpdate("subtitle")(val)}
                isEditable={isEditable}
                className="text-lg leading-relaxed text-muted-foreground max-w-md"
                style={{ fontFamily: theme?.fonts?.body }}
              />
            </div>

            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Location</span>
                <EditableText
                  value={data.contact_info?.address || "New York, NY"}
                  onChange={(val: string) => onUpdate?.({ contact_info: { ...data.contact_info, address: val } })}
                  isEditable={isEditable}
                  className="text-xl font-medium tracking-tight"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Work Inquiry</span>
                <EditableText
                  value={data.contact_info?.email || "hello@example.com"}
                  onChange={(val: string) => onUpdate?.({ contact_info: { ...data.contact_info, email: val } })}
                  isEditable={isEditable}
                  className="text-xl font-medium tracking-tight underline transition-opacity hover:opacity-70"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium tracking-tight">Name</label>
                <Input 
                  disabled 
                  placeholder="Daniel Hart" 
                  className="h-14 rounded-xl border-border bg-muted/30 px-6 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium tracking-tight">Email</label>
                <Input 
                  disabled 
                  placeholder="hello@example.com" 
                  className="h-14 rounded-xl border-border bg-muted/30 px-6 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium tracking-tight">Project Details</label>
                <Textarea 
                  disabled 
                  placeholder="Tell me about your project" 
                  className="min-h-[160px] rounded-2xl border-border bg-muted/30 p-6 focus:ring-primary"
                />
              </div>
            </div>

            <Button 
              disabled 
              className="h-16 rounded-full text-lg font-medium shadow-lg transition-all hover:shadow-xl"
              style={{ backgroundColor: theme?.colors?.primary, color: theme?.colors?.primaryForeground }}
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
