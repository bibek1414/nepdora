"use client";
import React, { useState } from "react";
import { ChevronRight, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EditableText } from "@/components/ui/editable-text";
import { ContactData } from "@/types/owner-site/components/contact";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";
import { cn } from "@/lib/utils";

import { ContactInfoCard6 } from "../contact-card/contact-info-card-6";

interface ContactStyleProps {
  data: ContactData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ContactData>) => void;
}

export const ContactStyle6: React.FC<ContactStyleProps> = ({
  data,
  isEditable = false,
  siteUser = "",
  onUpdate,
}) => {
  const {
    title = "Have something worth getting right? Let’s talk.",
    subtitle = "Get in touch",
    description = "A short note is the best way to start a conversation. We respond to every inquiry within two working days.",
  } = data || {};

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const submitContactForm = useSubmitContactForm(siteUser);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTextUpdate = (field: keyof ContactData) => (val: string) => {
    onUpdate?.({ [field]: val });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditable) return;

    const fullMessage = `
Company: ${formData.company || "N/A"}
Budget: ${formData.budget || "N/A"}
Message: ${formData.message}
    `.trim();

    submitContactForm.mutate(
      {
        name: formData.name,
        email: formData.email,
        message: fullMessage,
      },
      {
        onSuccess: () => {
          setFormData({
            name: "",
            email: "",
            company: "",
            budget: "",
            message: "",
          });
        },
      }
    );
  };

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Info Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2">
              <EditableText
                value={subtitle}
                onChange={handleTextUpdate("subtitle")}
                as="span"
                className="block text-sm font-semibold tracking-wide mb-2"
                isEditable={isEditable}
                style={{ fontFamily: theme?.fonts?.body }}
              />
            </div>
            <EditableText
              value={title}
              onChange={handleTextUpdate("title")}
              as="label"
              className="font-display text-3xl leading-[1.05] tracking-tight text-balance md:text-5xl"
              isEditable={isEditable}
              style={{ fontFamily: theme?.fonts?.heading }}
              multiline
            />
            <EditableText
              value={description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="text-muted-foreground mt-6 max-w-md text-pretty"
              isEditable={isEditable}
              style={{ fontFamily: theme?.fonts?.body }}
              multiline
            />

            <div className="mt-12">
              <ContactInfoCard6 data={data} theme={theme} />
            </div>

            {data.checklist && data.checklist.length > 0 && (
              <ul className="mt-10 space-y-4">
                {data.checklist.map((item, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex items-start gap-3 text-sm"
                  >
                    <div
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: theme?.colors?.primary }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-card border-border -sm space-y-6 rounded-xl border p-8 md:p-10"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cta-name">Your name</Label>
                  <Input
                    id="cta-name"
                    name="name"
                    required
                    placeholder="Alex Marsh"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isEditable || submitContactForm.isPending}
                    className="border-border bg-background focus:border-primary h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-company">Company</Label>
                  <Input
                    id="cta-company"
                    name="company"
                    placeholder="Lumen Co."
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={isEditable || submitContactForm.isPending}
                    className="border-border bg-background focus:border-primary h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cta-email">Email</Label>
                  <Input
                    id="cta-email"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isEditable || submitContactForm.isPending}
                    className="border-border bg-background focus:border-primary h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-budget">Approximate budget</Label>
                  <Input
                    id="cta-budget"
                    name="budget"
                    placeholder="£25k–£75k"
                    value={formData.budget}
                    onChange={handleInputChange}
                    disabled={isEditable || submitContactForm.isPending}
                    className="border-border bg-background focus:border-primary h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-message">What are you working on?</Label>
                <Textarea
                  id="cta-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="A few sentences are perfect. Timelines, goals, anything that helps us reply usefully."
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isEditable || submitContactForm.isPending}
                  className="border-border bg-background focus:border-primary min-h-[120px] resize-none"
                />
              </div>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-xs">
                  We treat every inquiry confidentially.
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isEditable || submitContactForm.isPending}
                  className="h-12 px-6"
                  style={{
                    backgroundColor: theme?.colors?.primary,
                    color: theme?.colors?.primaryForeground,
                  }}
                >
                  {submitContactForm.isPending ? "Sending…" : "Send message"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
