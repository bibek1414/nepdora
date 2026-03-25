"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";
import { toast } from "sonner";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";

interface ContactForm4Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

export const ContactForm4: React.FC<ContactForm4Props> = ({
  data,
  siteUser,
  isPreview,
  isEditable,
  onDataChange,
}) => {
  const [formData, setFormData] = useState<ContactFormSubmission>({
    name: "",
    phone_number: "",
    message: "",
    email: "",
  });

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const submitContactMutation = useSubmitContactForm(siteUser || "preview");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditable) return;

    submitContactMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: "", phone_number: "", message: "", email: "" });
      },
    });
  };

  const handleUpdate = (field: keyof ContactData) => (value: string) => {
    if (onDataChange) onDataChange({ ...data, [field]: value });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <EditableText
        value={data.title}
        onChange={handleUpdate("title")}
        isEditable={isEditable}
        as="h2"
        className="mb-4 text-center text-2xl font-bold"
      />
      {/* Form Side */}
      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Floating Input Name */}
            <Input
              type="text"
              name="name"
              label="Full Name"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="h-14 rounded-full border-gray-100 bg-gray-50 text-sm focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-gray-900/5"
            />

            {/* Floating Input Phone */}
            <Input
              type="tel"
              name="phone_number"
              label="Phone Number"
              required
              value={formData.phone_number}
              onChange={e =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              className="h-14 rounded-full border-gray-100 bg-gray-50 text-sm focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-gray-900/5"
            />
          </div>

          <Input
            type="email"
            name="email"
            label="Email Address"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="h-14 rounded-full border-gray-100 bg-gray-50 text-sm focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-gray-900/5"
          />

          {/* Floating Textarea */}
          <div className="relative">
            <textarea
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={e =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="How can we help you?"
              className="peer w-full resize-none rounded-[1.5rem] border border-gray-100 bg-gray-50 px-6 py-4 pt-8 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/5"
            />
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={submitContactMutation.isPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-70"
            style={{ backgroundColor: theme?.colors?.primary || "#000" }}
            value={data.button_label}
          >
            {submitContactMutation.isPending ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {data.button_label}
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
