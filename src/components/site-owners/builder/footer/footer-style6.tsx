import React from "react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";

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

  // Helper function to darken a hex color
  const darkenColor = (hex: string, percent: number): string => {
    // Ensure hex has # prefix
    const color = hex.startsWith("#") ? hex : `#${hex}`;
    const num = parseInt(color.replace("#", ""), 16);

    // If parsing fails, return original color
    if (isNaN(num)) return hex;

    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
    return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
  };

  // Get gradient colors from theme
  const primaryColor = theme.colors.primary;
  const darkerPrimary = darkenColor(primaryColor, -40); // Darken by 40%

  // Function to generate the correct href for links
  const pathname = usePathname();

  // Get copyright text or generate default
  const copyrightText =
    data.copyright ||
    `Copyright © ${new Date().getFullYear()} ${data.companyName}. All rights reserved.`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <footer
        style={{
          background: `linear-gradient(to bottom, ${primaryColor} 0%, ${darkerPrimary} 100%)`,
        }}
        className="w-full px-4 py-16 text-white/70 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-center">
          {/* Logo */}
          <div className="mb-6">
            <FooterLogo
              footerData={data}
              getImageUrl={getImageUrl}
              textClassName="text-white text-3xl font-bold tracking-tight"
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
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-1 hover:bg-white hover:text-gray-900"
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
          <p className="text-left text-sm font-medium opacity-80">
            {copyrightText}
          </p>
        </div>
      </footer>
    </>
  );
}
