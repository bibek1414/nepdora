import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";

interface FooterStyle4Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle4({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle4Props) {
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

  return (
    <div className="group relative">
      <footer
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
        }}
        className="text-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {/* Main content */}
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Logo */}
              <div>
                <FooterLogo
                  footerData={data}
                  getImageUrl={getImageUrl}
                  textClassName="text-foreground text-2xl font-bold"
                  imageClassName="h-10 w-auto"
                  containerClassName="gap-4"
                />
              </div>

              <p className="text-lg leading-relaxed text-white/90 max-w-md">
                {data.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                {data.contactInfo.email && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full">
                        <Mail className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90 text-sm font-medium">
                      {data.contactInfo.email}
                    </span>
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full">
                        <Phone className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90 text-sm font-medium">
                      {data.contactInfo.phone}
                    </span>
                  </div>
                )}
                {data.contactInfo.address && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded-full mt-1">
                        <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90 text-sm font-medium leading-relaxed">
                      {data.contactInfo.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Link Sections */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-8">
                {data.sections.map(section => (
                <div key={section.id}>
                    <h4 className="mb-6 text-lg font-bold tracking-wide">{section.title}</h4>
                    <ul className="space-y-3">
                    {section.links.map(link => (
                        <li key={link.id}>
                        {isEditable ? (
                            <button
                            className="text-left text-sm text-white/80 transition-all hover:translate-x-1 hover:text-white"
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
                            className="block text-left text-sm text-white/80 transition-all hover:translate-x-1 hover:text-white"
                            >
                            {link.text}
                            </Link>
                        )}
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
          </div>

          {/* Newsletter Section */}
          {data.newsletter.enabled && (
            <div className="mt-20 rounded-3xl bg-white/10 p-8 md:p-12 backdrop-blur-md border border-white/10">
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="text-2xl font-bold">
                    {data.newsletter.title}
                  </h4>
                  <p className="text-base text-white/80 max-w-md">
                    {data.newsletter.description}
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                    {subscriptionStatus === "success" ? (
                    <div className="flex items-center gap-3 text-green-300 bg-green-900/20 p-4 rounded-xl w-fit">
                        <CheckCircle className="h-6 w-6" />
                        <span className="text-lg font-medium">Successfully subscribed!</span>
                    </div>
                    ) : (
                    <form onSubmit={handleNewsletterSubmit} className="w-full">
                        <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="flex-1 rounded-full border-none bg-white/20 px-6 py-6 text-white placeholder-white/60 backdrop-blur-sm focus:bg-white/30 focus:text-white focus:ring-2 focus:ring-white/50"
                            disabled={
                                isEditable || createNewsletterMutation.isPending
                            }
                            />
                            <Button
                            type="submit"
                            style={{
                                backgroundColor: theme.colors.secondary,
                            }}
                            className="rounded-full px-8 py-6 font-bold text-white transition-all hover:scale-105 hover:shadow-lg shadow-md"
                            disabled={
                                isEditable || createNewsletterMutation.isPending
                            }
                            >
                            {createNewsletterMutation.isPending
                                ? "..."
                                : "Subscribe"}
                            </Button>
                        </div>

                        {subscriptionStatus === "error" && errorMessage && (
                            <div className="flex items-center gap-2 text-red-200 text-sm px-4">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errorMessage}</span>
                            </div>
                        )}
                        </div>
                    </form>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Section */}
          <div className="mt-16 flex flex-col items-center justify-between border-t border-white/20 pt-8 gap-6 md:flex-row">
            {/* Copyright */}
            <div className="text-sm text-white/60 text-center md:text-left">
              <p>{data.copyright}</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {data.socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.href || "#"}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white hover:text-primary hover:-translate-y-1"
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
