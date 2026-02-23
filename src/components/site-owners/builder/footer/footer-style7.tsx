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
import { cn } from "@/lib/utils";

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
    <div className="group relative bg-primary">
      <footer className="relative mx-auto mt-12 max-w-7xl pt-12 text-primary-foreground sm:mt-16 sm:pt-16 md:mt-20 md:pt-20 font-body">
        {/* Floating CTA Bar */}
        <div
          className="absolute top-0 left-1/2 flex w-[95%] min-w-[288px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-2xl border border-primary-foreground/10 p-6 shadow-2xl sm:w-[90%] sm:rounded-3xl md:w-[80%] md:flex-row md:rounded-full md:px-12 md:py-8 bg-primary"
        >
          <div className="mb-4 flex items-center gap-4 md:mb-0 w-full md:w-auto">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
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
            <h3 className="text-lg leading-tight font-bold whitespace-pre-line lg:text-xl font-heading">
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

          <div className="mx-8 hidden h-12 w-px bg-primary-foreground/20 md:block"></div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
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
            <h3 className="text-lg leading-tight font-bold whitespace-pre-line lg:text-xl font-heading">
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
          className="grid grid-cols-1 gap-12 border-b border-primary-foreground/10 px-4 pt-32 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8"
        >
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground text-primary"
              >
                <Plane
                  size={20}
                  className="-rotate-45 fill-current"
                />
              </div>
              <FooterLogo
                footerData={data}
                getImageUrl={getImageUrl}
                textClassName="text-primary-foreground text-2xl font-bold font-heading"
              />
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/90 font-body">
              {data.description}
            </p>
            <div className="flex gap-4">
              {data.socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.href || "#"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground hover:text-primary"
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
            <h4 className="mb-6 text-lg font-bold font-heading">
              {servicesSection?.title || "Services"}
            </h4>
            <ul className="space-y-3 text-sm">
              {(servicesSection?.links || []).map(link => (
                <li
                  key={link.id}
                  className="flex cursor-pointer items-center gap-3 text-primary-foreground/90 transition-colors hover:text-primary-foreground group"
                >
                  <span className="group-hover:translate-x-1 transition-transform text-secondary">✓</span>
                  <Link
                    href={generateLinkHref(
                      link.href || "",
                      siteUser,
                      pathname,
                      isEditable
                    )}
                    className="transition-colors hover:text-secondary"
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
            <h4 className="mb-6 text-lg font-bold font-heading">
              {usefulLinksSection?.title || "Resources"}
            </h4>
            <ul className="space-y-3 text-sm">
              {(usefulLinksSection?.links || []).map(link => (
                <li
                  key={link.id}
                  className="flex cursor-pointer items-center gap-3 text-primary-foreground/90 transition-colors hover:text-primary-foreground group"
                >
                  <span className="group-hover:translate-x-1 transition-transform text-secondary">&gt;</span>
                  <Link
                    href={generateLinkHref(
                      link.href || "",
                      siteUser,
                      pathname,
                      isEditable
                    )}
                    className="transition-colors hover:text-secondary"
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
            <h4 className="mb-6 text-lg font-bold font-heading">
              {data.newsletter.title}
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-primary-foreground/90">
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
                      className="w-full rounded-full border-none bg-primary-foreground/10 px-5 py-3 pr-14 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:bg-primary-foreground/20 focus:ring-0 focus:outline-none"
                      disabled={
                        isEditable || createNewsletterMutation.isPending
                      }
                    />
                    <Button
                      type="submit"
                      className="absolute top-1/2 right-1.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full p-0 transition-colors bg-secondary text-secondary-foreground"
                      disabled={
                        isEditable || createNewsletterMutation.isPending
                      }
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {subscriptionStatus === "error" && errorMessage && (
                    <div className="mt-2 flex items-center justify-start gap-2 text-destructive-foreground bg-destructive p-1 rounded text-xs">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errorMessage}</span>
                    </div>
                  )}
                </form>
              )
            ) : (
              <div className="text-sm text-primary-foreground/50">
                Newsletter subscription is currently disabled.
              </div>
            )}
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-between gap-6 px-4 py-8 text-xs leading-relaxed text-primary-foreground/60 md:flex-row md:px-8"
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
                className="transition-colors hover:text-primary-foreground"
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
