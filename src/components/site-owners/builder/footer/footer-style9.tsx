"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FooterData } from "@/types/owner-site/components/footer";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { generateLinkHref } from "@/lib/link-utils";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { getProcessedCopyright } from "./shared/footer-utils";
import { MadeWithLove } from "./shared/made-with-love";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import { toast } from "sonner";

interface FooterStyle13Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export const FooterStyle9 = ({
  footerData,
  isEditable,
  siteUser,
}: FooterStyle13Props) => {
  const { data, getImageUrl } = useBuilderLogic(footerData, undefined);
  const { data: siteConfig } = useSiteConfig();

  const isPlaceholder = (text?: string) => {
    if (!text) return true;
    const placeholders = ["brand", "your brand"];
    return placeholders.includes(text.toLowerCase().trim());
  };

  const pathname = usePathname();
  const textRef = useRef(null);
  const isInView = useInView(textRef, { once: false, amount: 0.1 });
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const [email, setEmail] = React.useState("");
  const mutation = useCreateNewsletter();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isEditable || mutation.isPending) return;

    try {
      await mutation.mutateAsync({
        email: email.trim(),
        is_subscribed: true,
      });
      toast.success("Successfully subscribed!");
      setEmail("");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.");
    }
  };

  return (
    <footer
      className="flex flex-col items-center pt-24 pb-0"
      style={{
        backgroundColor: data.backgroundColor || "#0b0b0b",
        color: data.textColor || "white",
      }}
    >
      <div className="flex max-w-7xl flex-col gap-20 px-6 md:px-12">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-between gap-16 lg:flex-row lg:items-start">
          {/* Newsletter */}
          {data.newsletter?.enabled && (
            <div className="flex w-full max-w-lg flex-col gap-8 text-center lg:text-left">
              <h3 className="text-3xl font-bold tracking-wide uppercase sm:text-4xl md:text-5xl">
                {data.newsletter.title || "Subscribe to our newsletter"}
              </h3>
              <form
                onSubmit={handleSubscribe}
                className="flex w-full flex-col items-center gap-4 rounded-3xl border p-2 transition-colors sm:flex-row sm:rounded-full"
              >
                <input
                  type="email"
                  placeholder="Enter Your Email..."
                  className="w-full flex-1 bg-transparent px-6 py-4 text-base outline-none sm:text-lg"
                  style={{ color: "inherit" }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isEditable || mutation.isPending}
                />
                <button
                  type="submit"
                  disabled={isEditable || mutation.isPending}
                  className="bg-primary text-primary-foreground flex w-full items-center justify-center rounded-2xl px-8 py-4 text-base font-bold whitespace-nowrap transition-all hover:opacity-90 active:scale-95 sm:w-auto sm:rounded-full sm:text-lg"
                  style={{
                    backgroundColor: theme?.colors?.primary || "#ccff00",
                    color: theme?.colors?.primaryForeground || "black",
                  }}
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Get Started"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-col gap-12 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-20 sm:gap-y-12 lg:justify-start lg:gap-x-32">
            {data.sections
              ?.filter(section => section.links.length > 0)
              .map(section => (
                <div
                  key={section.id}
                  className="flex flex-col items-center gap-5 sm:items-start"
                >
                  <h4 className="mb-2 text-xl font-bold tracking-wider uppercase">
                    {section.title}
                  </h4>
                  {section.links.map(link => (
                    <Link
                      key={link.id}
                      href={generateLinkHref(
                        link.href || "#",
                        siteUser,
                        pathname,
                        isEditable
                      )}
                      className="text-lg opacity-70 transition-colors hover:opacity-100"
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        </div>

        {/* Middle Section */}
        <div
          className="flex flex-col items-center justify-between gap-8 border-t pt-10 text-base opacity-70 lg:flex-row"
          style={{
            borderColor: data.textColor
              ? data.textColor + "1a"
              : "rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center gap-4">
            {data.socialLinks.map(social => (
              <a
                key={social.id}
                href={social.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:opacity-80"
                style={{
                  backgroundColor: data.textColor
                    ? data.textColor + "0d"
                    : "rgba(255,255,255,0.05)",
                }}
                title={social.platform}
              >
                <SocialIcon
                  platform={social.platform}
                  className="h-5 w-5"
                  style={{ color: data.textColor || "white" }}
                />
              </a>
            ))}
          </div>

          <div className="text-center lg:text-left">
            {data.contactInfo?.email || "contact@example.com"}
          </div>

          <div className="max-w-xs text-center lg:text-left">
            {data.contactInfo?.address || "Company Address"}
          </div>

          <div className="text-center lg:text-right">
            {getProcessedCopyright(
              data.copyright,
              data.companyName,
              siteConfig?.business_name
            )}
          </div>
        </div>

        {/* Made with Love by Nepdora */}
      </div>

      {/* Bottom Huge Text Animation */}
      <div
        ref={textRef}
        className="mt-24 flex max-w-7xl items-end justify-center overflow-hidden pb-4"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={isInView ? { y: 0 } : { y: "100%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none text-[14vw] leading-[0.75] font-bold tracking-tighter uppercase select-none"
          style={{
            color: data.textColor,
          }}
        >
          {!isPlaceholder(data.logoText)
            ? data.logoText
            : !isPlaceholder(data.companyName)
              ? data.companyName
              : siteConfig?.business_name ||
                data.logoText ||
                data.companyName ||
                "Nepdora"}
        </motion.div>
      </div>
      <div className="mt-8 pb-2">
        <MadeWithLove textColor={data.textColor} />
      </div>
    </footer>
  );
};

export default FooterStyle9;
