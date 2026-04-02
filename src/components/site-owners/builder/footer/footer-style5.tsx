import React from "react";
import { ChevronRight } from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import Link from "next/link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";
import { NewsletterForm } from "./shared/newsletter-form";
import { getProcessedCopyright } from "./shared/footer-utils";

interface FooterStyle5Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

// Helper component for column headers
const ColumnHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3 className="mb-6 text-2xl font-bold tracking-wide uppercase">
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
        <span className="group flex cursor-pointer items-center text-[15px] font-medium opacity-80 transition-colors duration-200 hover:opacity-100">
          <ChevronRight
            size={16}
            className="mr-2 opacity-70 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
          />
          {label}
        </span>
      ) : (
        <Link
          href={generateLinkHref(href, siteUser, pathname, isEditable)}
          className="group flex cursor-pointer items-center text-[15px] font-medium opacity-80 transition-colors duration-200 hover:opacity-100"
        >
          <ChevronRight
            size={16}
            className="mr-2 opacity-70 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
          />
          {label}
        </Link>
      )}
    </li>
  );
};

export function FooterStyle5({
  footerData,
  isEditable,
  siteUser,
}: FooterStyle5Props) {
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
    <footer
      className="relative overflow-hidden pt-16 pb-8 font-sans"
      style={{
        backgroundColor: footerData.backgroundColor || "#0b1221",
        color: footerData.textColor || "white",
      }}
    >
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
                  className="flex h-10 w-10 items-center justify-center rounded border border-current opacity-70 transition-all duration-300 hover:opacity-100"
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

        {/* Newsletter Section */}
        {data.newsletter?.enabled && (
          <div className="mb-12 border-t border-gray-800 pt-12">
            <div className="mx-auto max-w-md text-center">
              <h3 className="mb-4 text-xl font-bold tracking-wide  uppercase">
                {data.newsletter.title}
              </h3>
              <p className="mb-6 text-sm opacity-70">
                {data.newsletter.description}
              </p>
              <NewsletterForm isEditable={isEditable} theme={theme} />
            </div>
          </div>
        )}

        {/* Separator */}
        <div 
          className="mb-8 h-px w-full" 
          style={{ backgroundColor: footerData.textColor ? footerData.textColor + "20" : "rgba(255,255,255,0.1)" }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm opacity-70 md:flex-row">
          {/* Left: Copyright */}
          <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
            <p>{getProcessedCopyright(data.copyright, data.companyName)}</p>
            <p>Powered By Nepdora</p>
          </div>

          {/* Right: Policy Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
            {policyLinks.map(link => (
              <Link
                key={link.id}
                href={generateLinkHref(
                  link.href || "",
                  siteUser,
                  pathname,
                  isEditable
                )}
                className="cursor-pointer transition-colors hover:opacity-100"
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
        </div>
      </div>
    </footer>
  );
}
