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
          className="absolute top-0 left-1/2 flex w-[95%] min-w-[288px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-2xl border border-white/10 p-6 shadow-2xl sm:w-[90%] sm:rounded-3xl md:w-[80%] md:flex-row md:rounded-full md:px-12 md:py-8"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="mb-4 flex items-center gap-4 md:mb-0 w-full md:w-auto">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white"
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
                className="h-6 w-6"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3 className="text-lg leading-tight font-bold whitespace-pre-line lg:text-xl">
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

          <div className="mx-8 hidden h-12 w-px bg-white/20 md:block"></div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white"
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
                className="h-6 w-6"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-lg leading-tight font-bold whitespace-pre-line lg:text-xl">
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
          className="grid grid-cols-1 gap-12 border-b border-white/10 px-4 pt-32 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8"
          style={{ borderColor: `${primaryForeground}10` }}
        >
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                style={{
                  backgroundColor: primaryForeground,
                  color: primaryColor,
                }}
              >
                <Plane
                  size={20}
                  className="-rotate-45 fill-current"
                />
              </div>
              <FooterLogo
                footerData={data}
                getImageUrl={getImageUrl}
                textClassName="text-white text-2xl font-bold"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/90">
              {data.description}
            </p>
            <div className="flex gap-4">
              {data.socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.href || "#"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-gray-900"
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
                    className="h-4 w-4"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="mb-6 text-lg font-bold">
              {servicesSection?.title || "Services"}
            </h4>
            <ul className="space-y-3 text-sm">
              {(servicesSection?.links || []).map(link => (
                <li
                  key={link.id}
                  className="flex cursor-pointer items-center gap-3 text-white/90 transition-colors hover:text-white group"
                >
                  <span style={{ color: secondaryColor }} className="group-hover:translate-x-1 transition-transform">✓</span>
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
            <h4 className="mb-6 text-lg font-bold">
              {usefulLinksSection?.title || "Resources"}
            </h4>
            <ul className="space-y-3 text-sm">
              {(usefulLinksSection?.links || []).map(link => (
                <li
                  key={link.id}
                  className="flex cursor-pointer items-center gap-3 text-white/90 transition-colors hover:text-white group"
                >
                  <span style={{ color: secondaryColor }} className="group-hover:translate-x-1 transition-transform">&gt;</span>
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
            <h4 className="mb-6 text-lg font-bold">
              {data.newsletter.title}
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-white/90">
              {data.newsletter.description}
            </p>

            {data.newsletter.enabled ? (
              subscriptionStatus === "success" ? (
                <div className="flex items-center justify-start gap-2 text-green-400">
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
                      className="w-full rounded-full border-none bg-white/10 px-5 py-3 pr-14 text-sm text-white placeholder-white/50 focus:bg-white/20 focus:ring-0 focus:outline-none"
                      disabled={
                        isEditable || createNewsletterMutation.isPending
                      }
                    />
                    <Button
                      type="submit"
                      className="absolute top-1/2 right-1.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full p-0 transition-colors"
                      style={{
                        backgroundColor: secondaryColor,
                        color: secondaryForeground,
                      }}
                      disabled={
                        isEditable || createNewsletterMutation.isPending
                      }
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {subscriptionStatus === "error" && errorMessage && (
                    <div className="mt-2 flex items-center justify-start gap-2 text-red-400">
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
          className="flex flex-col items-center justify-between gap-6 px-4 py-8 text-xs leading-relaxed text-white/60 md:flex-row md:px-8"
        >
          <p className="text-left">{data.copyright}</p>
          <div className="flex flex-wrap justify-center gap-6 md:justify-end">
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
