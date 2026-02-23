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
import { cn } from "@/lib/utils";

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
  <h3 className="mb-6 text-2xl font-bold tracking-wide uppercase text-left font-heading text-background">
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
    <li className="mb-3 text-left">
      {isEditable ? (
        <span className="group flex cursor-default items-center text-[15px] font-medium text-background/80 transition-colors duration-200 hover:text-background">
          <ChevronRight
            size={16}
            className="mr-2 text-background/60 transition-all duration-200 group-hover:translate-x-1 group-hover:text-background"
          />
          {label}
        </span>
      ) : (
        <Link
          href={generateLinkHref(href, siteUser, pathname, isEditable)}
          className="group flex items-center text-[15px] font-medium text-background/80 transition-colors duration-200 hover:text-background"
        >
          <ChevronRight
            size={16}
            className="mr-2 text-background/60 transition-all duration-200 group-hover:translate-x-1 group-hover:text-background"
          />
          {label}
        </Link>
      )}
    </li>
  );
};

export function FooterStyle9({
  footerData,
  isEditable,
  siteUser,
}: FooterStyle9Props) {
  const { data: themeResponse } = useThemeQuery();

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
    <footer className="relative overflow-hidden bg-foreground pt-20 pb-12 font-body text-background">
      {/* Subtle Background Elements to mimic the bridge/cityscape watermark */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
            </filter>
          </defs>
          <path d="M0 600 L100 500 L200 550 L300 450 L500 600 Z" fill="currentColor" />
          <circle cx="80%" cy="40%" r="300" fill="currentColor" filter="url(#blur)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Main Grid Content */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
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
                  className="flex h-10 w-10 items-center justify-center rounded border border-background/20 text-background/80 transition-all duration-300 hover:border-background hover:bg-background hover:text-foreground"
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
              <FooterLogo
                footerData={data}
                getImageUrl={getImageUrl}
                textClassName="text-background text-2xl tracking-tight font-bold font-heading"
                imageClassName="h-10"
                containerClassName="gap-3"
              />
            </div>

            {/* Decorative bottom graphic hint */}
            <div className="mt-auto hidden h-32 w-full translate-y-12 rounded-t-full bg-linear-to-t from-background/5 to-transparent opacity-20 blur-xl lg:block"></div>
          </div>
        </div>

        {/* Separator */}
        <div className="mb-8 h-px w-full bg-background/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 text-sm text-background/60 md:flex-row">
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
                className="transition-colors hover:text-background"
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
