import SocialIcons from "./social-icons";
import {
  nepdoraAddress,
  nepdoraEmail,
  nepdoraPhone,
} from "@/constants/contact";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";
import { FooterSection } from "./footer-animations";

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
              We&apos;re committed to delivering exceptional care with
              compassion, trust, and integrity. From your first visit to
              long-term support, your health and comfort are always our
              priority.
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
              </div>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/contact">Contact Us</FooterLink>
                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms and Conditions</FooterLink>
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
        <FooterSection className="mb-12 border-t border-gray-200 pt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {/* Categories */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Categories
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/ecommerce-website">
                  Ecommerce Website
                </FooterLink>
                <FooterLink href="/agency-website">Agency Website</FooterLink>
                <FooterLink href="/booking-website">Booking Website</FooterLink>
                <FooterLink href="/restaurant-website">
                  Restaurant Website
                </FooterLink>
                <FooterLink href="/clinic-website">Clinic Website</FooterLink>
                <FooterLink href="/dental-website">Dental Website</FooterLink>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">Features</h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/features/esewa-integration">
                  eSewa Integration
                </FooterLink>
                <FooterLink href="/features/khalti">
                  Khalti Integration
                </FooterLink>
                <FooterLink href="/features/sms">SMS Integration</FooterLink>
                <FooterLink href="/features/facebook-pixel">
                  Facebook Pixel
                </FooterLink>
                <FooterLink href="/features/dash">Dash Logistics</FooterLink>
                <FooterLink href="/features/pathao-parcel">
                  Pathao Parcel
                </FooterLink>
              </div>
            </div>

            {/* Tools */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Free Tools
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/free-website-analyzer">
                  Website Analyzer
                </FooterLink>
                <FooterLink href="/invoice-builder">Invoice Builder</FooterLink>
              </div>
            </div>

            {/* Templates */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Templates
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/website-templates">All Templates</FooterLink>
                <FooterLink href="/website-templates">Portfolio</FooterLink>
                <FooterLink href="/website-templates">Business</FooterLink>
                <FooterLink href="/website-templates">E-commerce</FooterLink>
              </div>
            </div>

            {/* Compare */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">Compare</h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/compare/shopify-and-nepdora">
                  Shopify vs Nepdora
                </FooterLink>
                <FooterLink href="/compare/webflow-and-nepdora">
                  Webflow vs Nepdora
                </FooterLink>
                <FooterLink href="/compare/wordpress-and-nepdora">
                  WordPress vs Nepdora
                </FooterLink>
                <FooterLink href="/compare/wix-and-nepdora">
                  Wix vs Nepdora
                </FooterLink>
                <FooterLink href="/compare/blanxer-and-nepdora">
                  Blanxer vs Nepdora
                </FooterLink>
              </div>
            </div>

            {/* Cities */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Popular Locations
              </h4>
              <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                {[
                  "Kathmandu",
                  "Pokhara",
                  "Lalitpur",
                  "Bharatpur",
                  "Birgunj",
                  "Biratnagar",
                  "Itahari",
                  "Dharan",
                  "Butwal",
                  "Hetauda",
                  "Nepalgunj",
                  "Dhangadhi",
                ].map(city => (
                  <FooterLink
                    key={city}
                    href={`/agency-website/${city.toLowerCase()}`}
                  >
                    {city}
                  </FooterLink>
                ))}
              </div>
              <Link
                href="/templates"
                className="text-primary mt-4 inline-block text-xs font-semibold hover:underline"
              >
                View all templates
              </Link>
            </div>
          </div>
        </FooterSection>

        {/* Bottom Bar */}
        <FooterSection
          className="flex flex-col items-center justify-between space-y-3 border-t border-gray-200 pt-5 sm:space-y-0 sm:pt-6 md:flex-row"
          direction="y"
        >
          <p className="text-xs text-gray-500">
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
    className="w-fit text-sm text-gray-500 transition-colors hover:text-black"
  >
    {children}
  </Link>
);

export default Footer;
