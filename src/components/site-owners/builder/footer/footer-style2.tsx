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
      <footer className="bg-background-light dark:bg-background-dark font-display border-t px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="mb-4">
                <FooterLogo footerData={data} getImageUrl={getImageUrl} />
              </div>

              <p className="text-text-light dark:text-text-dark mb-6 max-w-md">
                {data.description}
              </p>

              {/* Contact Info */}
              <div className="mb-6 space-y-2">
                {data.contactInfo.email && (
                  <div className="text-text-light dark:text-text-dark flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.email}</span>
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="text-text-light dark:text-text-dark flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.phone}</span>
                  </div>
                )}
                {data.contactInfo.address && (
                  <div className="text-text-light dark:text-text-dark flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.address}</span>
                  </div>
                )}
              </div>

              {/* Social Links - Horizontal Layout */}
              <div>
                <h4 className="text-heading-light dark:text-heading-dark mb-3 font-semibold">
                  Follow Us
                </h4>
                {data.socialLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {data.socialLinks.map(social => (
                      <Link
                        key={social.id}
                        href={social.href || "#"}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white hover:text-gray-900"
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
                  <h3 className="text-heading-light dark:text-heading-dark mb-4 font-bold">
                    {section.title}
                  </h3>

                  <ul className="space-y-3">
                    {section.links.map(link => (
                      <li key={link.id}>
                        {isEditable ? (
                          <button
                            className="text-text-light dark:text-text-dark hover:text-primary text-left transition-colors dark:hover:text-white"
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
              <div className="mt-12 border-t border-gray-300 pt-8 dark:border-gray-700">
                <div className="mx-auto max-w-md text-center">
                  <h4 className="text-heading-light dark:text-heading-dark mb-2 font-semibold">
                    {data.newsletter.title}
                  </h4>
                  <p className="text-text-light dark:text-text-dark mb-4 text-sm">
                    {data.newsletter.description}
                  </p>
                  <NewsletterForm isEditable={isEditable} theme={theme} />
                </div>
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="mx-auto mt-12 flex flex-col items-center gap-4 border-t border-gray-300 pt-8 text-center dark:border-gray-700">
            <p className="text-text-light dark:text-text-dark flex items-center justify-center gap-1 text-sm">
              {getProcessedCopyright(data.copyright, data.companyName)}
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
                    className="text-text-light dark:text-text-dark hover:text-primary text-sm transition-colors"
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
        </div>
      </footer>
    </div>
  );
}
