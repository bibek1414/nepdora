import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Globe,
  Github,
} from "lucide-react";
import { FooterData, SocialLink } from "@/types/owner-site/components/footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface FooterStyle6Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

// Icon mapping to resolve serialized icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  LinkedIn: Linkedin, // Alternative spelling
  Youtube,
  YouTube: Youtube, // Alternative spelling
  Music2,
  Tiktok: Music2, // Map Tiktok to Music2 icon
  Globe,
  Github,
  GitHub: Github, // Alternative spelling
};

// Helper function to render social icons with proper fallback
const renderSocialIcon = (social: SocialLink) => {
  const IconFromMap = iconMap[social.platform];
  if (IconFromMap) {
    return <IconFromMap className="h-6 w-6" />;
  }

  if (typeof social.icon === "function") {
    const IconComponent = social.icon;
    return <IconComponent className="h-6 w-6" />;
  }

  return <Globe className="h-6 w-6" />;
};

// Logo component
const FooterLogo = ({ footerData }: { footerData: FooterData }) => {
  const { logoType, logoImage, logoText, companyName } = footerData;

  if (logoType === "text") {
    return (
      <div className="flex items-center">
        <span className="text-2xl font-bold text-white">
          {logoText || companyName}
        </span>
      </div>
    );
  }

  if (logoType === "image") {
    return logoImage ? (
      <div className="flex items-center">
        <img
          src={logoImage}
          alt={companyName}
          className="h-10 w-auto object-contain"
        />
      </div>
    ) : (
      <div className="flex items-center">
        <span className="text-2xl font-bold text-white">{companyName}</span>
      </div>
    );
  }

  // logoType === "both"
  return (
    <div className="flex items-center gap-3">
      {logoImage && (
        <img
          src={logoImage}
          alt={companyName}
          className="h-10 w-auto object-contain"
        />
      )}
      <span className="text-2xl font-bold text-white">
        {logoText || companyName}
      </span>
    </div>
  );
};

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
  const generateLinkHref = (originalHref: string) => {
    if (isEditable) return originalHref;

    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return `/preview/${siteUser}`;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/preview/${siteUser}/${cleanHref}`;
  };

  const handleLinkClick = (href: string | undefined, e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      return;
    }

    if (isEditable) {
      e.preventDefault();
      return;
    }

    if (
      href.includes("/preview?") ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    e.preventDefault();
    const generatedHref = generateLinkHref(href);
    window.location.href = generatedHref;
  };

  // Get copyright text or generate default
  const copyrightText =
    footerData.copyright ||
    `Copyright © ${new Date().getFullYear()} ${footerData.companyName}. All rights reserved.`;

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
        className="flex w-full flex-col items-center justify-center py-20 text-white/70"
      >
        {/* Logo */}
        <div className="mb-4">
          <FooterLogo footerData={footerData} />
        </div>

        {/* Copyright */}
        <p className="mt-4 text-center">{copyrightText}</p>

        {/* Social Links */}
        <div className="mt-5 flex items-center gap-4">
          {footerData.socialLinks.map(social => (
            <a
              key={social.id}
              href={
                isEditable
                  ? "#"
                  : social.href?.startsWith("http")
                    ? social.href
                    : generateLinkHref(social.href || "#")
              }
              onClick={e => handleLinkClick(social.href, e)}
              className="text-white/50 transition-all duration-300 hover:-translate-y-0.5 hover:text-white/70"
            >
              {renderSocialIcon(social)}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
