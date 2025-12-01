import React, { useState } from "react";
import { Check, Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/site-owners/button";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";
import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";

interface ContactForm9Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

export const ContactForm9: React.FC<ContactForm9Props> = ({
  data,
  siteUser,
  isPreview = false,
}) => {
  const [formData, setFormData] = useState<ContactFormSubmission>({
    name: "Anonymous",
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

  // Use theme colors with fallbacks
  const primaryColor = theme.colors.primary || "#034833";
  const secondaryColor = theme.colors.secondary || "#83CD20";

  // Default values
  const title = data.title || "Remote Destinations Seeking Solitude";
  const subtitle = data.subtitle || "SUCCESS STORY";
  const description =
    data.description ||
    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy text ever";
  const checklist = data.checklist || [
    "Mistakes To Avoid",
    "Your Startup",
    "Knew About Fonts",
    "Knew About Fonts",
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left Content: Text & Checklist */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-4">
              {/* Subtitle */}
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">💸</span> {subtitle}
                </span>
              </div>

              {/* Main Title */}
              <h2
                className="text-4xl leading-tight font-bold md:text-5xl"
                style={{ color: primaryColor }}
              >
                {title}
              </h2>

              {/* Description */}
              <p className="text-lg leading-relaxed text-gray-500">
                {description}
              </p>
            </div>

            {/* Checklist */}
            <ul className="mt-4 space-y-3">
              {checklist.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check size={20} style={{ color: secondaryColor }} />
                  <span
                    className="text-lg font-medium"
                    style={{ color: primaryColor }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content: Form */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Email */}
                <label className="flex flex-col gap-2">
                  <span
                    className="text-sm font-medium"
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
                      className="w-full rounded-full border border-gray-200 bg-white py-3 pr-10 pl-5 text-sm placeholder:text-gray-400 focus:ring-1 focus:outline-none"
                      style={{ borderColor: "#E5E7EB" }}
                    />
                    <Send
                      className="absolute top-1/2 right-4 -translate-y-1/2 rotate-45 text-gray-400"
                      size={16}
                    />
                  </div>
                </label>

                {/* Phone */}
                <label className="flex flex-col gap-2">
                  <span
                    className="text-sm font-medium"
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
                      className="w-full rounded-full border border-gray-200 bg-white py-3 pr-10 pl-5 text-sm placeholder:text-gray-400 focus:ring-1 focus:outline-none"
                      style={{ borderColor: "#E5E7EB" }}
                    />
                    <Phone
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                </label>
              </div>

              {/* Address */}
              <label className="flex flex-col gap-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: primaryColor }}
                >
                  Your Address
                </span>
                <div className="relative">
                  <input
                    placeholder="Your Address"
                    className="w-full rounded-full border border-gray-200 bg-white py-3 pr-10 pl-5 text-sm placeholder:text-gray-400 focus:ring-1 focus:outline-none"
                    style={{ borderColor: "#E5E7EB" }}
                  />
                  <MapPin
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </label>

              {/* Message */}
              <label className="flex flex-col gap-2">
                <span
                  className="text-sm font-medium"
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
                    className="h-32 w-full resize-none rounded-3xl border border-gray-200 bg-white p-5 text-sm placeholder:text-gray-400 focus:ring-1 focus:outline-none"
                    style={{ borderColor: "#E5E7EB" }}
                  />
                  <Mail
                    className="absolute top-6 right-4 text-gray-400"
                    size={16}
                  />
                </div>
              </label>

              <Button
                type="submit"
                disabled={submitContactForm.isPending || isPreview}
                className="w-full rounded-full py-6 text-base font-semibold text-white transition hover:opacity-90"
                style={{
                  backgroundColor: secondaryColor,
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
