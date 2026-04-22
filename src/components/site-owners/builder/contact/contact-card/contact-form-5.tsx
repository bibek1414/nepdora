"use client";

import React from "react";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { ContactData } from "@/types/owner-site/components/contact";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";

interface ContactForm5Props {
  data: ContactData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<ContactData>) => void;
  theme?: any;
  siteUser?: string;
}

export const ContactForm5: React.FC<ContactForm5Props> = ({
  data,
  isEditable = false,
  onUpdate,
  theme,
  siteUser,
}) => {
  const { data: siteConfig, isLoading } = useSiteConfig();
  const [name, setName] = React.useState("");
  const [emailValue, setEmailValue] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [message, setMessage] = React.useState("");

  const submitMutation = useSubmitContactForm(siteUser || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !emailValue || !message || submitMutation.isPending) return;

    const finalMessage = company
      ? `Company: ${company}\n\n${message}`
      : message;

    submitMutation.mutate(
      {
        name,
        email: emailValue,
        message: finalMessage,
      },
      {
        onSuccess: () => {
          setName("");
          setEmailValue("");
          setCompany("");
          setMessage("");
        },
      }
    );
  };

  const email =
    siteConfig?.email || data.contact_info?.email || "hello@example.com";
  const phone =
    siteConfig?.phone || data.contact_info?.phone || "+1 234 567 890";
  const address =
    siteConfig?.address || data.contact_info?.address || "New York, NY";

  const socialLinks = [
    { name: "Twitter", url: siteConfig?.twitter_url, icon: Twitter },
    { name: "LinkedIn", url: siteConfig?.linkedin_url, icon: Linkedin },
    { name: "Instagram", url: siteConfig?.instagram_url, icon: Instagram },
    { name: "Facebook", url: siteConfig?.facebook_url, icon: Facebook },
    { name: "YouTube", url: siteConfig?.youtube_url, icon: Youtube },
  ].filter(s => s.url);

  if (isLoading) {
    return (
      <aside className="border-border animate-pulse space-y-8 border-t pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10">
        <div className="bg-muted h-20 rounded-lg" />
        <div className="bg-muted h-20 rounded-lg" />
        <div className="bg-muted h-20 rounded-lg" />
      </aside>
    );
  }

  return (
    <aside className="border-border animate-in fade-in slide-in-from-right-8 space-y-8 border-t pt-8 delay-200 duration-1000 md:border-t-0 md:border-l md:pt-0 md:pl-10">
      <section className="container mx-auto grid max-w-4xl gap-12 px-6 py-12 md:grid-cols-[1fr_280px]">
        <form
          onSubmit={handleSubmit}
          className="animate-in fade-in slide-in-from-bottom-8 space-y-6 duration-700"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                Your name
              </label>
              <Input
                placeholder="Name"
                className="border-border bg-background focus:border-primary h-12 rounded-lg px-4 text-sm"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                Email
              </label>
              <Input
                placeholder="Email"
                type="email"
                className="border-border bg-background focus:border-primary h-12 rounded-lg px-4 text-sm"
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Company (optional)
            </label>
            <Input
              placeholder="Company"
              className="border-border bg-background focus:border-primary h-12 rounded-lg px-4 text-sm"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Message
            </label>
            <Textarea
              placeholder="Tell me a bit about your project."
              className="border-border bg-background focus:border-primary min-h-[160px] resize-none rounded-lg p-4 text-sm"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="group bg-foreground text-background hover:bg-foreground/90 inline-flex h-auto items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {submitMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Send message
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>
        <div className="space-y-8">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Email
            </p>
            <a
              href={`mailto:${email}`}
              className="text-foreground hover:text-primary decoration-foreground/20 mt-2 block text-sm underline transition-colors"
            >
              {email}
            </a>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Phone
            </p>
            <a
              href={`tel:${phone}`}
              className="text-foreground hover:text-primary mt-2 block text-sm transition-colors"
            >
              {phone}
            </a>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Based in
            </p>
            <p className="text-foreground mt-2 text-sm">{address}</p>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                Elsewhere
              </p>
              <div className="mt-2 space-y-1.5 text-sm">
                {socialLinks.map(social => (
                  <a
                    key={social.name}
                    href={social.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary group flex w-fit items-center gap-2 transition-colors"
                  >
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </aside>
  );
};
