import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { NewsletterForm } from "./shared/newsletter-form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";
import { getProcessedCopyright } from "./shared/footer-utils";

interface FooterStyle4Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle4({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle4Props) {
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

  return (
    <div className="group relative">
      <footer
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
        }}
        className="text-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Main content */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="mb-6">
                <FooterLogo footerData={data} getImageUrl={getImageUrl} />
              </div>

              <p className="mb-6 text-lg leading-relaxed text-white/90">
                {data.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {data.contactInfo.email && (
                  <div className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-white/80" />
                    <span className="text-white/90">
                      {data.contactInfo.email}
                    </span>
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="mr-3 h-5 w-5 text-white/80" />
                    <span className="text-white/90">
                      {data.contactInfo.phone}
                    </span>
                  </div>
                )}
                {data.contactInfo.address && (
                  <div className="flex items-center">
                    <MapPin className="mr-3 h-5 w-5 text-white/80" />
                    <span className="text-white/90">
                      {data.contactInfo.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Link Sections */}
            {data.sections.map(section => (
              <div key={section.id}>
                <h4 className="mb-6 text-xl font-semibold">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link.id}>
                      {isEditable ? (
                        <button
                          className="text-left text-white/80 transition-all hover:translate-x-1 hover:text-white"
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
                          className="block text-white/80 transition-all hover:translate-x-1 hover:text-white"
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
          </div>

          {/* Newsletter Section */}
          {data.newsletter.enabled && (
            <div className="mt-16 rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-2xl font-bold">
                    {data.newsletter.title}
                  </h4>
                  <p className="text-lg text-white/80">
                    {data.newsletter.description}
                  </p>
                </div>

                {data.newsletter.enabled && (
                  <NewsletterForm isEditable={isEditable} theme={theme} />
                )}
              </div>
            </div>
          )}

          {/* Bottom Section */}
          <div className="mt-16 flex flex-col items-center justify-between border-t border-white/20 pt-8 md:flex-row">
            {/* Copyright */}
            <div className="mb-4 flex flex-col items-center gap-2 md:mb-0 md:items-start">
              <p className="text-white/80">{getProcessedCopyright(data.copyright, data.companyName)}</p>
              {data.policyLinks && data.policyLinks.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  {data.policyLinks.map(link => (
                    <Link
                      key={link.id}
                      href={generateLinkHref(
                        link.href || "",
                        siteUser,
                        pathname,
                        isEditable
                      )}
                      className="text-sm text-white/80 transition-colors hover:text-white"
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

            {/* Social Links */}
            <div className="flex items-center space-x-4">
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
                  <SocialIcon platform={social.platform} className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
