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
    <div className="bg-background">
      {/* Header Section */}
      <section className="container mx-auto max-w-4xl px-6 pt-20 pb-12 md:pt-28">
        <EditableText
          value={data.subtitle || "Contact"}
          onChange={(val: string) => handleTextUpdate("subtitle")(val)}
          isEditable={isEditable}
          className="text-xs uppercase tracking-[0.2em] text-primary font-bold"
          style={{ fontFamily: theme?.fonts?.body }}
        />
        <EditableText
          value={data.title}
          onChange={(val: string) => handleTextUpdate("title")(val)}
          isEditable={isEditable}
          as="h1"
          className="mt-4 font-serif text-5xl leading-tight text-foreground sm:text-6xl"
          style={{ fontFamily: "Georgia, serif" }}
        />
        <EditableText
          value={data.description || ""}
          onChange={(val: string) => handleTextUpdate("description")(val)}
          isEditable={isEditable}
          className="mt-6 max-w-xl text-base text-muted-foreground leading-relaxed"
          style={{ fontFamily: theme?.fonts?.body }}
        />
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto max-w-4xl grid gap-12 px-6 py-12 md:grid-cols-[1fr_280px]">
        {/* Form Part */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Your name</label>
              <Input 
                disabled 
                placeholder="Name" 
                className="h-12 rounded-lg border-border bg-background px-4 text-sm focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Email</label>
              <Input 
                disabled 
                placeholder="Email" 
                className="h-12 rounded-lg border-border bg-background px-4 text-sm focus:border-primary"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Company (optional)</label>
            <Input 
              disabled 
              placeholder="Company" 
              className="h-12 rounded-lg border-border bg-background px-4 text-sm focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Message</label>
            <Textarea 
              disabled 
              placeholder="Tell me a bit about your project." 
              className="min-h-[160px] resize-none rounded-lg border-border bg-background p-4 text-sm focus:border-primary"
            />
          </div>
          <Button 
            disabled 
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 h-auto"
          >
            Send message
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        {/* Aside Part */}
        <aside className="space-y-8 border-t border-border pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Email</p>
            <EditableText
              value={data.contact_info?.email || "hello@example.com"}
              onChange={(val: string) => onUpdate?.({ contact_info: { ...data.contact_info, email: val } })}
              isEditable={isEditable}
              className="mt-2 block text-sm text-foreground hover:text-primary transition-colors underline decoration-foreground/20"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Phone</p>
            <EditableText
              value={data.contact_info?.phone || "+1 234 567 890"}
              onChange={(val: string) => onUpdate?.({ contact_info: { ...data.contact_info, phone: val } })}
              isEditable={isEditable}
              className="mt-2 text-sm text-foreground"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Based in</p>
            <EditableText
              value={data.contact_info?.address || "New York, NY"}
              onChange={(val: string) => onUpdate?.({ contact_info: { ...data.contact_info, address: val } })}
              isEditable={isEditable}
              className="mt-2 text-sm text-foreground"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Elsewhere</p>
            <div className="mt-2 space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-foreground hover:text-primary cursor-default">
                Twitter
              </div>
              <div className="flex items-center gap-2 text-foreground hover:text-primary cursor-default">
                LinkedIn
              </div>
              <div className="flex items-center gap-2 text-foreground hover:text-primary cursor-default">
                Instagram
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
