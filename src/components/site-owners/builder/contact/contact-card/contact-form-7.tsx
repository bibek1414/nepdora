import React, { useState } from "react";
import { ArrowUpRight, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import {
  ContactData,
  ContactFormSubmission,
  ContactLocationCard,
  ContactLocationGalleryItem,
} from "@/types/owner-site/components/contact";
import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";

interface ContactForm7Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

const FALLBACK_LOCATION_CARDS: ContactLocationCard[] = [
  {
    id: "usa-hq",
    title: "USA Headquarter",
    description: "Los Angeles, CA 90017<br/>United States",
  },
  {
    id: "eu-hq",
    title: "Europe Headquarter",
    description: "Ireland, County Dublin D02<br/>ABC1",
  },
];

const FALLBACK_LOCATION_GALLERY: ContactLocationGalleryItem[] = [
  {
    id: "dublin",
    label: "Dublin",
    image_url:
      "/fallback/image-not-found.png",
  },
  {
    id: "los-angeles",
    label: "Los Angeles",
    image_url:
      "/fallback/image-not-found.png",
  },
  {
    id: "remote",
    label: "Remote",
    image_url:
      "/fallback/image-not-found.png",
  },
];

export const ContactForm7: React.FC<ContactForm7Props> = ({
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
      primary: "#2E3BFF",
      primaryForeground: "#FFFFFF",
      secondary: "#EEF2FF",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
      muted: "#F7F5EF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const accentColor = theme.colors.primary || "#2E3BFF";
  const accentForeground = theme.colors.primaryForeground || "#FFFFFF";
  const extendedColors = theme.colors as Record<string, string>;
  const mutedBackground = extendedColors.muted || "#F7F5EF";
  const sectionBackground =
    extendedColors.background ||
    "linear-gradient(180deg, #F9F8F4 0%, #FFFFFF 100%)";

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

  const updateData = (updates: Partial<ContactData>) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      ...updates,
    });
  };

  const updateContactInfo = (
    field: keyof NonNullable<ContactData["contact_info"]>,
    value: string
  ) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      contact_info: {
        ...data.contact_info,
        [field]: value,
      },
    });
  };

  const prepareEditableLocationCards = () =>
    data.location_cards?.length
      ? [...data.location_cards]
      : FALLBACK_LOCATION_CARDS.map(card => ({ ...card }));

  const prepareEditableGallery = () =>
    data.location_gallery?.length
      ? [...data.location_gallery]
      : FALLBACK_LOCATION_GALLERY.map(item => ({ ...item }));

  const handleLocationCardChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    if (!onDataChange) return;
    const updatedCards = prepareEditableLocationCards();
    if (!updatedCards[index]) return;
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value,
    };
    onDataChange({
      ...data,
      location_cards: updatedCards,
    });
  };

  const handleGalleryLabelChange = (index: number, value: string) => {
    if (!onDataChange) return;
    const updatedGallery = prepareEditableGallery();
    if (!updatedGallery[index]) return;
    updatedGallery[index] = {
      ...updatedGallery[index],
      label: value,
    };
    onDataChange({
      ...data,
      location_gallery: updatedGallery,
    });
  };

  const handleGalleryImageChange = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    if (!onDataChange) return;
    const updatedGallery = prepareEditableGallery();
    if (!updatedGallery[index]) return;
    updatedGallery[index] = {
      ...updatedGallery[index],
      image_url: imageUrl,
      image_alt: altText || updatedGallery[index].image_alt,
    };
    onDataChange({
      ...data,
      location_gallery: updatedGallery,
    });
  };

  const locationCards =
    data.location_cards && data.location_cards.length > 0
      ? data.location_cards
      : FALLBACK_LOCATION_CARDS;

  const locationGallery =
    data.location_gallery && data.location_gallery.length > 0
      ? data.location_gallery
      : FALLBACK_LOCATION_GALLERY;

  const locationTag = data.subtitle || "[Visit Us]";
  const locationTitle = data.title || "Office <em>Location</em>";
  const locationDescription =
    data.description ||
    "Our office is conveniently located in the heart of these cities, providing easy access for clients and partners.";

  const contactTag = data.contact_tag || "[Contact]";
  const contactTitle = data.cta_title || "Drop Us a Message";
  const contactDescription =
    data.cta_subtitle ||
    "We're always happy to hear from you and will get back to you as soon as possible.";
  const buttonLabel = data.button_label || "Send Message";

  const contactEmail = data.contact_info?.email || "contactinfo@gmail.com";
  const contactPhone = data.contact_info?.phone || "+99 1234 5478";
  const contactAddress = data.contact_info?.address || "See on Google Map";

  const infoItems = [
    {
      id: "email",
      label: "Email",
      icon: Mail,
      value: contactEmail,
      placeholder: "contact@yourcompany.com",
      field: "email" as const,
    },
    {
      id: "phone",
      label: "Call",
      icon: Phone,
      value: contactPhone,
      placeholder: "+00 123 456 789",
      field: "phone" as const,
    },
    {
      id: "visit",
      label: "Visit Us",
      icon: MapPin,
      value: contactAddress,
      placeholder: "See on Google Map",
      field: "address" as const,
    },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          typeof sectionBackground === "string" ? sectionBackground : undefined,
        backgroundColor:
          typeof sectionBackground === "string" ? undefined : sectionBackground,
      }}
    >
      {/* <div className="pointer-events-none absolute -top-40 left-[-10%] h-96 w-96 rounded-full bg-gradient-to-br from-white/40 to-white/0 blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-[-15%] h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-[#E0E8FF]/70 to-transparent blur-3xl" /> */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
          <div className="space-y-6">
            <EditableText
              value={locationTag}
              onChange={value => updateData({ subtitle: value })}
              as="span"
              className="text-sm font-semibold tracking-[0.3em] text-gray-500 uppercase"
              isEditable={isEditable}
              placeholder="[Visit Us]"
            />

            <EditableText
              value={locationTitle}
              onChange={value => updateData({ title: value })}
              as="h2"
              className="text-4xl leading-tight font-semibold text-gray-900 md:text-5xl"
              isEditable={isEditable}
              placeholder="Office Location"
              multiline={true}
              useHeadingFont={true}
            />

            <EditableText
              value={locationDescription}
              onChange={value => updateData({ description: value })}
              as="p"
              className="text-base leading-relaxed text-gray-600"
              isEditable={isEditable}
              placeholder="Describe your office locations"
              multiline={true}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {locationCards.map((card, index) => (
                <div
                  key={card.id || index}
                  className="rounded-2xl border border-black/5 bg-white/90 p-6 backdrop-blur"
                >
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${accentColor}12` }}
                  >
                    <MapPin size={18} color={accentColor} />
                  </div>
                  <EditableText
                    value={card.title}
                    onChange={value =>
                      handleLocationCardChange(index, "title", value)
                    }
                    as="h4"
                    className="text-lg font-semibold text-gray-900"
                    isEditable={isEditable}
                    placeholder="Location title"
                  />
                  <EditableText
                    value={card.description}
                    onChange={value =>
                      handleLocationCardChange(index, "description", value)
                    }
                    as="p"
                    className="mt-2 text-sm text-gray-500"
                    isEditable={isEditable}
                    placeholder="Address information"
                    multiline={true}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid grid-cols-2 gap-5">
              {locationGallery.slice(0, 2).map((item, index) => (
                <div
                  key={item.id || index}
                  className="relative h-60 overflow-hidden rounded-3xl"
                >
                  <EditableImage
                    src={item.image_url}
                    alt={item.image_alt || item.label}
                    onImageChange={(imageUrl, altText) =>
                      handleGalleryImageChange(index, imageUrl, altText)
                    }
                    isEditable={isEditable}
                    className="h-full w-full object-cover"
                    width={800}
                    height={600}
                    cloudinaryOptions={{
                      folder: "contact-gallery",
                      resourceType: "image",
                    }}
                    showAltEditor={isEditable}
                  />
                  <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold tracking-wide text-gray-900 uppercase">
                    <EditableText
                      value={item.label}
                      onChange={value => handleGalleryLabelChange(index, value)}
                      as="span"
                      className="text-xs font-semibold tracking-wide uppercase"
                      isEditable={isEditable}
                      placeholder="Label"
                    />
                  </div>
                </div>
              ))}
            </div>
            {locationGallery[2] && (
              <div className="relative h-64 overflow-hidden rounded-3xl md:h-72">
                <EditableImage
                  src={locationGallery[2].image_url}
                  alt={locationGallery[2].image_alt || locationGallery[2].label}
                  onImageChange={(imageUrl, altText) =>
                    handleGalleryImageChange(2, imageUrl, altText)
                  }
                  isEditable={isEditable}
                  className="h-full w-full object-cover"
                  width={1200}
                  height={600}
                  cloudinaryOptions={{
                    folder: "contact-gallery",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                />
                <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold tracking-wide text-gray-900 uppercase">
                  <EditableText
                    value={locationGallery[2].label}
                    onChange={value => handleGalleryLabelChange(2, value)}
                    as="span"
                    className="text-xs font-semibold tracking-wide uppercase"
                    isEditable={isEditable}
                    placeholder="Label"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-6">
            <EditableText
              value={contactTag}
              onChange={value => updateData({ contact_tag: value })}
              as="span"
              className="text-sm font-semibold tracking-[0.3em] text-gray-500 uppercase"
              isEditable={isEditable}
              placeholder="[Contact]"
            />

            <EditableText
              value={contactTitle}
              onChange={value => updateData({ cta_title: value })}
              as="h3"
              className="text-4xl font-semibold text-gray-900"
              isEditable={isEditable}
              placeholder="Drop Us a Message"
              multiline={true}
              useHeadingFont={true}
            />

            <EditableText
              value={contactDescription}
              onChange={value => updateData({ cta_subtitle: value })}
              as="p"
              className="text-base leading-relaxed text-gray-600"
              isEditable={isEditable}
              placeholder="Explain how quickly you respond..."
              multiline={true}
            />

            <div className="space-y-8 pt-4">
              {infoItems.map(item => (
                <div key={item.id} className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${accentColor}14` }}
                  >
                    <item.icon size={20} color={accentColor} />
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-500">{item.label}</p>
                    <EditableText
                      value={item.value}
                      onChange={value => updateContactInfo(item.field, value)}
                      as="div"
                      className="text-lg font-semibold text-gray-900"
                      isEditable={isEditable}
                      placeholder={item.placeholder}
                      multiline={item.field !== "email"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-[32px] bg-white/95 p-8 ring-1 ring-black/5 md:p-12">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Full Name {data.required_fields.name && "*"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={data.required_fields.name}
                      className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm transition outline-none focus:border-transparent focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Email Address {data.required_fields.email && "*"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required={data.required_fields.email}
                      className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm transition outline-none focus:border-transparent focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Phone Number {data.required_fields.phone && "*"}
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="+00 000 000 000"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required={data.required_fields.phone}
                    className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm transition outline-none focus:border-transparent focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Write Your Message {data.required_fields.message && "*"}
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder="I want to collaborate"
                    value={formData.message}
                    onChange={handleInputChange}
                    required={data.required_fields.message}
                    className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm transition outline-none focus:border-transparent focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitContactForm.isPending || isPreview}
                  className="group flex w-full cursor-pointer items-center justify-between rounded-full px-6 py-4 text-base font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  <span>
                    {submitContactForm.isPending ? "Sending..." : buttonLabel}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner transition-transform duration-300 group-hover:rotate-45">
                    {submitContactForm.isPending ? (
                      <Loader2
                        className="h-5 w-5 animate-spin"
                        style={{ color: theme.colors.primary }}
                      />
                    ) : (
                      <ArrowUpRight
                        size={18}
                        style={{ color: theme.colors.primary }}
                      />
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
