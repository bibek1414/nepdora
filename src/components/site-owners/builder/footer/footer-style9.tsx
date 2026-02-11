import React from "react";
import { ChevronRight } from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import Link from "next/link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { SocialIcon } from "./shared/social-icon";

interface FooterStyle9Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

// Helper component for column headers
const ColumnHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3 className="mb-6 text-2xl font-bold tracking-wide text-white uppercase">
    {children}
  </h3>
);

// Helper component for list items
const LinkItem: React.FC<{
  label: string;
  href: string;
  isEditable?: boolean;
  siteUser?: string;
}> = ({ label, href, isEditable, siteUser }) => {
  const pathname = usePathname();

  return (
    <li className="mb-3">
      {isEditable ? (
        <span className="group flex cursor-default items-center text-[15px] font-medium text-gray-300 transition-colors duration-200 hover:text-white">
          <ChevronRight
            size={16}
            className="mr-2 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white"
          />
          {label}
        </span>
      ) : (
        <Link
          href={generateLinkHref(href, siteUser, pathname, isEditable)}
          className="group flex items-center text-[15px] font-medium text-gray-300 transition-colors duration-200 hover:text-white"
        >
          <ChevronRight
            size={16}
            className="mr-2 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white"
          />
          {label}
        </Link>
      )}
    </li>
  );
};

const FooterLogo = ({
  footerData,
  getImageUrl,
}: {
  footerData: FooterData;
  getImageUrl: any;
}) => {
  const { logoType, logoImage, logoText, companyName } = footerData;

  if (logoType === "text") {
    return (
      <span className="text-2xl font-bold tracking-tight text-white">
        {logoText || companyName}
      </span>
    );
  }

  if (logoType === "image") {
    return logoImage ? (
      <img
        src={getImageUrl(logoImage)}
        alt={companyName}
        className="h-10 w-auto object-contain"
      />
    ) : (
      <span className="text-2xl font-bold tracking-tight text-white">
        {companyName}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {logoImage && (
        <img
          src={getImageUrl(logoImage)}
          alt={companyName}
          className="h-10 w-auto object-contain"
        />
      )}
      <span className="text-2xl font-bold tracking-tight text-white">
        {logoText || companyName}
      </span>
    </div>
  );
};

export function FooterStyle9({
  footerData,
  isEditable,
  siteUser,
}: FooterStyle9Props) {
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

  // Map sections to specific columns
  const studentServices = data.sections[0];
  const aboutLinks = data.sections[1];
  const quickLinks = data.sections[2];

  // Default policy links if not provided
  const policyLinks = data.policyLinks || [
    { id: "p1", text: "Privacy Policy", href: "#" },
    { id: "p2", text: "Terms & Conditions", href: "#" },
    { id: "p3", text: "Code of Conduct", href: "#" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0b1221] pt-16 pb-8 font-sans text-white">
      {/* Subtle Background Elements to mimic the bridge/cityscape watermark */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
            </filter>
          </defs>
          <path d="M0 600 L100 500 L200 550 L300 450 L500 600 Z" fill="white" />
          <circle cx="80%" cy="40%" r="300" fill="white" filter="url(#blur)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Main Grid Content */}
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Student Services (Span 4) */}
          <div className="lg:col-span-4">
            {studentServices && (
              <>
                <ColumnHeader>{studentServices.title}</ColumnHeader>
                <ul className="space-y-1">
                  {studentServices.links.map(link => (
                    <LinkItem
                      key={link.id}
                      label={link.text}
                      href={link.href || "#"}
                      isEditable={isEditable}
                      siteUser={siteUser}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Column 2: About (Span 2) */}
          <div className="lg:col-span-2">
            {aboutLinks && (
              <>
                <ColumnHeader>{aboutLinks.title}</ColumnHeader>
                <ul className="space-y-1">
                  {aboutLinks.links.map(link => (
                    <LinkItem
                      key={link.id}
                      label={link.text}
                      href={link.href || "#"}
                      isEditable={isEditable}
                      siteUser={siteUser}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Column 3: Quick Links (Span 3) */}
          <div className="lg:col-span-3">
            {quickLinks && (
              <>
                <ColumnHeader>{quickLinks.title}</ColumnHeader>
                <ul className="space-y-1">
                  {quickLinks.links.map(link => (
                    <LinkItem
                      key={link.id}
                      label={link.text}
                      href={link.href || "#"}
                      isEditable={isEditable}
                      siteUser={siteUser}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Column 4: Socials & Logo (Span 3) */}
          <div className="flex flex-col items-start space-y-8 lg:col-span-3 lg:items-end">
            {/* Social Icons */}
            <div className="flex gap-3">
              {data.socialLinks.map(social => (
                <a
                  key={social.id}
                  href={social.href || "#"}
                  className="flex h-10 w-10 items-center justify-center rounded border border-gray-600 text-gray-300 transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0b1221]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon
                    platform={social.platform}
                    className="h-[18px] w-[18px]"
                  />
                </a>
              ))}
            </div>

            {/* Logo */}
            <div className="mt-4 cursor-pointer opacity-90 transition-opacity hover:opacity-100">
              <FooterLogo footerData={data} getImageUrl={getImageUrl} />
            </div>

            {/* Decorative bottom graphic hint */}
            <div className="mt-auto hidden h-32 w-full translate-y-12 rounded-t-full bg-linear-to-t from-white/5 to-transparent opacity-20 blur-xl lg:block"></div>
          </div>
        </div>

        {/* Separator */}
        <div className="mb-8 h-px w-full bg-gray-800" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-400 md:flex-row">
          {/* Left: Copyright */}
          <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
            <p>{data.copyright}</p>
            <p>Powered By Nepdora</p>
          </div>

          {/* Right: Policy Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
            {policyLinks.map(link => (
              <a
                key={link.id}
                href={link.href || "#"}
                className="transition-colors hover:text-white"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
