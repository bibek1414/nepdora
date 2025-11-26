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

interface ContactForm6Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

export const ContactForm6: React.FC<ContactForm6Props> = ({
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

    if (!isPreview && siteUser) {
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
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateContactInfo = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        contact_info: {
          ...data.contact_info,
          [field]: value,
        },
      });
    }
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

  const updateDescription = (value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        description: value,
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

  const updateImage = (imageUrl: string, altText?: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        image_url: imageUrl,
        image_alt: altText || data.image_alt,
      });
    }
  };

  const toggleRequiredField = (field: keyof typeof data.required_fields) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        required_fields: {
          ...data.required_fields,
          [field]: !data.required_fields[field],
        },
      });
    }
  };

  const toggleShowField = (field: "showEmail" | "showPhone") => {
    if (onDataChange) {
      onDataChange({
        ...data,
        [field]: !data[field],
      });
    }
  };

  // Use theme colors with fallbacks
  const primaryColor = theme.colors.primary || "#034833";
  const secondaryColor = theme.colors.secondary || "#83CD20";
  const mutedBackground = theme.colors.primary || "#F1F5EB";

  // Default values with proper fallbacks
  const title = data.title || "Let Your Wanderlust Guide You";
  const subtitle = data.subtitle || "Contact Information";
  const description =
    data.description ||
    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy text for decades. Reach out and let's make your next move seamless.";
  const ctaTitle = data.cta_title || "Let's Do Great!";
  const ctaSubtitle =
    data.cta_subtitle ||
    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy.";
  const imageUrl =
    data.image_url ||
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2940&auto=format&fit=crop";
  const imageAlt = data.image_alt || "Traveler smiling";

  // Contact info with fallbacks
  const contactEmail = data.contact_info?.email || "hello@example.com";
  const contactPhone = data.contact_info?.phone || "+1 (555) 123-4567";
  const contactAddress =
    data.contact_info?.address || "123 Business Street, City, State 12345";

  return (
    <section className="px-4 sm:px-6 lg:px-12">
      <div
        className="relative overflow-hidden rounded-[50px]"
        style={{ backgroundColor: mutedBackground }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div
            className="absolute -top-32 -left-24 h-72 w-72 rounded-full"
            style={{ backgroundColor: `${primaryColor}15` }}
          />
          <div
            className="absolute right-0 bottom-10 h-96 w-96 rounded-full bg-gradient-to-br blur-3xl"
            style={{
              background: `linear-gradient(135deg, ${secondaryColor}40, transparent)`,
            }}
          />
        </div>

        <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:p-16">
          {/* Left Illustration */}
          <div className="relative h-[1100px] rounded-lg bg-[#034833]/5">
            <EditableImage
              src={imageUrl}
              alt={imageAlt}
              onImageChange={updateImage}
              isEditable={isEditable}
              className="h-[1100px] w-full rounded-4xl object-cover"
              cloudinaryOptions={{
                folder: "contact-images",
                resourceType: "image",
              }}
              disableImageChange={false}
              showAltEditor={isEditable}
            />

            <div className="pointer-events-none absolute inset-4 rounded-[32px] border border-white/30" />
          </div>

          {/* Right Content */}
          <div className="relative rounded-[40px] bg-white p-6 shadow-xl ring-1 ring-white/60 md:p-10">
            <div className="mb-10 max-w-2xl space-y-4">
              {/* Subtitle Badge */}
              <div
                className="inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-semibold tracking-[0.3em] uppercase"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                <EditableText
                  value={subtitle}
                  onChange={updateSubtitle}
                  as="span"
                  isEditable={isEditable}
                  className="inline-flex items-center gap-3"
                  placeholder="Contact Information"
                />
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send size={16} />
                </span>
              </div>

              {/* Main Title */}
              <EditableText
                value={title}
                onChange={updateTitle}
                as="h2"
                className="!text-4xl leading-tight font-bold md:text-5xl"
                isEditable={isEditable}
                placeholder="Let Your Wanderlust Guide You"
                multiline={true}
                useHeadingFont={true}
              />

              {/* Description */}
              <EditableText
                value={description}
                onChange={updateDescription}
                as="p"
                className="text-base"
                isEditable={isEditable}
                placeholder="Enter your contact section description..."
                multiline={true}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Field Configuration in Edit Mode */}

              {/* Top row */}
              <div className="grid gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: primaryColor }}
                  >
                    Your Name {data.required_fields.name && "*"}
                  </span>
                  <div className="flex items-center gap-3 rounded-full border px-5 py-3">
                    <input
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={data.required_fields.name}
                      className="w-full text-sm placeholder:opacity-50 focus:outline-none"
                    />
                  </div>
                </label>

                {data.showEmail && (
                  <label className="flex flex-col gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: primaryColor }}
                    >
                      Your Email {data.required_fields.email && "*"}
                    </span>
                    <div className="flex items-center gap-3 rounded-full border px-5 py-3">
                      <input
                        type="email"
                        name="email"
                        placeholder="name@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required={data.required_fields.email}
                        className="w-full text-sm placeholder:opacity-50 focus:outline-none"
                      />
                    </div>
                  </label>
                )}
              </div>

              {/* Second row */}
              <div className="grid gap-6 md:grid-cols-2">
                {data.showPhone && (
                  <label className="flex flex-col gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: primaryColor }}
                    >
                      Your Phone {data.required_fields.phone && "*"}
                    </span>
                    <div className="flex items-center gap-3 rounded-full border px-5 py-3">
                      <input
                        type="tel"
                        name="phone_number"
                        placeholder="+977 0000000000"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required={data.required_fields.phone}
                        className="w-full text-sm placeholder:opacity-50 focus:outline-none"
                      />
                    </div>
                  </label>
                )}

                <label className="flex flex-col gap-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: primaryColor }}
                  >
                    Your Address
                  </span>
                  <div className="flex items-center gap-3 rounded-full border px-5 py-3">
                    <input
                      placeholder="123 Windy Street, London"
                      className="w-full text-sm placeholder:opacity-50 focus:outline-none"
                    />
                  </div>
                </label>
              </div>

              {/* Message */}
              <label className="flex flex-col gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color: primaryColor }}
                >
                  Message {data.required_fields.message && "*"}
                </span>
                <div className="rounded-[30px] border px-5 py-4">
                  <textarea
                    name="message"
                    placeholder="Write Message.."
                    value={formData.message}
                    onChange={handleInputChange}
                    required={data.required_fields.message}
                    className="h-28 w-full resize-none text-sm placeholder:opacity-50 focus:outline-none"
                  />
                </div>
              </label>

              <Button
                type="submit"
                disabled={submitContactForm.isPending || isPreview}
                className="flex h-15 w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold text-white transition disabled:opacity-50"
                style={{
                  backgroundColor: primaryColor,
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = secondaryColor;
                }}
              >
                {submitContactForm.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>

            {/* CTA card */}
            <div className="mt-10 rounded-[30px] p-8 shadow-[0px_20px_60px_rgba(2,38,20,0.08)]">
              <EditableText
                value={ctaTitle}
                onChange={updateCtaTitle}
                as="p"
                className="!text-3xl font-semibold"
                style={{ color: primaryColor }}
                isEditable={isEditable}
                placeholder="Let's Do Great!"
                multiline={true}
              />

              <EditableText
                value={ctaSubtitle}
                onChange={updateCtaSubtitle}
                as="p"
                className="mt-3 text-sm"
                isEditable={isEditable}
                placeholder="Enter your call to action description..."
                multiline={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
