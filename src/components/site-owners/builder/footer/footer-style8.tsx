"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FooterData,
  FooterLink as FooterLinkType,
} from "@/types/owner-site/components/footer";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { generateLinkHref } from "@/lib/link-utils";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";
import { NewsletterForm } from "./shared/newsletter-form";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { getProcessedCopyright } from "./shared/footer-utils";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { MadeWithLove } from "./shared/made-with-love";
import { useServices } from "@/hooks/owner-site/admin/use-services";

interface FooterStyle8Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export const FooterStyle8 = ({
  footerData,
  isEditable,
  siteUser,
}: FooterStyle8Props) => {
  const { data, getImageUrl } = useBuilderLogic(footerData, undefined);
  const { data: siteConfig } = useSiteConfig();
  const pathname = usePathname();
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

  // Fetch dynamic services
  const { data: servicesResponse, isLoading: servicesLoading } = useServices({
    page_size: 6,
  });

  const isPreviewMode = pathname?.includes("/preview/");
  const basePath = isPreviewMode
    ? "/service-details-draft"
    : "/service-details";

  const dynamicServices =
    servicesResponse?.results.map(service => ({
      id: String(service.id),
      text: service.title,
      href: `${basePath}/${service.slug}`,
    })) || [];

  return (
    <footer
      className="w-full border-t border-black/5 font-sans"
      style={{
        backgroundColor: data.backgroundColor || "white",
        color: data.textColor || "black",
        borderColor: data.textColor
          ? data.textColor + "10"
          : "rgba(0,0,0,0.05)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo & About */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <FooterLogo footerData={data} getImageUrl={getImageUrl} />
            </div>

            <p className="text-sm leading-relaxed opacity-70">
              {data.description ||
                "With many years of experience and expertise, we customize solutions to meet the specific needs of businesses."}
            </p>

            <div className="flex gap-4">
              {data.socialLinks.map(social => (
                <a
                  key={social.id}
                  href={social.href || "#"}
                  className="transition-colors duration-200 hover:opacity-70"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon platform={social.platform} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Dynamic Services Section */}
          {(dynamicServices.length > 0 || servicesLoading) && (
            <ServicesSection
              title="Our Services"
              services={dynamicServices}
              siteUser={siteUser}
              pathname={pathname}
              isLoading={servicesLoading}
            />
          )}

          {/* Column 3+: Static Sections from footer data */}
          {data.sections
            ?.filter(section => section.links.length > 0)
            .map(section => (
              <ServicesSection
                key={section.id}
                title={section.title}
                services={section.links}
                siteUser={siteUser}
                pathname={pathname}
              />
            ))}

          {/* Column 3: Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="mb-6 text-lg font-semibold">Contact Info</h3>
            <div className="space-y-6 text-sm">
              <div className="space-y-1">
                <p className="text-sm font-semibold opacity-50">Address:</p>
                <p className="max-w-[220px] leading-relaxed opacity-70">
                  {data.contactInfo?.address || "Location not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold opacity-50">Email:</p>
                <a
                  href={`mailto:${data.contactInfo?.email}`}
                  className="opacity-70 transition-colors hover:opacity-100"
                >
                  {data.contactInfo?.email || "email@example.com"}
                </a>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold opacity-60">Phone:</p>
                <a
                  href={`tel:${data.contactInfo?.phone}`}
                  className="opacity-70 transition-colors hover:opacity-100"
                >
                  {data.contactInfo?.phone || "Phone not specified"}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Column 4: Newsletter */}
          {data.newsletter?.enabled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="mb-6 text-lg font-semibold">
                {data.newsletter?.title || "Newsletter"}
              </h3>
              <p className="mb-6 text-sm leading-relaxed opacity-70">
                {data.newsletter?.description ||
                  "Join our subscribers list to get latest news and special offers."}
              </p>
              {data.newsletter?.enabled ? (
                <NewsletterForm theme={theme} />
              ) : (
                <p className="text-sm text-slate-500 italic">
                  Newsletter is currently disabled.
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col items-center justify-between space-y-4 border-t pt-8 text-sm opacity-70 md:flex-row md:space-y-0"
          style={{
            borderColor: data.textColor
              ? data.textColor + "10"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <p className="text-center md:text-left">
            {getProcessedCopyright(
              data.copyright,
              data.companyName,
              siteConfig?.business_name
            )}
          </p>
          <div className="flex space-x-6">
            {(data.policyLinks || []).map(link => (
              <Link
                key={link.id}
                href={generateLinkHref(
                  link.href || "#",
                  siteUser,
                  pathname,
                  false
                )}
                className="cursor-pointer transition-colors hover:opacity-100"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="mt-8 text-center"
          style={{
            borderColor: data.textColor
              ? data.textColor + "10"
              : "rgba(0,0,0,0.05)",
          }}
        >
          <MadeWithLove textColor={data.textColor} />
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{
  href: string;
  children: React.ReactNode;
  siteUser?: string;
  pathname: string;
}> = ({ href, children, siteUser, pathname }) => (
  <li>
    <Link
      href={generateLinkHref(href, siteUser, pathname, false)}
      className="block cursor-pointer transition-colors duration-200 hover:opacity-100"
    >
      {children}
    </Link>
  </li>
);

const ServicesSection = ({
  title,
  services,
  siteUser,
  pathname,
  isLoading,
}: {
  title: string;
  services: FooterLinkType[];
  siteUser?: string;
  pathname: string;
  isLoading?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="mb-6 text-lg font-semibold">{title}</h3>
      {isLoading ? (
        <div className="flex items-center space-x-2 text-sm opacity-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : services.length > 0 ? (
        <ul className="space-y-3 text-sm opacity-70">
          {services.map(service => (
            <FooterLink
              key={service.id}
              href={service.href || "#"}
              siteUser={siteUser}
              pathname={pathname}
            >
              {service.text}
            </FooterLink>
          ))}
        </ul>
      ) : (
        <p className="text-sm opacity-70">No services available</p>
      )}
    </motion.div>
  );
};

export default FooterStyle8;
