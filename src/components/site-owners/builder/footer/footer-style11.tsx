import React, { useState } from "react";
import {
  ArrowRight,
  Phone,
  Send,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { FooterData } from "@/types/owner-site/components/footer";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import Image from "next/image";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { useCategories } from "@/hooks/owner-site/admin/use-category";

interface FooterStyle11Props {
  footerData: FooterData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<FooterData>) => void;
  siteUser?: string;
  onEditClick?: () => void;
}

export const FooterStyle11: React.FC<FooterStyle11Props> = ({
  footerData,
  isEditable,
  onUpdate,
  siteUser,
}) => {
  const { data, getImageUrl } = useBuilderLogic(footerData, onUpdate);
  const { data: siteConfig } = useSiteConfig();
  const { data: categoriesResponse } = useCategories();
  const categoriesResponseAny = categoriesResponse as any;
  const categories =
    categoriesResponseAny?.data?.results ||
    categoriesResponseAny?.results ||
    (Array.isArray(categoriesResponseAny?.data)
      ? categoriesResponseAny.data
      : []) ||
    [];

  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const createNewsletterMutation = useCreateNewsletter();
  const pathname = usePathname();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setSubscriptionStatus("error");
      return;
    }

    try {
      await createNewsletterMutation.mutateAsync({
        email: email.trim(),
        is_subscribed: true,
      });

      setSubscriptionStatus("success");
      setEmail("");
      setErrorMessage("");

      setTimeout(() => setSubscriptionStatus("idle"), 3000);
    } catch (error: any) {
      setErrorMessage(
        error?.message || "Failed to subscribe. Please try again."
      );
      setSubscriptionStatus("error");
    }
  };

  const companySection = data.sections[0];
  const helpSection = data.sections[1];

  return (
    <footer className="w-full bg-white pt-20 pb-10 font-sans text-gray-900 dark:bg-[#020205] dark:text-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Logo, Newsletter, Social */}
          <div className="flex flex-col space-y-6 lg:col-span-4 lg:pr-12">
            {data.logoType === "image" || data.logoType === "both" ? (
              <Image
                src={getImageUrl(data.logoImage)}
                alt={data.companyName}
                width={150}
                height={50}
                className="max-h-[60px] w-auto object-contain object-left"
              />
            ) : null}
            {(data.logoType === "text" || data.logoType === "both") &&
              data.logoText && (
                <h2 className="font-serif text-4xl tracking-tight text-gray-900 dark:text-white">
                  {data.logoText}
                </h2>
              )}

            <p className="max-w-[280px] text-base text-gray-600 dark:text-gray-400">
              {data.newsletter.description ||
                "Sign up today and get $20 off your first order."}
            </p>

            {/* Newsletter */}
            {data.newsletter.enabled && (
              <div className="mt-2 w-full max-w-[320px]">
                {subscriptionStatus === "success" ? (
                  <div className="flex items-center gap-2 py-3 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Successfully subscribed!</span>
                  </div>
                ) : (
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="relative w-full"
                  >
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      className="h-14 w-full rounded-full border-none bg-gray-50 px-6 pr-14 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-200 dark:bg-white/5 dark:text-white dark:focus-visible:ring-gray-700"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      disabled={
                        isEditable || createNewsletterMutation.isPending
                      }
                    />
                    <button
                      type="submit"
                      className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-gray-900 transition-colors hover:text-gray-600 disabled:opacity-50 dark:text-white dark:hover:text-gray-300"
                      disabled={
                        isEditable || createNewsletterMutation.isPending
                      }
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </form>
                )}
                {subscriptionStatus === "error" && errorMessage && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            <div className="mt-4 flex items-center gap-4">
              {siteConfig?.facebook_url && (
                <Link
                  href={siteConfig.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  <SocialIcon platform="facebook" className="h-4 w-4" />
                </Link>
              )}
              {siteConfig?.instagram_url && (
                <Link
                  href={siteConfig.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  <SocialIcon platform="instagram" className="h-4 w-4" />
                </Link>
              )}
              {siteConfig?.youtube_url && (
                <Link
                  href={siteConfig.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  <SocialIcon platform="youtube" className="h-4 w-4" />
                </Link>
              )}
              {siteConfig?.twitter_url && (
                <Link
                  href={siteConfig.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  <SocialIcon platform="twitter" className="h-4 w-4" />
                </Link>
              )}
              {siteConfig?.linkedin_url && (
                <Link
                  href={siteConfig.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  <SocialIcon platform="linkedin" className="h-4 w-4" />
                </Link>
              )}
              {siteConfig?.tiktok_url && (
                <Link
                  href={siteConfig.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  <SocialIcon platform="tiktok" className="h-4 w-4" />
                </Link>
              )}

              {/* Fallback to data.socialLinks if no config links */}
              {(!siteConfig ||
                (!siteConfig.facebook_url &&
                  !siteConfig.instagram_url &&
                  !siteConfig.twitter_url &&
                  !siteConfig.youtube_url &&
                  !siteConfig.linkedin_url &&
                  !siteConfig.tiktok_url)) &&
                data.socialLinks.map((social: any) => (
                  <Link
                    key={social.id}
                    href={social.href || "#"}
                    className="text-gray-900 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                    target={
                      social.href?.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      social.href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <SocialIcon
                      platform={social.platform}
                      className="h-4 w-4"
                    />
                  </Link>
                ))}
            </div>
          </div>

          {/* Column 2: Collection */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-white">
              Collection
            </h3>
            <ul className="flex flex-col space-y-4">
              {categories.slice(0, 6).map((category: any) => (
                <li key={category.id || category.slug}>
                  <Link
                    href={generateLinkHref(
                      `/collections?category=${category.slug}`,
                      siteUser,
                      pathname,
                      isEditable
                    )}
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-sm text-gray-400">No categories found</li>
              )}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-white">
              {companySection?.title || "Company"}
            </h3>
            <ul className="flex flex-col space-y-4">
              {(companySection?.links || []).map((link: any) => (
                <li key={link.id}>
                  <FooterLink
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
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Need Help */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-white">
              {helpSection?.title || "Need Help"}
            </h3>
            <ul className="flex flex-col space-y-4">
              {(helpSection?.links || []).map((link: any) => (
                <li key={link.id}>
                  <FooterLink
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
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Exclusive Services */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-white">
              Exclusive Services
            </h3>
            <ul className="flex flex-col space-y-5">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gray-900 dark:text-gray-300" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {siteConfig?.phone || "+1666 8888"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Send className="mt-0.5 h-[18px] w-[18px] shrink-0 -rotate-45 text-gray-900 dark:text-gray-300" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {siteConfig?.email || "help@archi.com"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gray-900 dark:text-gray-300" />
                <span className="text-sm leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
                  {siteConfig?.address ||
                    "2972 Westheimer Rd.\nSanta Ana, Illinois\n85486"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-100 pt-8 pb-4 md:flex-row dark:border-gray-800">
          <p className="mb-4 text-xs text-gray-500 md:mb-0 dark:text-gray-400">
            {data.copyright ||
              `© ${new Date().getFullYear()} ${data.companyName}. All Rights Reserved.`}
          </p>

          {data.policyLinks && data.policyLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6">
              {data.policyLinks.map((link: any) => (
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
          )}
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
        className="w-fit text-left text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        onClick={e => e.preventDefault()}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href || "#"}
      className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    >
      {children}
    </Link>
  );
};
