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
      <footer className="bg-background border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="mb-4">
                <FooterLogo
                  footerData={data}
                  getImageUrl={getImageUrl}
                  textClassName="text-foreground text-xl"
                  imageClassName="h-8"
                  containerClassName="gap-3"
                />
              </div>

              <p className="text-muted-foreground mb-6 max-w-md">
                {data.description}
              </p>

              {/* Contact Info */}
              <div className="mb-6 space-y-2">
                {data.contactInfo.email && (
                  <div className="text-muted-foreground flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.email}</span>
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="text-muted-foreground flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.phone}</span>
                  </div>
                )}
                {data.contactInfo.address && (
                  <div className="text-muted-foreground flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="text-sm">{data.contactInfo.address}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {data.socialLinks.map(social => (
                  <Link
                    key={social.id}
                    href={social.href || "#"}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white hover:text-gray-900"
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

            {/* Link Sections */}
            {data.sections.map(section => (
              <div key={section.id}>
                <h4 className="text-foreground mb-4 font-semibold">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.id}>
                      {isEditable ? (
                        <button
                          className="text-muted-foreground hover:text-foreground text-left text-sm transition-colors"
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
                          className="text-muted-foreground hover:text-foreground block text-left text-sm transition-colors"
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

          {/* Newsletter */}
          {data.newsletter.enabled && (
            <div className="border-border mt-12 border-t pt-8">
              <div className="mx-auto max-w-md text-center">
                <h4 className="text-foreground mb-2 font-semibold">
                  {data.newsletter.title}
                </h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  {data.newsletter.description}
                </p>

                {subscriptionStatus === "success" ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Successfully subscribed!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit}>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="flex-1"
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
                            ? "Subscribing..."
                            : "Subscribe"}
                        </Button>
                      </div>

                      {subscriptionStatus === "error" && errorMessage && (
                        <div className="flex items-center justify-center gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errorMessage}</span>
                        </div>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="border-border mt-8 border-t pt-8 text-center">
            <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
              {data.copyright}
              <Heart className="inline h-3 w-3 text-red-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
