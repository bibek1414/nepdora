import React, { useState } from "react";
import {
  ChevronRight,
  Phone,
  Send,
  MapPin,
  CheckCircle,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { FooterData } from "@/types/owner-site/components/footer";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";
import Image from "next/image";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { NewsletterForm } from "./shared/newsletter-form";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { getProcessedCopyright } from "./shared/footer-utils";
import { MadeWithLove } from "./shared/made-with-love";

interface FooterStyle7Props {
  footerData: FooterData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<FooterData>) => void;
  siteUser?: string;
  onEditClick?: () => void;
}

export const FooterStyle7: React.FC<FooterStyle7Props> = ({
  footerData,
  isEditable,
  onUpdate,
  siteUser,
}) => {
  const { data, getImageUrl } = useBuilderLogic(footerData, onUpdate);
  const { data: siteConfig } = useSiteConfig();
  const { data: categoriesResponse } = useCategories();
  const categoriesResponseAny = categoriesResponse as any;
  const categories =
    categoriesResponseAny?.data?.results ||
    categoriesResponseAny?.results ||
    (Array.isArray(categoriesResponseAny?.data)
      ? categoriesResponseAny.data
      : []) ||
    [];

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

  const pathname = usePathname();

  const companySection = data.sections[0];
  const helpSection = data.sections[1];

  return (
    <footer
      className="w-full pt-20 pb-10 font-sans"
      style={{
        backgroundColor: footerData.backgroundColor || undefined,
        color: footerData.textColor || "inherit",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Logo, Newsletter, Social */}
          <div className="flex flex-col space-y-6 lg:col-span-4 lg:pr-12">
            <FooterLogo footerData={data} getImageUrl={getImageUrl} />

            {data.newsletter.enabled && (
              <>
                <p className="max-w-[280px] text-base opacity-70">
                  {data.newsletter.description ||
                    "Sign up today and get $20 off your first order."}
                </p>

                <div className="mt-2 w-full max-w-[320px]">
                  <NewsletterForm theme={theme} />
                </div>
              </>
            )}

            {/* Social Links */}
            <div className="mt-4 flex items-center gap-4">
              {data.socialLinks.map((social: any) => (
                <Link
                  key={social.id}
                  href={social.href || "#"}
                  className="transition-colors hover:opacity-70"
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

          {/* Column 2: Collection */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-base font-semibold">Collection</h3>
            <ul className="flex flex-col space-y-4">
              {categories.slice(0, 6).map((category: any) => (
                <li key={category.id || category.slug}>
                  <Link
                    href={generateLinkHref(
                      `/collections?category=${category.slug}`,
                      siteUser,
                      pathname,
                      false
                    )}
                    className="text-sm opacity-80 transition-colors hover:opacity-100"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-sm text-gray-400">No categories found</li>
              )}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2">
            {companySection && companySection.links.length > 0 && (
              <>
                <h3 className="mb-6 text-base font-semibold">
                  {companySection.title}
                </h3>
                <ul className="flex flex-col space-y-4">
                  {companySection.links.map((link: any) => (
                    <li key={link.id}>
                      <FooterLink
                        href={generateLinkHref(
                          link.href || "",
                          siteUser,
                          pathname,
                          false
                        )}
                      >
                        {link.text}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Column 4: Need Help */}
          <div className="lg:col-span-2">
            {helpSection && helpSection.links.length > 0 && (
              <>
                <h3 className="mb-6 text-base font-semibold">
                  {helpSection.title}
                </h3>
                <ul className="flex flex-col space-y-4">
                  {helpSection.links.map((link: any) => (
                    <li key={link.id}>
                      <FooterLink
                        href={generateLinkHref(
                          link.href || "",
                          siteUser,
                          pathname,
                          false
                        )}
                      >
                        {link.text}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>


          {/* Column 5: Exclusive Services */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-base font-semibold">Exclusive Services</h3>
            <ul className="flex flex-col space-y-5">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                <span className="text-sm opacity-80">
                  {siteConfig?.phone || "+1666 8888"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Send className="mt-0.5 h-[18px] w-[18px] shrink-0 -rotate-45" />
                <span className="text-sm opacity-80">
                  {siteConfig?.email || "help@nepdora.com"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                <span className="text-sm leading-relaxed whitespace-pre-line opacity-70">
                  {siteConfig?.address ||
                    "2972 Westheimer Rd.\nSanta Ana, Illinois\n85486"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-100 pt-8 pb-4 md:flex-row dark:border-gray-800">
          <p className="text-xs opacity-60">
            {getProcessedCopyright(
              data.copyright,
              data.companyName,
              siteConfig?.business_name
            )}
          </p>

          {data.policyLinks && data.policyLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6">
              {data.policyLinks.map((link: any) => (
                <FooterLink
                  key={link.id}
                  href={generateLinkHref(
                    link.href || "",
                    siteUser,
                    pathname,
                    false
                  )}
                >
                  {link.text}
                </FooterLink>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <MadeWithLove textColor={footerData.textColor} />
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => {
  return (
    <Link
      href={href || "#"}
      target={
        href?.startsWith("http") || href?.startsWith("mailto:")
          ? "_blank"
          : undefined
      }
      rel={
        href?.startsWith("http") || href?.startsWith("mailto:")
          ? "noopener noreferrer"
          : undefined
      }
      className="w-fit text-sm opacity-70 transition-colors hover:opacity-100"
    >
      {children}
    </Link>
  );
};
