import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Heart, CheckCircle, AlertCircle } from "lucide-react";
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
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { MadeWithLove } from "./shared/made-with-love";

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

  // Get the first three sections for the grid layout
  const mainSections = data.sections.slice(0, 3);

  return (
    <div className="group relative">
      <footer
        style={{
          background: footerData.backgroundColor || theme.colors.primary,
          fontFamily: theme.fonts.heading,
          color: footerData.textColor || "white",
        }}
        className="px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Footer links grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Info Section */}
            {mainSections.map((section, index) => (
              <div key={section.id} className="col-span-1">
                <h3 className="mb-4 text-xl font-semibold">{section.title}</h3>
                <ul className="space-y-2">
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
                          className="block text-sm opacity-80 transition-colors hover:opacity-100"
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
            {data.newsletter.enabled && (
              <div className="col-span-2 lg:col-span-2">
                <h3 className="mb-4 text-xl font-semibold">
                  {data.newsletter.title}
                </h3>
                <p className="mb-4 text-sm opacity-80">
                  {data.newsletter.description}
                </p>

                {data.newsletter.enabled && (
                  <NewsletterForm isEditable={isEditable} theme={theme} />
                )}
              </div>
            )}
          </div>

          {/* Bottom section */}
          <div className="mt-16 flex flex-col items-center justify-between border-t border-white/20 pt-8 text-sm opacity-80 md:flex-row">
            {/* Logo and Company Name */}
            <div className="mb-4 flex items-center md:mb-0">
              <FooterLogo footerData={data} getImageUrl={getImageUrl} />
            </div>

            {/* Copyright */}
            <div className="mb-4 flex flex-col items-center gap-2 md:mb-0 md:items-start md:text-left">
              <p>
                {getProcessedCopyright(
                  data.copyright,
                  data.companyName,
                  siteConfig?.business_name
                )}
              </p>
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
                      className="opacity-80 transition-colors hover:opacity-100"
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

            {/* Social links */}
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

          <div className="mt-8 pt-8">
            <MadeWithLove textColor={footerData.textColor} />
          </div>
        </div>
      </footer>
    </div>
  );
}
