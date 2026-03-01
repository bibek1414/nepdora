import React, { useState } from "react";
import {
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Send,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/site-owners/button";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";
import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";
import { toast } from "sonner";

interface ContactForm8Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

export const ContactForm8: React.FC<ContactForm8Props> = ({
  data,
  siteUser,
  isPreview = false,
  isEditable = false,
  onDataChange,
}) => {
  const [formData, setFormData] = useState<ContactFormSubmission>({
    name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#034833",
      primaryForeground: "#FFFFFF",
      secondary: "#83CD20",
      secondaryForeground: "#FFFFFF",
      background: "#FFFFFF",
      muted: "#F1F5EB",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const submitContactForm = useSubmitContactForm(siteUser || "preview");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isPreview) {
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
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
            email: "",
            phone_number: "",
            message: "",
          });
        },
      });
    } else {
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
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

  const updateImage = (imageUrl: string, altText?: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        image_url: imageUrl,
        image_alt: altText || data.image_alt,
      });
    }
  };

  // Use theme colors with fallbacks
  const primaryColor = theme.colors.primary || "#034833";
  const secondaryColor = theme.colors.secondary || "#83CD20";
  // const mutedBackground = theme.colors.muted || "#F1F5EB"; // Not used in new clean design

  // Default values with proper fallbacks
  const title = data.title || "Let Your Wanderlust Guide You";
  const subtitle = data.subtitle || "CONTACT INFORMATION";
  const imageUrl =
    data.image_url ||
    "/fallback/image-not-found.png";
  const imageAlt = data.image_alt || "Traveler smiling";

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left Illustration/Image - Shows second on mobile, first on desktop */}
          <div className="relative order-2 flex items-center justify-center lg:order-none">
            {/* Abstract background blob if needed, keeping it clean for now as requested */}
            <div className="relative w-full max-w-md lg:max-w-full">
              <EditableImage
                src={imageUrl}
                alt={imageAlt}
                onImageChange={updateImage}
                isEditable={isEditable}
                className="h-auto w-full object-contain"
                cloudinaryOptions={{
                  folder: "contact-images",
                  resourceType: "image",
                }}
                disableImageChange={false}
                showAltEditor={isEditable}
              />
            </div>
          </div>

          {/* Right Content - Shows first on mobile, second on desktop */}
          <div className="order-1 flex flex-col justify-center lg:order-none">
            <div className="mb-8 space-y-2">
              {/* Subtitle */}
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                <EditableText
                  value={subtitle}
                  onChange={updateSubtitle}
                  as="span"
                  isEditable={isEditable}
                  placeholder="CONTACT INFORMATION"
                />
                <Send size={12} fill="#83CD20" />
              </div>

              {/* Main Title */}
              <EditableText
                value={title}
                onChange={updateTitle}
                as="h2"
                className="text-4xl leading-tight font-bold md:text-5xl"
                isEditable={isEditable}
                placeholder="Let Your Wanderlust Guide You"
                multiline={true}
                useHeadingFont={true}
              />
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Full Name {data.required_fields.name && "*"}
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={data.required_fields.name}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm transition-all focus:border-[#83CD20] focus:ring-1 focus:ring-[#83CD20] focus:outline-none"
                  />
                </label>

                {/* Email & Phone */}
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Email Address {data.required_fields.email && "*"}
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required={data.required_fields.email}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm transition-all focus:border-[#83CD20] focus:ring-1 focus:ring-[#83CD20] focus:outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Phone Number {data.required_fields.phone && "*"}
                    </span>
                    <input
                      type="tel"
                      name="phone_number"
                      placeholder="Enter your phone"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      required={data.required_fields.phone}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm transition-all focus:border-[#83CD20] focus:ring-1 focus:ring-[#83CD20] focus:outline-none"
                    />
                  </label>
                </div>

                {/* Message */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Message {data.required_fields.message && "*"}
                  </span>
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleInputChange}
                    required={data.required_fields.message}
                    className="h-32 w-full resize-none rounded-lg border border-gray-200 bg-gray-50/30 p-4 text-sm transition-all focus:border-[#83CD20] focus:ring-1 focus:ring-[#83CD20] focus:outline-none"
                  />
                </label>

                <Button
                  type="submit"
                  disabled={submitContactForm.isPending}
                  className="w-full rounded-full py-6 text-base font-semibold"
                  variant="default"
                >
                  {submitContactForm.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
