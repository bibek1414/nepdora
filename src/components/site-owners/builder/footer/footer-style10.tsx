"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FooterData } from "@/types/owner-site/components/footer";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { MadeWithLove } from "./shared/made-with-love";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { FooterLogo } from "./shared/footer-logo";

import { NewsletterForm } from "./shared/newsletter-form";

interface FooterStyle10Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  onUpdate?: (updatedData: Partial<FooterData>) => void;
  siteUser?: string;
}

export const FooterStyle10 = ({
  footerData,
  isEditable,
  onEditClick,
  onUpdate,
  siteUser,
}: FooterStyle10Props) => {
  const { data, getImageUrl } = useBuilderLogic(footerData, onUpdate);
  const { data: siteConfig } = useSiteConfig();
  const pathname = usePathname();
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback
  const theme =
    themeResponse?.data?.[0]?.data?.theme ||
    ({
      colors: {
        primary: "#000000",
        primaryForeground: "#FFFFFF",
      },
    } as any);

  return (
    <footer
      className="mt-24 border-t transition-colors duration-300"
      style={{
        backgroundColor: footerData.backgroundColor || undefined,
        color: footerData.textColor || "inherit",
        borderColor: footerData.textColor
          ? footerData.textColor + "20"
          : "rgba(0,0,0,0.1)",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {/* Branding Column */}
        <div className="flex flex-col gap-4 lg:col-span-1 xl:col-span-1">
          <div className="flex items-center gap-2">
            <FooterLogo footerData={data} getImageUrl={getImageUrl} />
          </div>
          <div className="mt-2 max-w-xs">
            <p
              className="text-sm leading-relaxed opacity-70"
              style={{ color: footerData.textColor || "inherit" }}
            >
              {data.description}
            </p>
          </div>
        </div>

        {/* Dynamic Link Sections */}
        {data.sections.map(section => (
          <div key={section.id}>
            <p
              className="text-xs font-semibold tracking-widest uppercase opacity-60"
              style={{ color: footerData.textColor || "inherit" }}
            >
              {section.title}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {section.links.map(link => (
                <li key={link.id}>
                  <Link
                    href={generateLinkHref(
                      link.href || "",
                      siteUser,
                      pathname,
                      false // Don't disable links even in builder
                    )}
                    className="inline-block opacity-70 transition-all hover:translate-x-1 hover:opacity-100"
                    style={{ color: footerData.textColor || "inherit" }}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
              {section.links.length === 0 && isEditable && (
                <li className="text-muted-foreground italic opacity-50">
                  No links added
                </li>
              )}
            </ul>
          </div>
        ))}

        {/* Elsewhere / Socials Column */}
        <div>
          <p className="text-muted-foreground/80 text-xs font-semibold tracking-widest uppercase">
            Elsewhere
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {data.socialLinks.map(s => (
              <li key={s.id}>
                <a
                  href={s.href || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block opacity-70 transition-all hover:translate-x-1 hover:opacity-100"
                  style={{ color: footerData.textColor || "inherit" }}
                >
                  {s.platform}
                </a>
              </li>
            ))}
            {data.contactInfo.email && (
              <li>
                <a
                  href={`mailto:${data.contactInfo.email}`}
                  className="inline-block opacity-70 transition-all hover:translate-x-1 hover:opacity-100"
                  style={{ color: footerData.textColor || "inherit" }}
                >
                  {data.contactInfo.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Newsletter Column */}
        {data.newsletter?.enabled && (
          <div className="lg:col-span-2 xl:col-span-1">
            <p
              className="text-xs font-semibold tracking-widest uppercase opacity-60"
              style={{ color: footerData.textColor || "inherit" }}
            >
              {data.newsletter.title}
            </p>
            <div className="mt-6">
              <div className="mb-4">
                <p
                  className="text-sm leading-relaxed opacity-70"
                  style={{ color: footerData.textColor || "inherit" }}
                >
                  {data.newsletter.description}
                </p>
              </div>
              <NewsletterForm theme={theme} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t"
        style={{
          borderColor: footerData.textColor
            ? footerData.textColor + "1a"
            : "rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 text-[11px] font-medium opacity-60 sm:flex-row sm:items-center"
          style={{ color: footerData.textColor || "inherit" }}
        >
          <p className="tracking-tight">
            <span>{data.copyright}</span>
          </p>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-10">
            <p className="cursor-default whitespace-nowrap transition-colors hover:opacity-100">
              Designed and built with care.
            </p>
            <MadeWithLove textColor={footerData.textColor || "currentColor"} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterStyle10;
