import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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

interface FooterStyle1Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle1({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle1Props) {
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
      <footer className="bg-background border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="mb-4">
                <FooterLogo footerData={data} getImageUrl={getImageUrl} />
              </div>

              <p className="text-muted-foreground mb-6 max-w-md">
                {data.description}
              </p>

              {/* Contact Info */}
              <div className="mb-6 space-y-2">
                {data.contactInfo.email && (
                  <div className="text-muted-foreground flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.email}</span>
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="text-muted-foreground flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.phone}</span>
                  </div>
                )}
                {data.contactInfo.address && (
                  <div className="text-muted-foreground flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.address}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
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
                      className="h-4 w-4"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Link Sections */}
            {data.sections.map(section => (
              <div key={section.id}>
                <h4 className="text-foreground mb-4 font-semibold">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.id}>
                      {isEditable ? (
                        <button
                          className="text-muted-foreground hover:text-foreground text-left text-sm transition-colors"
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
                          className="text-muted-foreground hover:text-foreground block text-left text-sm transition-colors"
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

          {/* Newsletter */}
          {data.newsletter.enabled && (
            <div className="border-border mt-12 border-t pt-8">
              <div className="mx-auto max-w-md text-center">
                <h4 className="text-foreground mb-2 font-semibold">
                  {data.newsletter.title}
                </h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  {data.newsletter.description}
                </p>
                <NewsletterForm isEditable={isEditable} theme={theme} />
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="border-border mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
            <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
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
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
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
