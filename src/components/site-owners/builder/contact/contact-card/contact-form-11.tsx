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

interface ContactForm11Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

export const ContactForm11: React.FC<ContactForm11Props> = ({
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
  const { data: siteConfig } = useSiteConfig();
  const submitContactMutation = useSubmitContactForm(siteUser || "preview");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditable) return;

    submitContactMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Message sent successfully!");
        setFormData({ name: "", phone_number: "", message: "", email: "" });
      },
    });
  };

  const handleUpdate = (field: keyof ContactData) => (value: string) => {
    if (onDataChange) onDataChange({ ...data, [field]: value });
  };

  return (
    <div className="mx-auto max-w-5xl">
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
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder=" "
                className="peer w-full rounded-full border border-gray-100 bg-gray-50 px-6 py-4 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/5"
              />
              <label className="pointer-events-none absolute top-4 left-6 text-xs font-medium text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase">
                Full Name
              </label>
            </div>

            {/* Floating Input Phone */}
            <div className="relative">
              <input
                type="tel"
                name="phone_number"
                required
                value={formData.phone_number}
                onChange={e =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                placeholder=" "
                className="peer w-full rounded-full border border-gray-100 bg-gray-50 px-6 py-4 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/5"
              />
              <label className="pointer-events-none absolute top-4 left-6 text-xs font-medium text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase">
                Phone Number
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder=" "
              className="peer w-full rounded-full border border-gray-100 bg-gray-50 px-6 py-4 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/5"
            />
            <label className="pointer-events-none absolute top-4 left-6 text-xs font-medium text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase">
              Email Address
            </label>
          </div>

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
              placeholder=" "
              className="peer w-full resize-none rounded-[1.5rem] border border-gray-100 bg-gray-50 px-6 py-4 pt-8 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/5"
            />
            <label className="pointer-events-none absolute top-6 left-6 text-sm font-medium text-gray-400 transition-all peer-placeholder-shown:top-8 peer-focus:top-3 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase">
              How can we help?
            </label>
          </div>

          <Button
            type="submit"
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
