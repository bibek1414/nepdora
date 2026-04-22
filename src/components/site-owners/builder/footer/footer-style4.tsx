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
import { NewsletterForm } from "./shared/newsletter-form";
import { getProcessedCopyright } from "./shared/footer-utils";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { MadeWithLove } from "./shared/made-with-love";

interface FooterStyle4Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle4({
  footerData,
  isEditable,
  siteUser,
}: FooterStyle4Props) {
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

  // Split sections into two columns if possible
  const section1 = data.sections[0];
  const section2 = data.sections[1];

  return (
    <footer
      style={{
        backgroundColor: footerData.backgroundColor || "#1A1A1A",
        color: footerData.textColor || "white",
        borderColor: footerData.textColor
          ? footerData.textColor + "20"
          : "rgba(255,255,255,0.1)",
      }}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Brand Info */}
          <div className="flex w-full flex-col items-center border-b border-gray-800 p-8 text-center lg:w-[40%] lg:items-start lg:border-r lg:border-b-0 lg:p-16 lg:text-left">
            <div className="mb-8 flex items-center gap-3">
              <FooterLogo footerData={data} getImageUrl={getImageUrl} />
            </div>
            <p className="max-w-md text-base leading-relaxed opacity-70 sm:text-lg">
              {data.description}
            </p>

            {data.newsletter?.enabled && (
              <div className="mt-12 w-full max-w-md">
                <h3 className="mb-6 text-lg font-bold tracking-wider uppercase">
                  {data.newsletter.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed opacity-70">
                  {data.newsletter.description}
                </p>
                <NewsletterForm theme={theme} />
              </div>
            )}
          </div>

          {/* Column 2 & 3 & 4 Container */}
          <div className="flex w-full flex-col md:flex-row lg:w-[60%]">
            {/* Links Columns */}
            <div
              className="flex flex-1 flex-col gap-12 border-b p-8 sm:flex-row sm:gap-20 md:border-r md:border-b-0 lg:p-16"
              style={{
                borderColor: footerData.textColor
                  ? footerData.textColor + "20"
                  : "rgba(255,255,255,0.1)",
              }}
            >
              {/* Quick Links (Section 1) */}
              {section1 && section1.links.length > 0 && (
                <div className="flex flex-col items-center gap-6 sm:items-start">
                  <h3 className="text-lg font-bold tracking-wider uppercase">
                    {section1.title}
                  </h3>
                  <ul className="space-y-4 text-center sm:text-left">
                    {section1.links.map(link => (
                      <li key={link.id}>
                        <Link
                          href={generateLinkHref(
                            link.href || "",
                            siteUser,
                            pathname,
                            false
                          )}
                          className="text-sm font-medium opacity-70 transition-colors hover:opacity-100"
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
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pages (Section 2) */}
              {section2 && section2.links.length > 0 && (
                <div className="flex flex-col items-center gap-6 sm:items-start">
                  <h3 className="text-lg font-bold tracking-wider uppercase">
                    {section2.title}
                  </h3>
                  <ul className="space-y-4 text-center sm:text-left">
                    {section2.links.map(link => (
                      <li key={link.id}>
                        <Link
                          href={generateLinkHref(
                            link.href || "",
                            siteUser,
                            pathname,
                            false
                          )}
                          className="text-sm font-medium opacity-70 transition-colors hover:opacity-100"
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
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>


            {/* Contact Column */}
            <div className="flex flex-1 flex-col items-center justify-start gap-8 p-8 md:items-start lg:p-16">
              {data.contactInfo.address && (
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 sm:h-auto sm:w-auto sm:bg-transparent">
                    <MapPin className="h-5 w-5 stroke-[1.5] sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base leading-snug font-medium sm:text-lg">
                      {data.contactInfo.address}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 sm:h-auto sm:w-auto sm:bg-transparent">
                  <Mail className="h-5 w-5 stroke-[1.5] sm:h-6 sm:w-6" />
                </div>
                <div className="flex flex-col">
                  {data.contactInfo.email && (
                    <a
                      href={`mailto:${data.contactInfo.email}`}
                      className="text-base font-medium transition-colors hover:opacity-80 sm:text-lg"
                    >
                      {data.contactInfo.email}
                    </a>
                  )}
                  {data.contactInfo.phone && (
                    <a
                      href={`tel:${data.contactInfo.phone}`}
                      className="mt-1 text-base font-medium transition-colors hover:opacity-80 sm:text-lg"
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
        <div
          className="flex flex-col items-start justify-between gap-6 border-t px-8 py-8 md:flex-row md:items-center lg:px-16"
          style={{
            borderColor: footerData.textColor
              ? footerData.textColor + "20"
              : "rgba(255,255,255,0.1)",
          }}
        >
          {/* Social Links */}
          <div className="flex items-center gap-6 font-medium">
            {data.socialLinks.map(social => (
              <a
                key={social.id}
                href={social.href || "#"}
                className="group flex items-center gap-1 transition-colors hover:opacity-80"
                target={social.href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href?.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                <SocialIcon platform={social.platform} className="h-4 w-4" />
                <span>{social.platform}</span>
                <ChevronRight className="h-4 w-4 group-hover:opacity-80" />
              </a>
            ))}
          </div>

          {/* Copyright & Policies */}
          <div className="flex flex-col items-center gap-2 text-center text-sm leading-relaxed md:items-end md:text-right md:text-base">
            <div>
              <p className="text-sm opacity-60">
                {getProcessedCopyright(
                  data.copyright,
                  data.companyName,
                  siteConfig?.business_name
                )}
              </p>
              <div className="mt-2 text-left md:text-right">
                <MadeWithLove
                  textColor={footerData.textColor}
                  className="justify-start! md:justify-end!"
                />
              </div>
            </div>
            {data.policyLinks && data.policyLinks.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-end">
                {data.policyLinks.map(link => (
                  <Link
                    key={link.id}
                    href={generateLinkHref(
                      link.href || "",
                      siteUser,
                      pathname,
                      false
                    )}
                    className="cursor-pointer text-sm opacity-70 transition-colors hover:opacity-100"
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
