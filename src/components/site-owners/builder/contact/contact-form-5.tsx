import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";

import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";

interface ContactForm5Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

export const ContactForm5: React.FC<ContactForm5Props> = ({
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
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
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

  // Split phone/email by newlines for display
  const phoneNumbers = data.contact_info?.phone
    ? data.contact_info.phone.split("\n").filter(Boolean)
    : ["+00 123 321 456", "+00 123 456 678"];

  const emailAddresses = data.contact_info?.email
    ? data.contact_info.email.split("\n").filter(Boolean)
    : ["yourmail@mail.com", "demomail@mail.com"];

  const address = data.contact_info?.address || "Write Your Address here";
  const title = data.title || "Start a new<br />project?";

  // Use theme colors with fallbacks
  const darkBackground = theme.colors.primary || "#1a1a3e";
  const lightBackground = theme.colors.background || "#f9fafb";
  const textOnDark = theme.colors.primaryForeground || "#ffffff";
  const textOnLight = theme.colors.text || "#111827";
  const mutedTextOnDark = `${textOnDark}CC`; // ~80% opacity
  const iconColorOnCircle = theme.colors.primary || darkBackground;

  return (
    <div className="w-full">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-0 overflow-hidden rounded-lg shadow-lg md:grid-cols-2">
        {/* Left Side - Contact Info */}
        <div
          className="flex min-h-[600px] flex-col justify-center p-12 md:min-h-[800px] md:p-16"
          style={{
            backgroundColor: darkBackground,
            color: textOnDark,
          }}
        >
          <EditableText
            value={title}
            onChange={updateTitle}
            as="h1"
            className="mb-20 text-5xl leading-tight font-bold"
            isEditable={isEditable}
            placeholder="Start a new project?"
            multiline={true}
            useHeadingFont={true}
          />

          {/* Call Us Section */}
          <div className="mb-12 flex items-start gap-6">
            <div className="flex-shrink-0">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white"
                style={{ backgroundColor: textOnDark }}
              >
                <Phone
                  className="h-6 w-6"
                  style={{ color: iconColorOnCircle }}
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold">Call Us</h3>
              {isEditable ? (
                <EditableText
                  value={
                    data.contact_info?.phone ||
                    "+00 123 321 456\n+00 123 456 678"
                  }
                  onChange={value => updateContactInfo("phone", value)}
                  as="div"
                  className="space-y-1"
                  style={{ color: mutedTextOnDark }}
                  isEditable={true}
                  placeholder="+00 123 321 456\n+00 123 456 678"
                  multiline={true}
                />
              ) : (
                <div className="space-y-1" style={{ color: mutedTextOnDark }}>
                  {phoneNumbers.map((phone, index) => (
                    <p key={index}>{phone}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email Us Section */}
          <div className="mb-12 flex items-start gap-6">
            <div className="flex-shrink-0">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white"
                style={{ backgroundColor: textOnDark }}
              >
                <Mail
                  className="h-6 w-6"
                  style={{ color: iconColorOnCircle }}
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold">Email Us</h3>
              {isEditable ? (
                <EditableText
                  value={
                    data.contact_info?.email ||
                    "yourmail@mail.com\ndemomail@mail.com"
                  }
                  onChange={value => updateContactInfo("email", value)}
                  as="div"
                  className="space-y-1"
                  style={{ color: mutedTextOnDark }}
                  isEditable={true}
                  placeholder="yourmail@mail.com\ndemomail@mail.com"
                  multiline={true}
                />
              ) : (
                <div className="space-y-1" style={{ color: mutedTextOnDark }}>
                  {emailAddresses.map((email, index) => (
                    <p key={index}>{email}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white"
                style={{ backgroundColor: textOnDark }}
              >
                <MapPin
                  className="h-6 w-6"
                  style={{ color: iconColorOnCircle }}
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold">Address</h3>
              <EditableText
                value={address}
                onChange={value => updateContactInfo("address", value)}
                as="p"
                style={{ color: mutedTextOnDark }}
                isEditable={isEditable}
                placeholder="Write Your Address here"
                multiline={true}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div
          className="flex min-h-[600px] flex-col justify-center p-12 md:min-h-[800px] md:p-16"
          style={{
            backgroundColor: lightBackground,
          }}
        >
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border-b bg-transparent px-0 py-3 transition focus:outline-none [&::placeholder]:opacity-60"
                style={{
                  borderColor: `${textOnLight}33`,
                  color: textOnLight,
                }}
                onFocus={e => {
                  e.target.style.borderColor = theme.colors.primary;
                }}
                onBlur={e => {
                  e.target.style.borderColor = `${textOnLight}33`;
                }}
                required={data.required_fields.name}
              />
            </div>

            {data.showEmail && (
              <div className="mb-8">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email*"
                  value={formData.email}
                  onChange={handleInputChange}
                  required={data.required_fields.email}
                  className="w-full border-b bg-transparent px-0 py-3 transition focus:outline-none [&::placeholder]:opacity-60"
                  style={{
                    borderColor: `${textOnLight}33`,
                    color: textOnLight,
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = theme.colors.primary;
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = `${textOnLight}33`;
                  }}
                />
              </div>
            )}

            {data.showPhone && (
              <div className="mb-8">
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Mobile phone number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required={data.required_fields.phone}
                  className="w-full border-b bg-transparent px-0 py-3 transition focus:outline-none [&::placeholder]:opacity-60"
                  style={{
                    borderColor: `${textOnLight}33`,
                    color: textOnLight,
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = theme.colors.primary;
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = `${textOnLight}33`;
                  }}
                />
              </div>
            )}

            <div className="mb-12">
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                required={data.required_fields.message}
                className="w-full resize-none border-b bg-transparent px-0 py-3 transition focus:outline-none [&::placeholder]:opacity-60"
                style={{
                  borderColor: `${textOnLight}33`,
                  color: textOnLight,
                }}
                onFocus={e => {
                  e.target.style.borderColor = theme.colors.primary;
                }}
                onBlur={e => {
                  e.target.style.borderColor = `${textOnLight}33`;
                }}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={submitContactForm.isPending || isPreview}
              className="w-full px-8 py-3 font-medium transition"
            >
              {submitContactForm.isPending ? (
                <>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
