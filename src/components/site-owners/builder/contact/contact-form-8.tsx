import React, { useState } from "react";
import { ArrowRight, Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/site-owners/button";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";
import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";

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
    name: "Anonymous", // Default name since field is removed
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

    if (!isPreview && siteUser) {
      submitContactForm.mutate(formData, {
        onSuccess: () => {
          setFormData({
            name: "Anonymous",
            email: "",
            phone_number: "",
            message: "",
          });
        },
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
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2940&auto=format&fit=crop";
  const imageAlt = data.image_alt || "Traveler smiling";

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left Illustration/Image */}
          <div className="relative flex items-center justify-center">
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

          {/* Right Content */}
          <div className="flex flex-col justify-center">
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
                <Send
                  size={12}
                  className="rotate-45 text-[#83CD20]"
                  fill="#83CD20"
                />
              </div>

              {/* Main Title */}
              <EditableText
                value={title}
                onChange={updateTitle}
                as="h2"
                className="text-4xl leading-tight font-bold text-[#034833] md:text-5xl"
                isEditable={isEditable}
                placeholder="Let Your Wanderlust Guide You"
                multiline={true}
                useHeadingFont={true}
                style={{ color: primaryColor }}
              />
            </div>

            <div className="rounded-[30px] bg-[#F1F5EB] p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Email & Phone */}
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span
                      className="text-sm font-medium text-[#034833]"
                      style={{ color: primaryColor }}
                    >
                      Your Email {data.required_fields.email && "*"}
                    </span>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required={data.required_fields.email}
                        className="w-full rounded-full border-none bg-white py-3 pr-10 pl-5 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#83CD20]"
                      />
                      <Send
                        className="absolute top-1/2 right-4 -translate-y-1/2 rotate-45 text-[#034833]"
                        size={16}
                        style={{ color: primaryColor }}
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span
                      className="text-sm font-medium text-[#034833]"
                      style={{ color: primaryColor }}
                    >
                      Your Phone {data.required_fields.phone && "*"}
                    </span>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone_number"
                        placeholder="Your Phone"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required={data.required_fields.phone}
                        className="w-full rounded-full border-none bg-white py-3 pr-10 pl-5 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#83CD20]"
                      />
                      <Phone
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-[#034833]"
                        size={16}
                        style={{ color: primaryColor }}
                      />
                    </div>
                  </label>
                </div>

                {/* Row 2: Address */}
                <label className="flex flex-col gap-2">
                  <span
                    className="text-sm font-medium text-[#034833]"
                    style={{ color: primaryColor }}
                  >
                    Your Address
                  </span>
                  <div className="relative">
                    <input
                      placeholder="Your Address"
                      className="w-full rounded-full border-none bg-white py-3 pr-10 pl-5 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#83CD20]"
                    />
                    <MapPin
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-[#034833]"
                      size={16}
                      style={{ color: primaryColor }}
                    />
                  </div>
                </label>

                {/* Message */}
                <label className="flex flex-col gap-2">
                  <span
                    className="text-sm font-medium text-[#034833]"
                    style={{ color: primaryColor }}
                  >
                    Message {data.required_fields.message && "*"}
                  </span>
                  <div className="relative">
                    <textarea
                      name="message"
                      placeholder="Write Message.."
                      value={formData.message}
                      onChange={handleInputChange}
                      required={data.required_fields.message}
                      className="h-32 w-full resize-none rounded-3xl border-none bg-white p-5 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#83CD20]"
                    />
                    <Mail
                      className="absolute top-6 right-4 text-[#034833]"
                      size={16}
                      style={{ color: primaryColor }}
                    />
                  </div>
                </label>

                <Button
                  type="submit"
                  disabled={submitContactForm.isPending || isPreview}
                  className="w-full rounded-full py-6 text-base font-semibold text-white transition hover:opacity-90"
                  style={{
                    backgroundColor: secondaryColor, // Green button
                  }}
                >
                  {submitContactForm.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
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
