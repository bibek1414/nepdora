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
              </div>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/contact">Contact Us</FooterLink>
                <FooterLink href="/partners">Partners</FooterLink>
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
            {/* Solutions / Industries */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Build with Nepdora
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/create-ecommerce-website-in-nepdora">
                  Create eCommerce Website in Nepdora
                </FooterLink>
                <FooterLink href="/create-restaurant-website-in-nepdora">
                  Create Restaurant Website in Nepdora
                </FooterLink>
                <FooterLink href="/create-clothing-store-website-in-nepdora">
                  Create Clothing Store Website in Nepdora
                </FooterLink>
                <FooterLink href="/create-educational-consultancy-website-in-nepdora">
                  Create Education Website in Nepdora
                </FooterLink>
                <FooterLink href="/create-travel-agency-website-in-nepdora">
                  Create Travel & Tour Website in Nepdora
                </FooterLink>
                <FooterLink href="/create-grocery-website-in-nepdora">
                  Create Grocery Website in Nepdora
                </FooterLink>
                <FooterLink href="/create-clinic-website-in-nepdora">
                  Create Medical Clinic Website in Nepdora
                </FooterLink>
              </div>
            </div>

            {/* Original Categories */}

            {/* Features */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Platform Features
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/features/esewa-integration-in-nepdora">
                  eSewa Integration in Nepdora
                </FooterLink>
                <FooterLink href="/features/khalti-integration-in-nepdora">
                  Khalti Integration in Nepdora
                </FooterLink>
                <FooterLink href="/features/sms-notifications-in-nepdora">
                  SMS Notifications in Nepdora
                </FooterLink>
                <FooterLink href="/ai-website-builder-in-nepdora">
                  AI Builder in Nepdora
                </FooterLink>
                <FooterLink href="/features/facebook-pixel-integration-in-nepdora">
                  Facebook Pixel in Nepdora
                </FooterLink>
                <FooterLink href="/features/logistics-pathao-dash-in-nepdora">
                  Logistics (Pathao, YDM & Dash) in Nepdora
                </FooterLink>

                <FooterLink href="/features/pos-system-in-nepdora">
                  POS System in Nepdora
                </FooterLink>
                <FooterLink href="/esewa-integration-guide-in-nepdora">
                  eSewa Setup Guide in Nepdora
                </FooterLink>
                <FooterLink href="/khalti-payment-gateway-in-nepdora">
                  Khalti Setup Guide in Nepdora
                </FooterLink>
              </div>
            </div>

            {/* Free Tools */}
            <div>
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
                <FooterLink href="/invoice-builder">Invoice Maker</FooterLink>
              </div>
            </div>

            {/* Resources / Learn */}

            {/* Templates */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Nepdora Templates
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/templates/ecommerce">
                  E-commerce Templates
                </FooterLink>
                <FooterLink href="/templates/restaurant">
                  Restaurant Templates
                </FooterLink>
                <FooterLink href="/templates/portfolio">
                  Portfolio & CV Templates
                </FooterLink>
                <FooterLink href="/templates/agency">
                  Digital Agency Templates
                </FooterLink>
                <FooterLink href="/templates/medical-clinic">
                  Medical & Clinic Templates
                </FooterLink>
                <FooterLink href="/templates/grocery-store">
                  Grocery Store Templates
                </FooterLink>
                <FooterLink href="/templates/clothing-store">
                  Clothing Store Templates
                </FooterLink>
                <FooterLink href="/templates/educational-consultancy">
                  Educational Consultancy Templates
                </FooterLink>
              </div>
            </div>
            {/* Compare & Locations */}
            <div>
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
                <FooterLink href="/switch">
                  Switch to Nepdora
                </FooterLink>
              </div>
            </div>
            {/* Cities/Rankings */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Best in Nepal
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/best/website-builders-for-restaurants-nepal">
                  Best Restaurant Website Builder in Nepal
                </FooterLink>
                <FooterLink href="/best/website-builders-for-ecommerce-nepal">
                  Best E-commerce Website Builder in Nepal
                </FooterLink>
                <FooterLink href="/best/website-builders-for-clothing-store-nepal">
                  Best Clothing Store Builder in Nepal
                </FooterLink>
                <FooterLink href="/best/website-builders-for-educational-consultancy-nepal">
                  Best Educational Consultancy Builder in Nepal
                </FooterLink>
              </div>
            </div>

            {/* Others column (moved to second row/next col) */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Learn & Resources
              </h4>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/learn/how-to-start-online-business-in-nepal">
                  Start Online Business in Nepal
                </FooterLink>

                <FooterLink href="/learn/register-company-in-nepal-online">
                  Company Registration in Nepal
                </FooterLink>

                <FooterLink href="/use-cases/sell-products-online-nepal">
                  Sell Products Online in Nepal
                </FooterLink>

                <FooterLink href="/website-developer-nepal">
                  Website Developer Nepal
                </FooterLink>

                <FooterLink href="/learn">Nepdora Learn</FooterLink>

                <FooterLink href="/partners">Partner Program Nepal</FooterLink>

                <FooterLink href="/experts">
                  Hire Website Experts Nepal
                </FooterLink>

                <FooterLink href="/website-builder-nepal">
                  Website Builder Nepal
                </FooterLink>

                <FooterLink href="/showcase">Website Examples Nepal</FooterLink>
              </div>
            </div>
          </div>
        </FooterSection>

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
