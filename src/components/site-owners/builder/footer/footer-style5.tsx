import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/use-footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";

interface FooterStyle5Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle5({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle5Props) {
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

  const { data, getImageUrl } = useBuilderLogic(footerData, undefined);

  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const deleteFooterMutation = useDeleteFooterMutation();
  const createNewsletterMutation = useCreateNewsletter();
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

  // Get available sections, fallback to creating sections if none exist
  const availableSections =
    data.sections.length > 0
      ? data.sections
      : [{ id: "default", title: "Quick Links", links: [] }];

  const sectionsToShow = availableSections.slice(0, 3);

  return (
    <div className="group relative">
      <footer className="bg-background-light dark:bg-background-dark font-display border-t px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info - Takes 2 columns on large screens */}
            <div className="space-y-8 lg:col-span-2">
              {/* Logo */}
              <div>
                <FooterLogo
                  footerData={data}
                  getImageUrl={getImageUrl}
                  textClassName="text-heading-light dark:text-heading-dark text-xl font-bold"
                  imageClassName="h-8 w-auto"
                  containerClassName="gap-3"
                />
              </div>

              <p className="text-text-light dark:text-text-dark max-w-md leading-relaxed">
                {data.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {data.contactInfo.email && (
                  <div className="text-text-light dark:text-text-dark group flex items-center">
                    <div className="bg-primary/10 text-primary group-hover:bg-primary mr-3 rounded-full p-2 transition-all group-hover:text-white">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {data.contactInfo.email}
                    </span>
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="text-text-light dark:text-text-dark group flex items-center">
                    <div className="bg-primary/10 text-primary group-hover:bg-primary mr-3 rounded-full p-2 transition-all group-hover:text-white">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {data.contactInfo.phone}
                    </span>
                  </div>
                )}
                {data.contactInfo.address && (
                  <div className="text-text-light dark:text-text-dark group flex items-start">
                    <div className="bg-primary/10 text-primary group-hover:bg-primary mt-0.5 mr-3 rounded-full p-2 transition-all group-hover:text-white">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="text-sm leading-relaxed font-medium">
                      {data.contactInfo.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links - Horizontal Layout */}
              <div>
                <h4 className="text-heading-light dark:text-heading-dark mb-4 text-sm font-semibold tracking-wider uppercase">
                  Follow Us
                </h4>
                {data.socialLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {data.socialLinks.map(social => (
                      <Link
                        key={social.id}
                        href={social.href || "#"}
                        className="bg-muted hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-all hover:-translate-y-1 hover:text-white"
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
                          className="h-5 w-5"
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-light dark:text-text-dark text-sm opacity-60">
                    No social links available
                  </p>
                )}
              </div>
            </div>

            {/* Render the first 3 sections */}
            {sectionsToShow
              .filter(section => section.links.length > 0)
              .map(section => (
                <div key={section.id} className="col-span-1">
                  <h3 className="text-heading-light dark:text-heading-dark mb-6 text-lg font-bold">
                    {section.title}
                  </h3>

                  <ul className="space-y-3">
                    {section.links.map(link => (
                      <li key={link.id}>
                        {isEditable ? (
                          <button
                            className="text-text-light dark:text-text-dark hover:text-primary text-left text-sm font-medium transition-colors dark:hover:text-white"
                            onClick={
                              isEditable ? e => e.preventDefault() : undefined
                            }
                          >
                            {link.text}
                          </button>
                        ) : (
                          <Link
                            href={generateLinkHref(
                              link.href || "",
                              siteUser,
                              pathname,
                              isEditable
                            )}
                            className="text-text-light dark:text-text-dark hover:text-primary block text-left text-sm font-medium transition-colors dark:hover:text-white"
                          >
                            {link.text}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          {/* Copyright */}
          <div className="border-border mx-auto mt-16 border-t pt-8 text-left dark:border-gray-700">
            <p className="text-muted-foreground flex items-center justify-start gap-1 text-sm font-medium">
              {data.copyright ||
                `© ${new Date().getFullYear()} ${data.companyName}. All rights reserved.`}
              <Heart className="inline h-3 w-3 fill-current text-red-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
