import React from "react";
import {
  MapPin,
  Mail,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Globe,
  Phone,
} from "lucide-react";
import { FooterData, SocialLink } from "@/types/owner-site/components/footer";
import Link from "next/link";

interface FooterStyle8Props {
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
  LinkedIn: Linkedin,
  Youtube,
  YouTube: Youtube,
  Music2,
  Tiktok: Music2,
  Globe,
};

const renderSocialIcon = (social: SocialLink) => {
  const IconFromMap = iconMap[social.platform];
  if (IconFromMap) {
    return <IconFromMap className="h-4 w-4" />;
  }
  if (typeof social.icon === "function") {
    const IconComponent = social.icon;
    return <IconComponent className="h-4 w-4" />;
  }
  return <Facebook className="h-4 w-4" />;
};

const FooterLogo = ({ footerData }: { footerData: FooterData }) => {
  const { logoType, logoImage, logoText, companyName } = footerData;

  if (logoType === "text") {
    return (
      <span className="text-vistara-accent text-2xl font-semibold tracking-tight">
        {logoText || companyName}
      </span>
    );
  }

  if (logoType === "image") {
    return logoImage ? (
      <img
        src={logoImage}
        alt={companyName}
        className="h-8 w-auto object-contain"
      />
    ) : (
      <span className="text-vistara-accent text-2xl font-semibold tracking-tight">
        {companyName}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {logoImage && (
        <img
          src={logoImage}
          alt={companyName}
          className="h-8 w-auto object-contain"
        />
      )}
      <span className="text-vistara-accent text-2xl font-semibold tracking-tight">
        {logoText || companyName}
      </span>
    </div>
  );
};

export function FooterStyle8({
  footerData,
  isEditable,
  siteUser,
}: FooterStyle8Props) {
  const generateLinkHref = (originalHref: string) => {
    if (isEditable) return originalHref;
    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return `/preview/${siteUser}`;
    }
    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/preview/${siteUser}/${cleanHref}`;
  };

  // Split sections into two columns if possible
  const section1 = footerData.sections[0];
  const section2 = footerData.sections[1];

  return (
    <footer className="border-t border-gray-800 bg-[#1A1A1A] font-sans text-white">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Brand Info */}
          <div className="w-full border-b border-gray-800 p-8 lg:w-[40%] lg:border-r lg:border-b-0 lg:p-16">
            <div className="mb-6 flex items-center gap-3">
              <FooterLogo footerData={footerData} />
            </div>
            <p className="max-w-md text-lg leading-relaxed text-gray-400">
              {footerData.description}
            </p>
          </div>

          {/* Column 2 & 3 & 4 Container */}
          <div className="flex w-full flex-col md:flex-row lg:w-[60%]">
            {/* Links Columns */}
            <div className="flex flex-1 gap-12 border-b border-gray-800 p-8 sm:gap-20 md:border-r md:border-b-0 lg:p-16">
              {/* Quick Links (Section 1) */}
              {section1 && (
                <div className="flex flex-col gap-6">
                  <h3 className="text-lg font-medium text-white">
                    {section1.title}
                  </h3>
                  <ul className="space-y-4">
                    {section1.links.map(link => (
                      <li key={link.id}>
                        {isEditable ? (
                          <span className="cursor-default font-medium text-gray-400 transition-colors hover:text-white">
                            {link.text}
                          </span>
                        ) : (
                          <Link
                            href={generateLinkHref(link.href || "")}
                            className="font-medium text-gray-400 transition-colors hover:text-white"
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
                <div className="flex flex-col gap-6">
                  <h3 className="text-lg font-medium text-white">
                    {section2.title}
                  </h3>
                  <ul className="space-y-4">
                    {section2.links.map(link => (
                      <li key={link.id}>
                        {isEditable ? (
                          <span className="cursor-default font-medium text-gray-400 transition-colors hover:text-white">
                            {link.text}
                          </span>
                        ) : (
                          <Link
                            href={generateLinkHref(link.href || "")}
                            className="font-medium text-gray-400 transition-colors hover:text-white"
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
            <div className="flex flex-1 flex-col justify-start gap-8 p-8 lg:p-16">
              {footerData.contactInfo.address && (
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <MapPin className="h-6 w-6 stroke-[1.5] text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg leading-snug font-medium text-white">
                      {footerData.contactInfo.address}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Mail className="h-6 w-6 stroke-[1.5] text-white" />
                </div>
                <div className="flex flex-col">
                  {footerData.contactInfo.email && (
                    <a
                      href={`mailto:${footerData.contactInfo.email}`}
                      className="text-lg font-medium text-white transition-colors hover:text-gray-300"
                    >
                      {footerData.contactInfo.email}
                    </a>
                  )}
                  {footerData.contactInfo.phone && (
                    <a
                      href={`tel:${footerData.contactInfo.phone}`}
                      className="mt-1 text-lg font-medium text-white transition-colors hover:text-gray-300"
                    >
                      {footerData.contactInfo.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-start justify-between gap-6 border-t border-gray-800 px-8 py-8 md:flex-row md:items-center lg:px-16">
          {/* Social Links */}
          <div className="flex items-center gap-6 font-medium text-white">
            {footerData.socialLinks.map(social => (
              <a
                key={social.id}
                href={social.href || "#"}
                className="group flex items-center gap-1 transition-colors hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.platform}
                <ChevronRight className="h-4 w-4 text-white group-hover:text-gray-300" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-right text-sm leading-relaxed text-gray-300 md:text-base">
            <p>{footerData.copyright}</p>
            <p>
              Powered By <span className="font-medium text-white">Nepdora</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
