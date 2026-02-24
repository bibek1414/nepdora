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
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import { EditableText } from "@/components/ui/editable-text";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";

interface FooterStyle7Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  onUpdate?: (updatedData: Partial<FooterData>) => void;
  siteUser?: string;
}

export function FooterStyle7({
  footerData,
  isEditable,
  onEditClick,
  onUpdate,
  siteUser,
}: FooterStyle7Props) {
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

  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const createNewsletterMutation = useCreateNewsletter();

  // Get colors from theme with fallbacks
  const primaryColor = theme.colors?.primary || "#3B82F6";
  const secondaryColor = theme.colors?.secondary || "#F59E0B";
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
  const pathname = usePathname();

  // Function to generate the correct href for links

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address");
      setSubscriptionStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setSubscriptionStatus("error");
      return;
    }

    try {
      await createNewsletterMutation.mutateAsync({
        email: email.trim(),
        is_subscribed: true,
      });

      setSubscriptionStatus("success");
      setEmail("");
      setErrorMessage("");

      setTimeout(() => {
        setSubscriptionStatus("idle");
      }, 3000);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      setErrorMessage(
        error?.message || "Failed to subscribe. Please try again."
      );
      setSubscriptionStatus("error");
    }
  };

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
    <div className="group relative" style={{ backgroundColor: primaryColor }}>
      <footer className="relative mx-auto mt-12 max-w-7xl pt-12 text-white sm:mt-16 sm:pt-16 md:mt-20 md:pt-20">
        {/* Floating CTA Bar */}
        <div
          className="absolute top-0 left-1/2 flex w-[95%] min-w-[288px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-2xl border border-white/10 p-4 shadow-2xl sm:w-[90%] sm:rounded-3xl sm:p-6 md:w-[80%] md:flex-row md:rounded-full md:p-12"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3 md:mb-0 md:gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white sm:h-11 sm:w-11 md:h-12 md:w-12"
              style={{
                backgroundColor: secondaryColor,
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

          <div className="mx-4 hidden h-8 w-px bg-white/20 sm:mx-6 sm:h-10 md:mx-8 md:block md:h-12"></div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white sm:h-11 sm:w-11 md:h-12 md:w-12"
              style={{
                backgroundColor: secondaryColor,
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
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white sm:h-9 sm:w-9 md:h-10 md:w-10"
                style={{
                  backgroundColor: primaryForeground,
                  color: primaryColor,
                }}
              >
                <Plane
                  size={16}
                  className="-rotate-45 fill-current sm:h-5 sm:w-5 md:h-5 md:w-5"
                />
              </div>
              <FooterLogo
                footerData={data}
                getImageUrl={getImageUrl}
                textClassName="text-white"
              />
            </div>
            <p className="text-xs leading-relaxed text-white sm:text-sm">
              {data.description}
            </p>
            <div className="flex gap-2.5 sm:gap-3 md:gap-4">
              {data.socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.href || "#"}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white hover:text-gray-900 sm:h-8 sm:w-8"
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
                  className="flex cursor-pointer items-center gap-2 text-white/90 transition-colors hover:text-white"
                  // style={
                  //   {
                  //     color: `${primaryForeground}80`,
                  //     "--hover-color": primaryForeground,
                  //   } as React.CSSProperties
                  // }
                >
                  <span style={{ color: secondaryColor }}>✓</span>
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
                        "--hover-color": secondaryColor,
                      } as React.CSSProperties
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
                  className="flex cursor-pointer items-center gap-2 text-white/90 transition-colors hover:text-white"
                >
                  <span style={{ color: secondaryColor }}>&gt;</span>
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
                        "--hover-color": secondaryColor,
                      } as React.CSSProperties
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
            <p className="mb-3 text-xs leading-relaxed text-white/90 sm:mb-4 sm:text-sm">
              {data.newsletter.description}
            </p>

            {data.newsletter.enabled ? (
              subscriptionStatus === "success" ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Successfully subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-full border px-3 py-2 pr-12 text-xs text-white focus:outline-none sm:px-4 sm:py-2.5 sm:pr-14 sm:text-sm"
                      disabled={
                        isEditable || createNewsletterMutation.isPending
                      }
                    />
                    <Button
                      type="submit"
                      className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full p-0 transition-colors sm:right-1.5 sm:h-9 sm:w-9"
                      style={{
                        backgroundColor: secondaryColor,
                        color: secondaryForeground,
                      }}
                      disabled={
                        isEditable || createNewsletterMutation.isPending
                      }
                    >
                      <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  {subscriptionStatus === "error" && errorMessage && (
                    <div className="mt-2 flex items-center justify-center gap-2 text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errorMessage}</span>
                    </div>
                  )}
                </form>
              )
            ) : (
              <div className="text-sm text-gray-400">
                Newsletter subscription is currently disabled.
              </div>
            )}
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-between gap-3 px-3 py-6 text-[10px] leading-relaxed sm:gap-4 sm:px-4 sm:py-7 sm:text-xs md:flex-row md:gap-0 md:px-6 md:py-8 lg:px-12"
          style={{ color: `${primaryForeground}80` }}
        >
          <p>{data.copyright}</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:justify-start md:gap-8">
            {(legalSection?.links || []).map(link => (
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
                onClick={isEditable ? e => e.preventDefault() : undefined}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
