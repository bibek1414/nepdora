import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { FooterData } from "@/types/owner-site/components/footer";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FooterStyle10Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void; // kept for API consistency, currently unused (centralized editor)
  onUpdate?: (updatedData: Partial<FooterData>) => void; // reserved for future inline editing
  siteUser?: string;
}

export const FooterStyle10: React.FC<FooterStyle10Props> = ({
  footerData,
  isEditable,
  onUpdate,
  siteUser,
}) => {
  const { data, getImageUrl } = useBuilderLogic(footerData, onUpdate);

  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const createNewsletterMutation = useCreateNewsletter();
  const pathname = usePathname();

  // Function to generate the correct href for links

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

  const mainSection1 = data.sections[0];
  const mainSection2 = data.sections[1];

  return (
    <footer className="w-full overflow-hidden border-t border-border bg-background px-6 pt-16 pb-8 font-body text-foreground transition-colors duration-300 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        {/* Big Title Section */}
        {(data.logoType === "text" || data.logoType === "both") &&
          data.logoText && (
            <div className="relative mb-12 flex w-full justify-center">
              {/* Subtle glow effect behind the text */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-24 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px] transition-colors duration-300" />

              <h1 className="bg-gradient-to-b from-foreground via-muted-foreground to-background bg-clip-text text-center font-heading text-[13.5vw] leading-[0.8] font-medium tracking-tighter text-transparent transition-all duration-300 select-none">
                {data.logoText}
              </h1>
            </div>
          )}

        {/* Main Content Grid */}
        <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Column 1: Info & Address */}

          <div className="flex flex-col items-start space-y-6 pr-0 text-left lg:col-span-4 lg:pr-12">
            {data.logoType === "image" || data.logoType === "both" ? (
              <Image
                src={getImageUrl(data.logoImage)}
                alt={data.companyName}
                width={100}
                height={100}
                className="max-h-[50px] w-auto"
              />
            ) : null}

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground transition-colors duration-300">
              {data.description ||
                "We're committed to delivering exceptional care with compassion, trust, and integrity. From your first visit to long-term support, your health and comfort are always our priority."}
            </p>

            <hr className="w-full border-border transition-colors duration-300" />

            <div className="flex flex-col items-start space-y-2 text-left">
              <h3 className="text-base font-semibold text-foreground transition-colors duration-300">
                Visit Us
              </h3>

              <address className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground not-italic transition-colors duration-300">
                {data.contactInfo.address ||
                  "123 Wellness Avenue, Suite\n405, New York, NY 10016\nUnited States"}
              </address>
            </div>
          </div>

          {/* Column 2: Main Pages Links */}
          <div className="lg:col-span-4">
            <h3 className="mb-6 text-xl font-semibold text-foreground transition-colors duration-300">
              {mainSection1?.title || "Main Pages"}
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
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

          {/* Column 3: Newsletter */}
          <div className="pl-0 lg:col-span-4 lg:pl-8">
            <h3 className="mb-4 text-xl font-semibold text-foreground transition-colors duration-300">
              {data.newsletter.title || "Newsletter"}
            </h3>
            <p className="mb-6 max-w-xs text-sm text-muted-foreground transition-colors duration-300">
              {data.newsletter.description ||
                "Let's transform your vision into results and discuss your vision with us."}
            </p>

            {data.newsletter.enabled ? (
              subscriptionStatus === "success" ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Successfully subscribed!</span>
                </div>
              ) : (
                <form
                  className="flex flex-col space-y-3"
                  onSubmit={handleNewsletterSubmit}
                >
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded-full border border-border bg-background px-6 py-3 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isEditable || createNewsletterMutation.isPending}
                  />

                  <Button
                    type="submit"
                    className="group hover:bg-primary/90 flex w-fit items-center space-x-3 rounded-full bg-primary py-2 pr-2 pl-6 text-primary-foreground shadow-md transition-all duration-300"
                    disabled={isEditable || createNewsletterMutation.isPending}
                  >
                    <span className="text-sm font-medium">
                      {createNewsletterMutation.isPending
                        ? "Subscribing..."
                        : "Subscribe"}
                    </span>
                    <div className="rounded-full bg-background p-2 transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={16} className="text-primary" />
                    </div>
                  </Button>

                  {subscriptionStatus === "error" && errorMessage && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </form>
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                Newsletter subscription is currently disabled.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between space-y-4 border-t border-border pt-6 transition-colors duration-300 md:flex-row md:space-y-0">
          <p className="text-xs text-muted-foreground">
            {data.copyright || "© Copyright 2025 All rights reserved."}
          </p>
          <div className="flex items-center gap-3">
            {data.socialLinks.map(social => (
              <Link
                key={social.id}
                href={social.href || "#"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-muted-foreground"
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
        className="w-fit text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
        onClick={e => e.preventDefault()}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href || "#"}
      className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
};
