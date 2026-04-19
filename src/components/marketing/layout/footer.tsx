import SocialIcons from "./social-icons";
import {
  nepdoraAddress,
  nepdoraEmail,
  nepdoraPhone,
} from "@/constants/contact";
import {
  MAJOR_CITIES,
  SEO_LOCATION_CONFIG,
  industries,
  INDUSTRY_LABELS,
} from "@/lib/seo-data";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";
import { FooterSection } from "./footer-animations";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_CATEGORY_DATA,
} from "@/constants/templates";

export const Footer = () => {
  return (
    <footer className="w-full overflow-hidden border-t border-gray-200 bg-gray-50 px-4 pt-12 pb-6 font-sans text-gray-900 sm:px-6 sm:pt-16 sm:pb-8 md:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Main Content Grid - Original Design */}
        <FooterSection className="mb-12 grid grid-cols-1 gap-8 sm:mb-16 sm:gap-10 lg:grid-cols-12">
          {/* Column 1: Info & Address */}
          <FooterSection
            className="flex flex-col space-y-5 pr-0 sm:space-y-6 lg:col-span-4 lg:pr-12"
            direction="-x"
          >
            <Image
              src="/nepdora-logooo.svg"
              alt="Logo"
              width={200}
              height={100}
            />
            <p className="max-w-sm text-xs leading-relaxed text-gray-600 sm:text-sm">
              Nepdora is the all-in-one platform for Nepali entrepreneurs to
              build, manage, and grow their online presence with local payment
              integrations and logistics support.
            </p>

            <hr className="w-full border-gray-200" />

            <div className="flex flex-col space-y-1.5 sm:space-y-2">
              <h3 className="text-base font-semibold text-gray-900">
                Visit Us
              </h3>
              <address className="text-xs leading-relaxed text-gray-600 not-italic sm:text-sm">
                {nepdoraAddress}
                <br />
                {nepdoraEmail}
                <br />
                {nepdoraPhone}
              </address>
            </div>
          </FooterSection>

          {/* Column 2: Main Pages Links */}
          <FooterSection className="lg:col-span-4" delay={0.05}>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
              Main Pages
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:gap-x-8 sm:gap-y-3">
              <div className="flex flex-col space-y-3">
                <FooterLink href="/">Home</FooterLink>
                <FooterLink href="/templates">Templates</FooterLink>
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="/showcase">Showcase</FooterLink>
                <FooterLink href="/compare">Compare</FooterLink>
              </div>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/contact">Contact Us</FooterLink>
                <FooterLink href="/partners">Partners</FooterLink>
                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms and Conditions</FooterLink>
                <FooterLink href="/data-delete">Data Delete</FooterLink>
                <FooterLink href="/support">Support</FooterLink>
                <FooterLink href="/faq">FAQ</FooterLink>
              </div>
            </div>
          </FooterSection>

          {/* Column 3: Newsletter */}
          <FooterSection
            className="pl-0 lg:col-span-4 lg:pl-8"
            delay={0.1}
            direction="x"
          >
            <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
              Newsletter
            </h3>
            <p className="mb-5 max-w-xs text-xs text-gray-600 sm:mb-6 sm:text-sm">
              Let&apos;s transform your vision into results and discuss your
              vision with us.
            </p>

            <NewsletterForm />
          </FooterSection>
        </FooterSection>

        {/* New Resources Section - Linked Features */}
        <div className="mb-12 border-t border-gray-200 pt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {/* Build with Nepdora / Industries */}
            <FooterSection delay={0.05}>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Build with Nepdora
              </h4>
              <div className="flex flex-col space-y-2">
                {industries.map(slug => (
                  <FooterLink key={slug} href={`/${slug}`}>
                    Create {INDUSTRY_LABELS[slug] || slug} Website in Nepdora
                  </FooterLink>
                ))}
              </div>
            </FooterSection>

            {/* Platform Features */}
            <FooterSection delay={0.1}>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Marketplace & Features
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/ai-website-builder-in-nepdora">
                  AI Website Builder
                </FooterLink>
                <FooterLink href="/integrations/esewa-payment">
                  eSewa Payment Integration in Nepdora
                </FooterLink>
                <FooterLink href="/integrations/khalti-payment">
                  Khalti Payment Integration in Nepdora
                </FooterLink>
                <FooterLink href="/integrations/sms-notifications">
                  SMS Notifications Integration in Nepdora
                </FooterLink>
                <FooterLink href="/integrations/facebook-pixel">
                  Facebook Pixel Integration in Nepdora
                </FooterLink>
                <FooterLink href="/integrations/pathao-parcel">
                  Pathao Parcel Integration in Nepdora
                </FooterLink>
                <FooterLink href="/integrations/pos-system">
                  POS System Integration in Nepdora
                </FooterLink>
                <FooterLink href="/integrations/dash-logistics">
                  Dash Logistics Integration in Nepdora
                </FooterLink>
              </div>
            </FooterSection>

            {/* Free Tools */}
            <FooterSection delay={0.15}>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Free Business Tools
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/tools/business-name-generator-nepal">
                  Name Generator
                </FooterLink>
                <FooterLink href="/tools/domain-name-checker-nepal">
                  Domain Checker
                </FooterLink>
                <FooterLink href="/tools/qr-code-generator">
                  QR Generator
                </FooterLink>
                <FooterLink href="/tools/seo-checker">SEO Audit</FooterLink>
                <FooterLink href="/tools/website-speed-test">
                  Speed Test
                </FooterLink>
                <FooterLink href="/tools/privacy-policy-generator-nepal">
                  Privacy Policy
                </FooterLink>
                <FooterLink href="/tools/free-website-analyzer">
                  Website Analyzer
                </FooterLink>
                <FooterLink href="/invoice-builder">Invoice Builder</FooterLink>
              </div>
            </FooterSection>

            {/* Templates */}
            <FooterSection delay={0.2}>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Nepdora Templates
              </h4>
              <div className="flex flex-col space-y-2">
                {TEMPLATE_CATEGORIES.map(slug => (
                  <FooterLink key={slug} href={`/templates/${slug}`}>
                    {TEMPLATE_CATEGORY_DATA[slug]?.name || slug} Templates
                  </FooterLink>
                ))}
              </div>
            </FooterSection>

            {/* Compare & Alternatives */}
            <FooterSection delay={0.25}>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Compare Alternatives
              </h4>
              <div className="mb-6 flex flex-col space-y-2">
                <FooterLink href="/alternative/shopify-nepal">
                  Shopify vs Nepdora
                </FooterLink>
                <FooterLink href="/alternative/wordpress-nepal">
                  WordPress vs Nepdora
                </FooterLink>
                <FooterLink href="/alternative/wix-nepal">
                  Wix vs Nepdora
                </FooterLink>
                <FooterLink href="/alternative/webflow-nepal">
                  Webflow vs Nepdora
                </FooterLink>
                <FooterLink href="/alternative/blanxer-nepal">
                  Blanxer vs Nepdora
                </FooterLink>
                <FooterLink href="/switch">Switch to Nepdora</FooterLink>
              </div>
            </FooterSection>

            <FooterSection delay={0.4}>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Learn & Resources
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/insights/how-to-start-online-business-in-nepal">
                  Start Online Business in Nepal
                </FooterLink>
                <FooterLink href="/insights/register-company-in-nepal-online">
                  Company Registration in Nepal
                </FooterLink>
                <FooterLink href="/use-cases/sell-products-online-nepal">
                  Sell Products Online in Nepal
                </FooterLink>
                <FooterLink href="/website-developer-nepal">
                  Website Developer Nepal
                </FooterLink>
                <FooterLink href="/insights">Nepdora Insights</FooterLink>
                <FooterLink href="/partners">Partner Program Nepal</FooterLink>
                <FooterLink href="/experts">
                  Hire Website Experts Nepal
                </FooterLink>
                <FooterLink href="/website-builder-nepal">
                  Website Builder Nepal
                </FooterLink>
                <FooterLink href="/glossary">Glossary</FooterLink>
                <FooterLink href="/showcase">Website Examples Nepal</FooterLink>
                <FooterLink href="/solutions">Solutions</FooterLink>
                <FooterLink href="/use-cases">Use Cases</FooterLink>
              </div>
            </FooterSection>

            {/* Popular Locations */}
            <FooterSection delay={0.35}>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Popular Locations
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {SEO_LOCATION_CONFIG.map(({ city, industry }) => (
                  <FooterLink
                    key={`${city}-${industry}`}
                    href={`/${industry}/${city.toLowerCase()}`}
                  >
                    <span className="capitalize">{city}</span>
                  </FooterLink>
                ))}
              </div>
            </FooterSection>
          </div>
        </div>

        {/* Bottom Bar */}
        <FooterSection
          className="flex flex-col items-center justify-between space-y-3 border-t border-gray-200 pt-5 sm:space-y-0 sm:pt-6 md:flex-row"
          direction="y"
        >
          <p className="text-xs text-gray-600">
            © Nepdora {new Date().getFullYear()} All rights reserved.
          </p>
          <SocialIcons />
        </FooterSection>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Link
    href={href}
    className="w-fit text-sm text-gray-600 transition-colors hover:text-black"
  >
    {children}
  </Link>
);

export default Footer;
