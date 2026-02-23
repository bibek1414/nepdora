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
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SocialIcon } from "./shared/social-icon";
import { FooterLogo } from "./shared/footer-logo";
import { cn } from "@/lib/utils";

interface FooterStyle2Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

export function FooterStyle2({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle2Props) {
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

  return (
    <div className="group relative">
      <footer className="bg-muted/30 border-t border-border font-body">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Main Content Card */}
          <Card className="mb-8 border-none shadow-sm bg-background/50 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Company Section */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Logo */}
                  <div>
                    <FooterLogo
                      footerData={data}
                      getImageUrl={getImageUrl}
                      textClassName="text-foreground text-xl font-bold font-heading"
                      imageClassName="h-8 w-auto"
                      containerClassName="gap-3"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <Badge
                        className="w-fit bg-primary text-primary-foreground font-body"
                    >
                        {data.companyName}
                    </Badge>
                    <p className="text-muted-foreground leading-relaxed">
                        {data.description}
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-3">
                    {data.socialLinks.map(social => (
                      <Link
                        key={social.id}
                        href={social.href || "#"}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-1"
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

                {/* Links Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-2">
                  {data.sections.map(section => (
                    <div key={section.id}>
                      <h4 className="text-foreground mb-6 flex items-center font-semibold tracking-tight font-heading">
                        {section.title}
                      </h4>
                      <ul className="space-y-3">
                        {section.links.map(link => (
                          <li key={link.id}>
                            {isEditable ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary h-auto justify-start p-0 font-normal transition-colors"
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
                                className="text-muted-foreground hover:text-primary h-auto justify-start p-0 font-normal transition-colors"
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
            <Card className="mb-8 border-none shadow-sm bg-primary/5">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                  <div>
                    <h4 className="text-foreground mb-2 text-lg font-semibold font-heading">
                      {data.newsletter.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {data.newsletter.description}
                    </p>
                  </div>

                  {subscriptionStatus === "success" ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Successfully subscribed!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="w-full">
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="flex-1 border-border bg-background"
                            disabled={
                              isEditable || createNewsletterMutation.isPending
                            }
                          />
                          <Button
                            type="submit"
                            className="px-6 bg-primary text-primary-foreground hover:bg-primary/90"
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
                          <div className="flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errorMessage}</span>
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
          <Card className="border-none shadow-sm bg-background">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                {data.contactInfo.email && (
                  <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      {data.contactInfo.email}
                    </span>
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      {data.contactInfo.phone}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-start md:justify-end gap-2 text-sm text-muted-foreground">
                    <span>{data.copyright}</span>
                    <Heart className="h-3 w-3 text-destructive fill-current" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
  );
}
