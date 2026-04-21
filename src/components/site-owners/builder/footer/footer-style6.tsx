import { ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { FooterData } from "@/types/owner-site/components/footer";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import Image from "next/image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { NewsletterForm } from "./shared/newsletter-form";
import { getProcessedCopyright } from "./shared/footer-utils";
import { MadeWithLove } from "./shared/made-with-love";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
interface FooterStyle6Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void; // kept for API consistency, currently unused (centralized editor)
  onUpdate?: (updatedData: Partial<FooterData>) => void; // reserved for future inline editing
  siteUser?: string;
}

export const FooterStyle6: React.FC<FooterStyle6Props> = ({
  footerData,
  isEditable,
  onUpdate,
  siteUser,
}) => {
  const { data, getImageUrl } = useBuilderLogic(footerData, onUpdate);
  const { data: siteConfig } = useSiteConfig();

  const isPlaceholder = (text?: string) => {
    if (!text) return true;
    const placeholders = ["brand", "your brand"];
    return placeholders.includes(text.toLowerCase().trim());
  };

  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
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

  const pathname = usePathname();

  const mainSection1 = data.sections[0];
  const mainSection2 = data.sections[1];

  return (
    <footer
      className="w-full overflow-hidden border-t px-6 pt-16 pb-8 font-sans transition-colors duration-300 md:px-12 lg:px-24"
      style={{
        backgroundColor: footerData.backgroundColor || undefined,
        color: footerData.textColor || "inherit",
        borderColor: footerData.textColor
          ? footerData.textColor + "20"
          : "rgba(0,0,0,0.1)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Big Title Section */}
        {/* Big Title Section */}
        {(data.logoType === "text" || data.logoType === "both") &&
          data.logoText && (
            <div className="relative mb-12 flex w-full justify-center px-4">
              {/* Subtle glow effect behind the text */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-24 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[80px] transition-colors duration-300 dark:bg-blue-900/10" />

              <h1
                className="bg-gradient-to-b bg-clip-text text-center font-serif text-5xl leading-[0.8] font-medium tracking-tighter text-transparent transition-all duration-300 select-none sm:text-[13.5vw]"
                style={{
                  backgroundImage: `linear-gradient(to bottom, ${footerData.textColor || "#000"}, transparent)`,
                }}
              >
                {!isPlaceholder(data.logoText)
                  ? data.logoText
                  : !isPlaceholder(data.companyName)
                    ? data.companyName
                    : siteConfig?.business_name ||
                      data.logoText ||
                      data.companyName}
              </h1>
            </div>
          )}

        {/* Main Content Grid */}
        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Info & Address */}

          <div className="flex flex-col items-center space-y-6 pr-0 text-center md:items-start md:text-left lg:col-span-4 lg:pr-12">
            {data.logoType === "image" || data.logoType === "both" ? (
              <Image unoptimized
                src={getImageUrl(data.logoImage)}
                alt={
                  !isPlaceholder(data.logoText)
                    ? data.logoText
                    : !isPlaceholder(data.companyName)
                      ? data.companyName
                      : siteConfig?.business_name || "Logo"
                }
                width={100}
                height={100}
                className="max-h-[50px] w-auto"
              />
            ) : null}

            <p className="max-w-sm text-sm leading-relaxed opacity-80 sm:text-base">
              {data.description || ""}
            </p>

            <hr
              className="w-full transition-colors duration-300"
              style={{
                borderColor: footerData.textColor
                  ? footerData.textColor + "20"
                  : "rgba(0,0,0,0.1)",
              }}
            />

            <div className="flex flex-col items-center space-y-2 md:items-start">
              <h3 className="text-base font-bold tracking-wider uppercase">
                Visit Us
              </h3>

              <address className="text-sm leading-relaxed whitespace-pre-line not-italic opacity-80 sm:text-base">
                {data.contactInfo.address ||
                  "123 Wellness Avenue, Suite\n405, New York, NY 10016\nUnited States"}
              </address>
            </div>
          </div>

          {/* Column 2: Main Pages Links */}
          {((mainSection1 && mainSection1.links.length > 0) ||
            (mainSection2 && mainSection2.links.length > 0)) && (
            <div className="flex flex-col items-center md:items-start lg:col-span-4">
              <h3 className="mb-6 text-xl font-bold tracking-wider uppercase">
                {mainSection1?.title || "Main Pages"}
              </h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-center sm:grid-cols-2 md:text-left">
                <div className="flex flex-col space-y-3">
                  {(mainSection1?.links || []).map(link => (
                    <FooterLink
                      key={link.id}
                      href={generateLinkHref(
                        link.href || "",
                        siteUser,
                        pathname,
                        isEditable
                      )}
                      isEditable={isEditable}
                    >
                      {link.text}
                    </FooterLink>
                  ))}
                </div>
                <div className="flex flex-col space-y-3">
                  {(mainSection2?.links || []).map(link => (
                    <FooterLink
                      key={link.id}
                      href={generateLinkHref(
                        link.href || "",
                        siteUser,
                        pathname,
                        isEditable
                      )}
                      isEditable={isEditable}
                    >
                      {link.text}
                    </FooterLink>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Column 3: Newsletter */}
          {data.newsletter.enabled && (
            <div className="pl-0 lg:col-span-4 lg:pl-8">
              <h3 className="mb-4 text-xl font-semibold">
                {data.newsletter.title || "Newsletter"}
              </h3>
              <p className="mb-6 max-w-xs text-sm opacity-80">
                {data.newsletter.description ||
                  "Let's transform your vision into results and discuss your vision with us."}
              </p>
              <NewsletterForm isEditable={isEditable} theme={theme} />
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col items-center justify-between space-y-4 border-t pt-6 transition-colors duration-300 md:flex-row md:space-y-0"
          style={{
            borderColor: footerData.textColor
              ? footerData.textColor + "20"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="text-xs opacity-60">
              {getProcessedCopyright(
                data.copyright,
                data.companyName,
                siteConfig?.business_name
              )}
            </p>
            {data.policyLinks && data.policyLinks.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                {data.policyLinks.map(link => (
                  <Link
                    key={link.id}
                    href={generateLinkHref(
                      link.href || "",
                      siteUser,
                      pathname,
                      isEditable
                    )}
                    className="text-xs opacity-60 transition-colors hover:opacity-100"
                    onClick={isEditable ? e => e.preventDefault() : undefined}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {data.socialLinks.map(social => (
              <Link
                key={social.id}
                href={social.href || "#"}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:opacity-80"
                style={{
                  backgroundColor: theme.colors?.primary || "#000",
                  color: theme.colors?.primaryForeground || "#fff",
                }}
                target={social.href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href?.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                <SocialIcon platform={social.platform} className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <MadeWithLove textColor={footerData.textColor} />
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{
  href: string;
  children: React.ReactNode;
  isEditable?: boolean;
}> = ({ href, children, isEditable }) => {
  if (isEditable) {
    return (
      <button
        type="button"
        className="w-fit text-sm opacity-80 transition-colors hover:opacity-100"
        onClick={e => e.preventDefault()}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href || "#"}
      className="w-fit text-sm opacity-70 transition-colors hover:opacity-100"
    >
      {children}
    </Link>
  );
};
