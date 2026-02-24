import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Heart, CheckCircle, AlertCircle } from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";

interface FooterStyle3Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle3({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle3Props) {
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

  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const createNewsletterMutation = useCreateNewsletter();

  const pathname = usePathname();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address");
      setSubscriptionStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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

      setTimeout(() => {
        setSubscriptionStatus("idle");
      }, 3000);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      setErrorMessage(
        error?.message || "Failed to subscribe. Please try again."
      );
      setSubscriptionStatus("error");
    }
  };

  // Get the first three sections for the grid layout
  const mainSections = data.sections.slice(0, 3);

  return (
    <div className="group relative">
      <footer
        style={{
          background: theme.colors.primary,
          fontFamily: theme.fonts.heading,
        }}
        className="px-4 py-20 text-gray-100 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Footer links grid */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {/* Info Section */}
            {mainSections.map((section, index) => (
              <div key={section.id} className="col-span-1">
                <h3 className="mb-6 text-lg font-bold tracking-wide text-white uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link.id}>
                      {isEditable ? (
                        <button
                          className="text-left text-sm text-white/70 transition-colors hover:text-white"
                          onClick={
                            isEditable ? e => e.preventDefault() : undefined
                          }
                        >
                          {link.text}
                        </button>
                      ) : (
                        <Link
                          href={generateLinkHref(
                            link.href || "",
                            siteUser,
                            pathname,
                            isEditable
                          )}
                          className="block text-sm text-white/70 transition-colors hover:text-white"
                        >
                          {link.text}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Section */}
            {data.newsletter.enabled && (
              <div className="col-span-2 lg:col-span-2">
                <h3 className="mb-6 text-lg font-bold tracking-wide text-white uppercase">
                  {data.newsletter.title}
                </h3>
                <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/70">
                  {data.newsletter.description}
                </p>

                {subscriptionStatus === "success" ? (
                  <div className="flex w-fit items-center gap-2 rounded-lg bg-white/10 p-3 text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Successfully subscribed!</span>
                  </div>
                ) : (
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex max-w-sm flex-col gap-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded-full border-none bg-white/10 px-6 py-3 text-white placeholder-white/50 backdrop-blur-sm focus:ring-2 focus:ring-white/30"
                        disabled={
                          isEditable || createNewsletterMutation.isPending
                        }
                      />
                      <Button
                        type="submit"
                        style={{
                          backgroundColor: theme.colors.secondary,
                        }}
                        className="w-full rounded-full px-8 py-3 font-semibold text-white transition-all hover:brightness-110 sm:w-auto"
                        disabled={
                          isEditable || createNewsletterMutation.isPending
                        }
                      >
                        {createNewsletterMutation.isPending ? "..." : "Join"}
                      </Button>
                    </div>

                    {subscriptionStatus === "error" && errorMessage && (
                      <div className="mt-1 flex items-center gap-2 text-xs text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{errorMessage}</span>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Bottom section */}
          <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-gray-200 md:flex-row">
            <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
              {/* Logo */}
              <div className="flex items-center">
                <FooterLogo
                  footerData={data}
                  getImageUrl={getImageUrl}
                  textClassName="text-white text-xl font-bold"
                  imageClassName="h-8 w-auto"
                  containerClassName="gap-3"
                />
              </div>

              {/* Copyright */}
              <div className="text-center text-xs text-white/50 md:text-left">
                <p>{data.copyright}</p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {data.socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.href || "#"}
                  className="hover:text-primary flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:-translate-y-1 hover:bg-white"
                  target={
                    social.href?.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    social.href?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <SocialIcon platform={social.platform} className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
