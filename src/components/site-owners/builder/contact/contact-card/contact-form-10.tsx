import React, { useState } from "react";
import { Clock, Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { Button } from "@/components/ui/site-owners/button";
import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";
import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";
import { toast } from "sonner";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";

interface ContactForm10Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

export const ContactForm10: React.FC<ContactForm10Props> = ({
  data,
  siteUser,
  isPreview = false,
  isEditable = false,
  onDataChange,
}) => {
  const [formData, setFormData] = useState<ContactFormSubmission>({
    name: "",
    phone_number: "",
    message: "",
  });

  const { data: siteConfig } = useSiteConfig();
  const submitContactForm = useSubmitContactForm(siteUser || "preview");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isPreview) {
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        phone_number: "",
        message: "",
      });
      return;
    }

    if (siteUser) {
      submitContactForm.mutate(formData, {
        onSuccess: () => {
          setFormData({
            name: "",
            phone_number: "",
            message: "",
          });
        },
        onError: (error: any) => {
          console.error("Form submission failed:", error);
        },
      });
    } else {
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        phone_number: "",
        message: "",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateTitle = (value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        title: value,
      });
    }
  };

  const updateSubtitle = (value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        subtitle: value,
      });
    }
  };

  const updateCtaTitle = (value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        cta_title: value,
      });
    }
  };

  const updateCtaSubtitle = (value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        cta_subtitle: value,
      });
    }
  };

  // Default values
  const title = data.title || "Get In Touch";
  const subtitle =
    data.subtitle || "We'd love to hear from you. Please fill out this form.";
  const ctaTitle = data.cta_title || "Drop Us A Line";
  const ctaSubtitle =
    data.cta_subtitle ||
    "Use the form below to get in touch with the sales team.";
  const buttonLabel = data.button_label || "Send Message";

  // Data from API config
  const contactAddress = siteConfig?.address || "Address not provided yet";
  const contactPhone = siteConfig?.phone || "Phone not provided yet";
  const contactEmail = siteConfig?.email || "Email not provided yet";
  const contactHours =
    siteConfig?.working_hours || "Working hours not provided yet";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
        {/* Left Content: Text & Contact Info */}
        <div className="flex flex-col space-y-12">
          <div className="space-y-4">
            <EditableText
              value={title}
              onChange={updateTitle}
              as="h2"
              className="text-4xl font-bold tracking-tight md:text-5xl"
              isEditable={isEditable}
              multiline={true}
            />
            <EditableText
              value={subtitle}
              onChange={updateSubtitle}
              as="p"
              className="text-lg text-gray-500"
              isEditable={isEditable}
              multiline={true}
            />
          </div>

          <div className="space-y-8">
            {/* Address */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Address</span>
                <span className="max-w-xs leading-relaxed text-gray-500">
                  {contactAddress}
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Phone</span>
                <span className="text-gray-500">{contactPhone}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Email</span>
                <span className="text-gray-500">{contactEmail}</span>
              </div>
            </div>

            {/* Opentime */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Opentime</span>
                <span className="max-w-xs leading-relaxed whitespace-pre-wrap text-gray-500">
                  {contactHours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Form Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-[0px_10px_40px_rgba(0,0,0,0.03)] md:p-12">
          <div className="mb-8 space-y-4">
            <EditableText
              value={ctaTitle}
              onChange={updateCtaTitle}
              as="h3"
              className="text-3xl font-bold tracking-tight"
              isEditable={isEditable}
            />
            <EditableText
              value={ctaSubtitle}
              onChange={updateCtaSubtitle}
              as="p"
              className="text-gray-500"
              isEditable={isEditable}
              multiline={true}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Name</span>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required={data.required_fields.name}
                className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm transition-all placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-200 focus:outline-none"
              />
            </label>

            {/* Phone Number */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Phone Number</span>
              <input
                type="tel"
                name="phone_number"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleInputChange}
                required={data.required_fields.phone}
                className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm transition-all placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-200 focus:outline-none"
              />
            </label>

            {/* Message */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Message</span>
              <textarea
                name="message"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleInputChange}
                required={data.required_fields.message}
                className="h-32 w-full resize-none rounded-2xl border border-gray-200 bg-white p-5 text-sm placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-200 focus:outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={submitContactForm.isPending}
              className="mt-4 w-full rounded-full border border-black bg-white py-4 text-base font-semibold text-black transition-all hover:bg-black hover:text-white"
            >
              {submitContactForm.isPending ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                buttonLabel
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
