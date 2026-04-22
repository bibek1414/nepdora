"use client";

import React from "react";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { ContactData } from "@/types/owner-site/components/contact";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ContactForm5Props {
  data: ContactData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<ContactData>) => void;
  theme?: any;
}

export const ContactForm5: React.FC<ContactForm5Props> = ({
  data,
  isEditable = false,
  onUpdate,
  theme,
}) => {
  const { data: siteConfig, isLoading } = useSiteConfig();

  const email = siteConfig?.email || data.contact_info?.email || "hello@example.com";
  const phone = siteConfig?.phone || data.contact_info?.phone || "+1 234 567 890";
  const address = siteConfig?.address || data.contact_info?.address || "New York, NY";

  const socialLinks = [
    { name: "Twitter", url: siteConfig?.twitter_url, icon: Twitter },
    { name: "LinkedIn", url: siteConfig?.linkedin_url, icon: Linkedin },
    { name: "Instagram", url: siteConfig?.instagram_url, icon: Instagram },
    { name: "Facebook", url: siteConfig?.facebook_url, icon: Facebook },
    { name: "YouTube", url: siteConfig?.youtube_url, icon: Youtube },
  ].filter((s) => s.url);

  if (isLoading) {
    return (
      <aside className="space-y-8 border-t border-border pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0 animate-pulse">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </aside>
    );
  }

  return (
    <aside className="space-y-8 border-t border-border pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
      <section className="container mx-auto grid max-w-4xl gap-12 px-6 py-12 md:grid-cols-[1fr_280px]">

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Your name</label>
              <Input 
                placeholder="Name" 
                className="h-12 rounded-lg border-border bg-background px-4 text-sm focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Email</label>
              <Input 
                placeholder="Email" 
                className="h-12 rounded-lg border-border bg-background px-4 text-sm focus:border-primary"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Company (optional)</label>
            <Input 
              placeholder="Company" 
              className="h-12 rounded-lg border-border bg-background px-4 text-sm focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Message</label>
            <Textarea 
              placeholder="Tell me a bit about your project." 
              className="min-h-[160px] resize-none rounded-lg border-border bg-background p-4 text-sm focus:border-primary"
            />
          </div>
          <Button 
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 h-auto"
          >
            Send message
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Email</p>
          <a 
            href={`mailto:${email}`}
            className="mt-2 block text-sm text-foreground hover:text-primary transition-colors underline decoration-foreground/20"
          >
            {email}
          </a>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Phone</p>
          <a 
            href={`tel:${phone}`}
            className="mt-2 block text-sm text-foreground hover:text-primary transition-colors"
          >
            {phone}
          </a>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Based in</p>
          <p className="mt-2 text-sm text-foreground">
            {address}
          </p>
        </div>
        
        {socialLinks.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Elsewhere</p>
            <div className="mt-2 space-y-1.5 text-sm">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group w-fit"
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
