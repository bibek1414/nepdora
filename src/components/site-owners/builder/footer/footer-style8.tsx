import React from "react";
import { MapPin, Mail, ChevronRight } from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";
import { cn } from "@/lib/utils";

interface FooterStyle8Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle8({
  footerData,
  isEditable,
  siteUser,
}: FooterStyle8Props) {
  const { data: themeResponse } = useThemeQuery();

  const { data, getImageUrl } = useBuilderLogic(footerData, undefined);
  const pathname = usePathname();

  // Split sections into two columns if possible
  const section1 = data.sections[0];
  const section2 = data.sections[1];

  return (
    <footer className="border-t border-border bg-foreground font-body text-background">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Brand Info */}
          <div className="w-full border-b border-background/20 p-8 lg:w-[40%] lg:border-r lg:border-b-0 lg:p-16">
            <div className="mb-6 flex items-center gap-3">
              <FooterLogo
                footerData={data}
                getImageUrl={getImageUrl}
                textClassName="text-secondary text-2xl font-semibold tracking-tight font-heading"
                imageClassName="h-8"
                containerClassName="gap-3"
              />
            </div>
            <p className="max-w-md text-lg leading-relaxed text-background/60 text-left">
              {data.description}
            </p>
          </div>

          {/* Column 2 & 3 & 4 Container */}
          <div className="flex w-full flex-col md:flex-row lg:w-[60%]">
            {/* Links Columns */}
            <div className="flex flex-1 gap-12 border-b border-background/20 p-8 sm:gap-20 md:border-r md:border-b-0 lg:p-16">
              {/* Quick Links (Section 1) */}
              {section1 && (
                <div className="flex flex-col gap-6 text-left">
                  <h3 className="text-lg font-medium text-background font-heading">
                    {section1.title}
                  </h3>
                  <ul className="space-y-4">
                    {section1.links.map(link => (
                      <li key={link.id}>
                        {isEditable ? (
                          <span className="cursor-default font-medium text-background/60 transition-colors hover:text-background">
                            {link.text}
                          </span>
                        ) : (
                          <Link
                            href={generateLinkHref(
                              link.href || "",
                              siteUser,
                              pathname,
                              isEditable
                            )}
                            className="font-medium text-background/60 transition-colors hover:text-background"
                          >
                            {link.text}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pages (Section 2) */}
              {section2 && (
                <div className="flex flex-col gap-6 text-left">
                  <h3 className="text-lg font-medium text-background font-heading">
                    {section2.title}
                  </h3>
                  <ul className="space-y-4">
                    {section2.links.map(link => (
                      <li key={link.id}>
                        {isEditable ? (
                          <span className="cursor-default font-medium text-background/60 transition-colors hover:text-background">
                            {link.text}
                          </span>
                        ) : (
                          <Link
                            href={generateLinkHref(
                              link.href || "",
                              siteUser,
                              pathname,
                              isEditable
                            )}
                            className="font-medium text-background/60 transition-colors hover:text-background"
                          >
                            {link.text}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Contact Column */}
            <div className="flex flex-1 flex-col justify-start gap-8 p-8 lg:p-16 text-left">
              {data.contactInfo.address && (
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <MapPin className="h-6 w-6 stroke-[1.5] text-background" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg leading-snug font-medium text-background">
                      {data.contactInfo.address}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Mail className="h-6 w-6 stroke-[1.5] text-background" />
                </div>
                <div className="flex flex-col">
                  {data.contactInfo.email && (
                    <a
                      href={`mailto:${data.contactInfo.email}`}
                      className="text-lg font-medium text-background transition-colors hover:text-background/80"
                    >
                      {data.contactInfo.email}
                    </a>
                  )}
                  {data.contactInfo.phone && (
                    <a
                      href={`tel:${data.contactInfo.phone}`}
                      className="mt-1 text-lg font-medium text-background transition-colors hover:text-background/80"
                    >
                      {data.contactInfo.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-start justify-between gap-6 border-t border-background/20 px-8 py-8 md:flex-row md:items-center lg:px-16">
          {/* Social Links */}
          <div className="flex items-center gap-6 font-medium text-background">
            {data.socialLinks.map(social => (
              <a
                key={social.id}
                href={social.href || "#"}
                className="group flex items-center gap-1 transition-colors hover:text-background/80"
                target={social.href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href?.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                <SocialIcon platform={social.platform} className="h-4 w-4" />
                <span>{social.platform}</span>
                <ChevronRight className="h-4 w-4 text-background group-hover:text-background/80" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-left text-sm leading-relaxed text-background/60 md:text-base">
            <p>{data.copyright}</p>
            <p>
              Powered By <span className="font-medium text-background">Nepdora</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
