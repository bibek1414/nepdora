import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Heart,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/use-footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";

interface FooterStyle2Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

// Logo component
const FooterLogo = ({
  footerData,
  getImageUrl,
}: {
  footerData: FooterData;
  getImageUrl: any;
}) => {
  const { logoType, logoImage, logoText, companyName } = footerData;

  if (logoType === "text") {
    return (
      <div className="flex items-center">
        <span className="text-foreground text-xl font-bold">
          {logoText || companyName}
        </span>
      </div>
    );
  }

  if (logoType === "image") {
    return logoImage ? (
      <div className="flex items-center">
        <img
          src={getImageUrl(logoImage)}
          alt={companyName}
          className="h-8 w-auto object-contain"
        />
      </div>
    ) : (
      <div className="flex items-center">
        <span className="text-foreground text-xl font-bold">{companyName}</span>
      </div>
    );
  }

  // logoType === "both"
  return (
    <div className="flex items-center gap-3">
      {logoImage && (
        <img
          src={getImageUrl(logoImage)}
          alt={companyName}
          className="h-8 w-auto object-contain"
        />
      )}
      <span className="text-foreground text-xl font-bold">
        {logoText || companyName}
      </span>
    </div>
  );
};

export function FooterStyle2({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle2Props) {
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

  const deleteFooterMutation = useDeleteFooterMutation();
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
      <footer className="bg-muted/50 border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Main Content Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Company Section */}
                <div className="lg:col-span-1">
                  {/* Logo */}
                  <div className="mb-4">
                    <FooterLogo footerData={data} getImageUrl={getImageUrl} />
                  </div>

                  <Badge
                    className="mb-4 text-white"
                    style={{
                      backgroundColor: theme.colors.primary,
                    }}
                  >
                    {data.companyName}
                  </Badge>
                  <p className="text-muted-foreground mb-6">
                    {data.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-2">
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

                {/* Links Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:col-span-2">
                  {data.sections.map(section => (
                    <div key={section.id}>
                      <h4 className="text-foreground mb-4 flex items-center font-semibold">
                        {section.title}
                        <ExternalLink className="text-muted-foreground ml-2 h-3 w-3" />
                      </h4>
                      <ul className="space-y-3">
                        {section.links.map(link => (
                          <li key={link.id}>
                            {isEditable ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground h-auto justify-start p-0 font-normal"
                                onClick={
                                  isEditable
                                    ? e => e.preventDefault()
                                    : undefined
                                }
                              >
                                {link.text}
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground h-auto justify-start p-0 font-normal"
                                asChild
                              >
                                <Link
                                  href={generateLinkHref(
                                    link.href || "",
                                    siteUser,
                                    pathname,
                                    isEditable
                                  )}
                                >
                                  {link.text}
                                </Link>
                              </Button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Card */}
          {data.newsletter.enabled && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-foreground mb-2 font-semibold">
                      {data.newsletter.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {data.newsletter.description}
                    </p>
                  </div>

                  {subscriptionStatus === "success" ? (
                    <div className="flex items-center justify-center gap-2 text-green-600 md:justify-start">
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
                            className="flex-1 border-gray-300 placeholder:text-gray-400"
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
                          <div className="flex items-center justify-center gap-2 text-red-600 md:justify-start">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">{errorMessage}</span>
                          </div>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 items-center gap-6 text-center md:grid-cols-3 md:text-left">
                {data.contactInfo.email && (
                  <div className="flex items-center justify-center md:justify-start">
                    <Mail
                      style={{
                        color: theme.colors.primary,
                      }}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="text-muted-foreground text-sm">
                      {data.contactInfo.email}
                    </span>
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="flex items-center justify-center md:justify-start">
                    <Phone
                      style={{
                        color: theme.colors.primary,
                      }}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="text-muted-foreground text-sm">
                      {data.contactInfo.phone}
                    </span>
                  </div>
                )}
                <div className="text-center md:text-right">
                  <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm md:justify-end">
                    {data.copyright}
                    <Heart
                      style={{
                        color: theme.colors.primary,
                      }}
                      className="h-3 w-3 text-red-500"
                    />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
  );
}
