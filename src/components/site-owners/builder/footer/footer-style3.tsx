import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Plane,
  Send,
} from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { NewsletterForm } from "./shared/newsletter-form";
import { EditableText } from "@/components/ui/editable-text";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";
import { getProcessedCopyright } from "./shared/footer-utils";
import { MadeWithLove } from "./shared/made-with-love";

interface FooterStyle3Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  onUpdate?: (updatedData: Partial<FooterData>) => void;
  siteUser?: string;
}

export function FooterStyle3({
  footerData,
  isEditable,
  onEditClick,
  onUpdate,
  siteUser,
}: FooterStyle3Props) {
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

  const { data, getImageUrl, handleTextUpdate } = useBuilderLogic(
    footerData,
    onUpdate
  );

  const pathname = usePathname();

  // Get colors from theme with fallbacks
  const primaryColor = theme.colors?.primary || "#3B82F6";
  const primaryForeground = theme.colors?.primaryForeground || "#FFFFFF";
  const secondaryForeground = theme.colors?.secondaryForeground || "#1F2937";

  // Extended FooterData with CTA fields
  type ExtendedFooterData = FooterData & {
    ctaText1?: string;
    ctaText2?: string;
  };

  // Extract CTA text from footer data or use defaults
  const extendedFooterData = data as ExtendedFooterData;
  const ctaText1 =
    extendedFooterData.ctaText1 || "Need Any Support For\nTour And Visa?";
  const ctaText2 =
    extendedFooterData.ctaText2 || "Are You Ready For Get\nStarted Travelling?";

  // Find sections by title
  const servicesSection = data.sections.find(
    section =>
      section.title.toLowerCase().includes("service") ||
      section.title === "Company"
  );

  const usefulLinksSection = data.sections.find(
    section =>
      section.title.toLowerCase().includes("useful") ||
      section.title === "Resources"
  );

  const legalSection = data.sections.find(
    section =>
      section.title.toLowerCase().includes("legal") || section.title === "Legal"
  );

  return (
    <div
      className="group relative"
      style={{ backgroundColor: footerData.backgroundColor || primaryColor }}
    >
      <footer
        className="relative mx-auto mt-12 max-w-7xl pt-12 sm:mt-16 sm:pt-16 md:mt-20 md:pt-20"
        style={{ color: footerData.textColor || "white" }}
      >
        {/* Floating CTA Bar */}
        <div
          className="absolute top-0 left-1/2 flex w-[95%] min-w-[288px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-2xl border p-4 shadow-2xl transition-colors sm:w-[90%] sm:rounded-3xl sm:p-6 md:w-[80%] md:flex-row md:rounded-full md:p-12"
          style={{
            backgroundColor: footerData.backgroundColor || primaryColor,
            borderColor: footerData.textColor
              ? footerData.textColor + "20"
              : "rgba(255,255,255,0.1)",
          }}
        >
          <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3 md:mb-0 md:gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white sm:h-11 sm:w-11 md:h-12 md:w-12"
              style={{
                backgroundColor: primaryColor,
                color: secondaryForeground,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="sm:h-6 sm:w-6"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3 className="md:text-md text-base leading-tight font-bold whitespace-pre-line sm:text-lg lg:text-xl">
              <EditableText
                value={ctaText1}
                onChange={handleTextUpdate("ctaText1" as any)}
                as="span"
                isEditable={isEditable}
                placeholder="Need Any Support For\nTour And Visa?"
                multiline={true}
              />
            </h3>
          </div>

          <div
            className="mx-4 hidden h-8 w-px sm:mx-6 sm:h-10 md:mx-8 md:block md:h-12"
            style={{
              backgroundColor: footerData.textColor
                ? footerData.textColor + "20"
                : "rgba(255,255,255,0.2)",
            }}
          ></div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white sm:h-11 sm:w-11 md:h-12 md:w-12"
              style={{
                backgroundColor: primaryColor,
                color: secondaryForeground,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="sm:h-6 sm:w-6"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-base leading-tight font-bold whitespace-pre-line sm:text-lg md:text-xl lg:text-2xl">
              <EditableText
                value={ctaText2}
                onChange={handleTextUpdate("ctaText2" as any)}
                as="span"
                isEditable={isEditable}
                placeholder="Are You Ready For Get\nStarted Travelling?"
                multiline={true}
              />
            </h3>
          </div>
        </div>

        <div
          className="grid grid-cols-1 gap-8 border-b border-white/10 px-3 pt-16 pb-8 sm:gap-10 sm:px-4 sm:pt-20 sm:pb-10 md:grid-cols-2 md:gap-12 md:px-6 md:pt-24 md:pb-12 lg:grid-cols-4 lg:px-12"
          style={{ borderColor: `${primaryForeground}10` }}
        >
          {/* Brand Column */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <FooterLogo footerData={data} getImageUrl={getImageUrl} />
            </div>
            <p className="text-xs leading-relaxed opacity-90 sm:text-sm">
              {data.description}
            </p>
            <div className="flex gap-2.5 sm:gap-3 md:gap-4">
              {data.socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.href || "#"}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-white/10 hover:opacity-80 sm:h-8 sm:w-8"
                  target={
                    social.href?.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    social.href?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <SocialIcon
                    platform={social.platform}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="mb-4 text-base font-bold sm:mb-5 sm:text-lg md:mb-6">
              {servicesSection?.title || "Services"}
            </h4>
            <ul className="space-y-2 text-xs sm:space-y-2.5 sm:text-sm md:space-y-3">
              {(servicesSection?.links || []).map(link => (
                <li
                  key={link.id}
                  className="flex cursor-pointer items-center gap-2 opacity-80 transition-colors hover:opacity-100"
                >
                  <span style={{ color: primaryColor }}>✓</span>
                  <Link
                    href={generateLinkHref(
                      link.href || "",
                      siteUser,
                      pathname,
                      isEditable
                    )}
                    className="transition-colors hover:text-inherit"
                    style={
                      {
                        "--hover-color": primaryColor,
                      } as React.CSSProperties
                    }
                    target={
                      link.href?.startsWith("http") ||
                      link.href?.startsWith("mailto:")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      link.href?.startsWith("http") ||
                      link.href?.startsWith("mailto:")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={isEditable ? e => e.preventDefault() : undefined}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-base font-bold sm:mb-5 sm:text-lg md:mb-6">
              {usefulLinksSection?.title || "Resources"}
            </h4>
            <ul className="space-y-2 text-xs sm:space-y-2.5 sm:text-sm md:space-y-3">
              {(usefulLinksSection?.links || []).map(link => (
                <li
                  key={link.id}
                  className="flex cursor-pointer items-center gap-2 opacity-80 transition-colors hover:opacity-100"
                >
                  <span style={{ color: primaryColor }}>&gt;</span>
                  <Link
                    href={generateLinkHref(
                      link.href || "",
                      siteUser,
                      pathname,
                      isEditable
                    )}
                    className="transition-colors hover:text-inherit"
                    style={
                      {
                        "--hover-color": primaryColor,
                      } as React.CSSProperties
                    }
                    target={
                      link.href?.startsWith("http") ||
                      link.href?.startsWith("mailto:")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      link.href?.startsWith("http") ||
                      link.href?.startsWith("mailto:")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={isEditable ? e => e.preventDefault() : undefined}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-base font-bold sm:mb-5 sm:text-lg md:mb-6">
              {data.newsletter.title}
            </h4>
            <p className="mb-3 text-xs leading-relaxed opacity-80 sm:mb-4 sm:text-sm">
              {data.newsletter.description}
            </p>

            {data.newsletter.enabled && (
              <NewsletterForm isEditable={isEditable} theme={theme} />
            )}
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-between gap-3 border-t px-3 py-6 text-[10px] leading-relaxed sm:gap-4 sm:px-4 sm:py-7 sm:text-xs md:flex-row md:gap-0 md:px-6 md:py-8 lg:px-12"
          style={{
            color: footerData.textColor
              ? footerData.textColor + "80"
              : "rgba(255,255,255,0.5)",
            borderColor: footerData.textColor
              ? footerData.textColor + "20"
              : "rgba(255,255,255,0.1)",
          }}
        >
          <p>{getProcessedCopyright(data.copyright, data.companyName)}</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:justify-start md:gap-8">
            {(data.policyLinks && data.policyLinks.length > 0
              ? data.policyLinks
              : legalSection?.links || []
            ).map(link => (
              <Link
                key={link.id}
                href={generateLinkHref(
                  link.href || "",
                  siteUser,
                  pathname,
                  isEditable
                )}
                className="transition-colors hover:text-white"
                style={{ color: "inherit" }}
                target={
                  link.href?.startsWith("http") ||
                  link.href?.startsWith("mailto:")
                    ? "_blank"
                    : undefined
                }
                rel={
                  link.href?.startsWith("http") ||
                  link.href?.startsWith("mailto:")
                    ? "noopener noreferrer"
                    : undefined
                }
                onClick={isEditable ? e => e.preventDefault() : undefined}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>

        <div className="pb-8">
          <MadeWithLove textColor={footerData.textColor} />
        </div>
      </footer>
    </div>
  );
}
