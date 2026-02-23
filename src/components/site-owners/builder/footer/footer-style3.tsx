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
import { cn } from "@/lib/utils";

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
        className="px-4 py-20 bg-primary text-primary-foreground font-heading sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Footer links grid */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {/* Info Section */}
            {mainSections.map((section, index) => (
              <div key={section.id} className="col-span-1">
                <h3 className="mb-6 text-lg font-bold tracking-wide uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link.id}>
                      {isEditable ? (
                        <button
                          className="text-left text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground font-body"
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
                          className="block text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground font-body"
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
                <h3 className="mb-6 text-lg font-bold tracking-wide uppercase">
                  {data.newsletter.title}
                </h3>
                <p className="mb-6 text-sm text-primary-foreground/70 leading-relaxed max-w-xs font-body">
                  {data.newsletter.description}
                </p>

                {subscriptionStatus === "success" ? (
                  <div className="flex items-center gap-2 text-green-300 bg-primary-foreground/10 p-3 rounded-lg w-fit">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Successfully subscribed!</span>
                  </div>
                ) : (
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex flex-col gap-3 max-w-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded-full border-none bg-primary-foreground/10 px-6 py-3 text-primary-foreground placeholder:text-primary-foreground/50 focus:ring-2 focus:ring-primary-foreground/30 backdrop-blur-sm"
                        disabled={
                          isEditable || createNewsletterMutation.isPending
                        }
                      />
                      <Button
                        type="submit"
                        className="w-full rounded-full px-8 py-3 font-semibold transition-all hover:brightness-110 sm:w-auto bg-secondary text-secondary-foreground"
                        disabled={
                          isEditable || createNewsletterMutation.isPending
                        }
                      >
                        {createNewsletterMutation.isPending
                          ? "..."
                          : "Join"}
                      </Button>
                    </div>

                    {subscriptionStatus === "error" && errorMessage && (
                      <div className="flex items-center gap-2 text-destructive-foreground text-xs mt-1 bg-destructive p-1 rounded">
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
          <div className="mt-20 flex flex-col items-center justify-between border-t border-primary-foreground/10 pt-8 text-sm text-primary-foreground/80 md:flex-row gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Logo */}
                <div className="flex items-center">
                <FooterLogo
                    footerData={data}
                    getImageUrl={getImageUrl}
                    textClassName="text-primary-foreground text-xl font-bold font-heading"
                    imageClassName="h-8 w-auto"
                    containerClassName="gap-3"
                />
                </div>

                {/* Copyright */}
                <div className="text-center md:text-left text-primary-foreground/50 text-xs font-body">
                <p>{data.copyright}</p>
                </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {data.socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.href || "#"}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/5 text-primary-foreground/70 transition-all hover:bg-primary-foreground hover:text-primary hover:-translate-y-1"
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
