import React from "react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";
import { cn } from "@/lib/utils";

interface FooterStyle6Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle6({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle6Props) {
  const { data: themeResponse } = useThemeQuery();

  const { data, getImageUrl } = useBuilderLogic(footerData, undefined);

  // Function to generate the correct href for links
  const pathname = usePathname();

  // Get copyright text or generate default
  const copyrightText =
    data.copyright ||
    `Copyright © ${new Date().getFullYear()} ${data.companyName}. All rights reserved.`;

  return (
    <footer
      className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground font-body"
    >
      <div className="mx-auto max-w-7xl flex flex-col items-start justify-center">
          {/* Logo */}
          <div className="mb-6">
          <FooterLogo
              footerData={data}
              getImageUrl={getImageUrl}
              textClassName="text-primary-foreground text-3xl font-bold tracking-tight font-heading"
              imageClassName="h-10"
              containerClassName="gap-4"
          />
          </div>

          {/* Social Links */}
          <div className="mb-8 flex items-center gap-4">
          {data.socialLinks.map(social => (
              <Link
              key={social.id}
              href={social.href || "#"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-all hover:bg-primary-foreground hover:text-primary hover:-translate-y-1"
              target={social.href?.startsWith("http") ? "_blank" : undefined}
              rel={
                  social.href?.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              >
              <SocialIcon platform={social.platform} className="h-5 w-5" />
              </Link>
          ))}
          </div>

          {/* Copyright */}
          <p className="text-left text-sm font-medium opacity-80">{copyrightText}</p>
      </div>
    </footer>
  );
}
