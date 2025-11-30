"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Rocket,
  Lightbulb,
  Puzzle,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Link from "next/link";
import { useUpdateComponentMutation } from "@/hooks/owner-site/components/use-unified";
import { toast } from "sonner";

interface ServicesCard6Props {
  component: ServicesComponentData;
  services: ServicesPost[];
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ServicesComponentData) => void;
  onServiceClick?: (serviceSlug: string, order: number) => void;
}

const iconMap = {
  FileText,
  Rocket,
  Lightbulb,
  Puzzle,
  ShieldCheck,
};

// Map service index to icon (cycling through available icons)
const getIconForIndex = (index: number) => {
  const icons: Array<keyof typeof iconMap> = [
    "FileText",
    "Rocket",
    "Lightbulb",
    "Puzzle",
    "ShieldCheck",
  ];
  return icons[index % icons.length];
};

export const ServicesCard6: React.FC<ServicesCard6Props> = ({
  component,
  services,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onServiceClick,
}) => {
  const [data, setData] = useState({
    tag: component.data.tag || "[Core Services]",
    title: component.data.title || "Explore Services",
    italicWord: component.data.italicWord || "Services",
    buttonText: component.data.buttonText || "Contact Us",
    buttonLink: component.data.buttonLink || "#",
  });

  const { data: themeResponse } = useThemeQuery();
  const updateServicesComponent = useUpdateComponentMutation(
    pageSlug || "",
    "services"
  );

  // Get theme colors with fallback to defaults
  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
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
      },
    [themeResponse]
  );

  // Handle text field updates
  const handleTextUpdate =
    (field: "tag" | "title" | "italicWord") => (value: string) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);

      if (!pageSlug) return;

      const componentId = component.component_id || component.id?.toString();
      if (!componentId) return;

      updateServicesComponent.mutate(
        {
          componentId,
          data: {
            ...component.data,
            [field]: value,
          },
        },
        {
          onError: error => {
            toast.error("Failed to update", {
              description:
                error instanceof Error ? error.message : "Please try again",
            });
          },
        }
      );

      if (onUpdate) {
        onUpdate(componentId, {
          ...component,
          data: {
            ...component.data,
            [field]: value,
          },
        });
      }
    };

  // Handle button link updates
  const handleButtonLinkUpdate = (text: string, href: string) => {
    const updatedData = {
      ...data,
      buttonText: text,
      buttonLink: href,
    };
    setData(updatedData);

    if (!pageSlug) return;

    const componentId = component.component_id || component.id?.toString();
    if (!componentId) return;

    updateServicesComponent.mutate(
      {
        componentId,
        data: {
          ...component.data,
          buttonText: text,
          buttonLink: href,
        },
      },
      {
        onError: error => {
          toast.error("Failed to update button", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );

    if (onUpdate) {
      onUpdate(componentId, {
        ...component,
        data: {
          ...component.data,
          buttonText: text,
          buttonLink: href,
        },
      });
    }
  };

  const handleServiceClick = (service: ServicesPost) => {
    if (onServiceClick && component.order !== undefined) {
      onServiceClick(service.slug, component.order);
    }
  };

  const getDetailsUrl = (service: ServicesPost): string => {
    if (siteUser) {
      return `/preview/${siteUser}/services/${service.slug}`;
    }
    return `/services/${service.slug}`;
  };

  // Strip HTML from description
  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  // Process all service descriptions outside of the map
  const processedServices = useMemo(() => {
    return services.map(service => {
      const plainText = stripHtml(service.description || "");
      const description = plainText
        ? plainText
        : "We help you define clear goals and build winning strategies that drive measurable business growth.";
      return {
        ...service,
        processedDescription: description,
      };
    });
  }, [services]);

  return (
    <section
      className="bg-white py-20"
      style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.fonts.body,
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Row */}
        <div className="mb-12 flex flex-col items-end justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <EditableText
              value={data.tag}
              onChange={handleTextUpdate("tag")}
              as="span"
              isEditable={isEditable}
              placeholder="[Core Services]"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
              className="mb-2 block text-sm font-medium text-gray-600"
            />
            <h2
              className="text-3xl font-bold md:text-4xl lg:text-5xl"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
              }}
            >
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                as="span"
                isEditable={isEditable}
                placeholder="Explore Services"
              />{" "}
              <span className="font-serif font-normal italic">
                <EditableText
                  value={data.italicWord}
                  onChange={handleTextUpdate("italicWord")}
                  as="span"
                  isEditable={isEditable}
                  placeholder="Services"
                />
              </span>
            </h2>
          </div>
          <div className="flex-shrink-0">
            <EditableLink
              text={data.buttonText}
              href={data.buttonLink || "#"}
              onChange={handleButtonLinkUpdate}
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
                fontFamily: theme.fonts.body,
              }}
              className="inline-flex items-center justify-between rounded-full py-2 pr-2 pl-6 text-[15px] font-medium shadow-lg shadow-blue-900/10 transition-colors hover:opacity-90 [&:hover_.icon-rotate]:rotate-45"
              textPlaceholder="Contact Us"
              hrefPlaceholder="#"
              isEditable={isEditable}
              siteUser={siteUser}
            >
              <>
                <span>{data.buttonText || "Contact Us"}</span>
                <span className="icon-rotate ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300">
                  <ArrowUpRight
                    className="h-5 w-5"
                    style={{ color: theme.colors.primary }}
                  />
                </span>
              </>
            </EditableLink>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {processedServices.map((service, idx) => {
            const iconKey = getIconForIndex(idx);
            const IconComponent = iconMap[iconKey];

            const CardWrapper = siteUser
              ? ({ children }: { children: React.ReactNode }) => (
                  <Link href={getDetailsUrl(service)}>{children}</Link>
                )
              : ({ children }: { children: React.ReactNode }) => (
                  <div
                    onClick={() => handleServiceClick(service)}
                    className="cursor-pointer"
                  >
                    {children}
                  </div>
                );

            const cardId = `service-card-${service.id}`;

            return (
              <CardWrapper key={service.id}>
                <div
                  className="group rounded-3xl border border-transparent bg-gray-50 p-10 transition-all duration-300 hover:border-blue-100 hover:bg-white hover:shadow-xl"
                  data-card-id={cardId}
                >
                  <style>{`
                    [data-card-id="${cardId}"]:hover .icon-container-${service.id} {
                      background-color: ${theme.colors.primary} !important;
                    }
                    [data-card-id="${cardId}"]:hover .icon-container-${service.id} svg {
                      color: white !important;
                    }
                    [data-card-id="${cardId}"]:hover .read-more-${service.id} {
                      color: ${theme.colors.primary} !important;
                    }
                    [data-card-id="${cardId}"]:hover .read-more-icon-${service.id} {
                      transform: translateX(0.25rem);
                    }
                  `}</style>
                  <div
                    className={`icon-container-${service.id} mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-colors`}
                    style={{
                      backgroundColor: "white",
                      color: theme.colors.primary,
                    }}
                  >
                    {IconComponent && (
                      <IconComponent
                        size={20}
                        className="transition-colors"
                        style={{
                          color: theme.colors.primary,
                        }}
                      />
                    )}
                  </div>

                  <h3
                    className="mb-4 text-xl font-bold text-gray-900"
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.fonts.heading,
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    className="mb-8 text-sm leading-relaxed text-gray-500"
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.fonts.body,
                    }}
                  >
                    {service.processedDescription}
                  </p>

                  <div
                    className={`read-more-${service.id} flex items-center gap-2 text-sm font-bold text-gray-900 transition-colors`}
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.fonts.body,
                    }}
                  >
                    <span>Read More</span>
                    <div
                      className={`read-more-icon-${service.id} flex h-5 w-5 items-center justify-center rounded-full text-white transition-transform`}
                      style={{
                        backgroundColor: theme.colors.primary,
                      }}
                    >
                      <ArrowUpRight size={10} />
                    </div>
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};
