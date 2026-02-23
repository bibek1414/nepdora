import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";

interface FooterStyle1Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle1({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle1Props) {
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

  return (
    <div className="group relative">
      <footer className="bg-background border-t pt-16 pb-8 lg:pt-24 lg:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-16">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-8">
              {/* Logo */}
              <div>
                <FooterLogo
                  footerData={data}
                  getImageUrl={getImageUrl}
                  textClassName="text-foreground text-xl font-bold"
                  imageClassName="h-8 w-auto"
                  containerClassName="gap-3"
                />
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                {data.description}
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {data.socialLinks.map(social => (
                  <Link
                    key={social.id}
                    href={social.href || "#"}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-1"
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
                      className="h-5 w-5"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Link Sections */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
                {data.sections.map(section => (
                <div key={section.id} className="space-y-4">
                    <h4 className="text-foreground font-semibold tracking-tight">
                    {section.title}
                    </h4>
                    <ul className="space-y-3">
                    {section.links.map(link => (
                        <li key={link.id}>
                        {isEditable ? (
                            <button
                            className="text-muted-foreground hover:text-primary text-sm transition-colors block"
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
                            className="text-muted-foreground hover:text-primary text-sm transition-colors block"
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

            {/* Contact & Newsletter - Combined in last column or separate */}
             <div className="lg:col-span-1 space-y-8">
                 {/* Contact Info */}
                 <div className="space-y-4">
                    <h4 className="text-foreground font-semibold tracking-tight">
                        Contact Us
                    </h4>
                     <div className="space-y-3">
                        {data.contactInfo.email && (
                        <div className="text-muted-foreground flex items-center group">
                            <Mail className="mr-3 h-4 w-4 text-primary group-hover:text-foreground transition-colors" />
                            <span className="text-sm">{data.contactInfo.email}</span>
                        </div>
                        )}
                        {data.contactInfo.phone && (
                        <div className="text-muted-foreground flex items-center group">
                            <Phone className="mr-3 h-4 w-4 text-primary group-hover:text-foreground transition-colors" />
                            <span className="text-sm">{data.contactInfo.phone}</span>
                        </div>
                        )}
                        {data.contactInfo.address && (
                        <div className="text-muted-foreground flex items-start group">
                            <MapPin className="mr-3 h-4 w-4 mt-1 text-primary group-hover:text-foreground transition-colors" />
                            <span className="text-sm leading-relaxed">{data.contactInfo.address}</span>
                        </div>
                        )}
                    </div>
                </div>


                {/* Newsletter */}
                {data.newsletter.enabled && (
                    <div className="space-y-4">
                        <h4 className="text-foreground font-semibold tracking-tight">
                        {data.newsletter.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                        {data.newsletter.description}
                        </p>

                        {subscriptionStatus === "success" ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Subscribed!</span>
                        </div>
                        ) : (
                        <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="bg-background"
                                disabled={
                                    isEditable || createNewsletterMutation.isPending
                                }
                                />
                                <Button
                                type="submit"
                                style={{
                                    backgroundColor: theme.colors.primary,
                                }}
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
                                <div className="flex items-center gap-2 text-red-600 text-xs">
                                <AlertCircle className="h-3 w-3" />
                                <span>{errorMessage}</span>
                                </div>
                            )}
                        </form>
                        )}
                    </div>
                )}
             </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border/40 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <p className="text-muted-foreground text-sm">
                    {data.copyright}
                 </p>
                 <p className="text-muted-foreground text-sm flex items-center gap-1">
                    Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> by {data.copyright?.split(' ')[0] || 'Us'}
                 </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
