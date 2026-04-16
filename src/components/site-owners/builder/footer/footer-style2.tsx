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
import { NewsletterForm } from "./shared/newsletter-form";
import { getProcessedCopyright } from "./shared/footer-utils";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { MadeWithLove } from "./shared/made-with-love";

interface FooterStyle2Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle2({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle2Props) {
  const { data: themeResponse } = useThemeQuery();
  const { data: siteConfig } = useSiteConfig();
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

  const pathname = usePathname();

  // Get available sections, fallback to creating sections if none exist
  const availableSections =
    data.sections.length > 0
      ? data.sections
      : [{ id: "default", title: "Quick Links", links: [] }];

  const sectionsToShow = availableSections.slice(0, 3);

  return (
    <div className="group relative">
      <footer
        className="font-display border-t px-4 py-12 sm:px-6 lg:px-8"
        style={{
          backgroundColor: footerData.backgroundColor || undefined,
          color: footerData.textColor || "inherit",
          borderColor: footerData.textColor
            ? footerData.textColor + "20"
            : "rgba(0,0,0,0.1)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Company Info - Takes 2 columns on large screens */}
            <div className="flex flex-col items-center text-center lg:col-span-2 lg:items-start lg:text-left">
              {/* Logo */}
              <div className="mb-6">
                <FooterLogo footerData={data} getImageUrl={getImageUrl} />
              </div>

              <p className="mb-8 max-w-md text-base leading-relaxed opacity-80">
                {data.description}
              </p>

              {/* Contact Info */}
              <div className="mb-8 space-y-3">
                {data.contactInfo.email && (
                  <div className="flex items-center justify-center opacity-80 lg:justify-start">
                    <Mail className="mr-3 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.email}</span>
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="flex items-center justify-center opacity-80 lg:justify-start">
                    <Phone className="mr-3 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.phone}</span>
                  </div>
                )}
                {data.contactInfo.address && (
                  <div className="flex items-start justify-center opacity-80 lg:justify-start">
                    <MapPin className="mt-1 mr-3 h-4 w-4 shrink-0" />
                    <span className="text-left text-sm whitespace-pre-line">
                      {data.contactInfo.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links - Horizontal Layout */}
              <div className="mb-8 lg:mb-0">
                <h4 className="mb-4 text-sm font-bold tracking-wider uppercase">
                  Follow Us
                </h4>
                {data.socialLinks.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                    {data.socialLinks.map(social => (
                      <Link
                        key={social.id}
                        href={social.href || "#"}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition-all hover:scale-110 hover:bg-black/10 active:scale-95 dark:bg-white/5 dark:hover:bg-white/10"
                        style={{
                          backgroundColor: footerData.textColor
                            ? `${footerData.textColor}10`
                            : undefined,
                        }}
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
                  <p className="text-sm opacity-60">
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
                  <h3 className="text-heading-light dark:text-heading-dark mb-4 font-bold">
                    {section.title}
                  </h3>

                  <ul className="space-y-3">
                    {section.links.map(link => (
                      <li key={link.id}>
                        {isEditable ? (
                          <button
                            className="text-left opacity-80 transition-colors hover:opacity-100"
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
                            className="text-text-light dark:text-text-dark hover:text-primary block text-left transition-colors dark:hover:text-white"
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
                          >
                            {link.text}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            {/* Newsletter Section */}
            {data.newsletter?.enabled && (
              <div
                className="mt-12 border-t pt-8"
                style={{
                  borderColor: footerData.textColor
                    ? footerData.textColor + "20"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                <div className="mx-auto max-w-md text-center">
                  <h4 className="text-heading-light dark:text-heading-dark mb-2 font-semibold">
                    {data.newsletter.title}
                  </h4>
                  <p className="mb-4 text-sm opacity-80">
                    {data.newsletter.description}
                  </p>
                  <NewsletterForm isEditable={isEditable} theme={theme} />
                </div>
              </div>
            )}
          </div>

          {/* Copyright */}
          <div
            className="mx-auto mt-12 flex flex-col items-center gap-4 border-t pt-8 text-center"
            style={{
              borderColor: footerData.textColor
                ? footerData.textColor + "20"
                : "rgba(0,0,0,0.1)",
            }}
          >
            <p className="flex items-center justify-center gap-1 text-sm opacity-80">
              {getProcessedCopyright(
                data.copyright,
                data.companyName,
                siteConfig?.business_name
              )}
              <Heart className="inline h-3 w-3 text-red-500" />
            </p>
            {data.policyLinks && data.policyLinks.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-4">
                {data.policyLinks.map(link => (
                  <Link
                    key={link.id}
                    href={generateLinkHref(
                      link.href || "",
                      siteUser,
                      pathname,
                      isEditable
                    )}
                    className="text-sm opacity-80 transition-colors hover:opacity-100"
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
            )}
          </div>

          <div className="mt-8">
            <MadeWithLove textColor={footerData.textColor} />
          </div>
        </div>
      </footer>
    </div>
  );
}
