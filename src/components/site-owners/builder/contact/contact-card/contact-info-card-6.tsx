"use client";

import {
  Mail,
  MapPin,
  Phone,
  Globe,
  MessageSquare,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { ContactData } from "@/types/owner-site/components/contact";
import { cn } from "@/lib/utils";

interface ContactInfoCard6Props {
  data: ContactData;
  theme?: any;
}

export const ContactInfoCard6: React.FC<ContactInfoCard6Props> = ({
  data,
  theme,
}) => {
  const { data: siteConfig } = useSiteConfig();

  const email =
    siteConfig?.email || data.contact_info?.email || "hello@example.com";
  const phone = siteConfig?.phone || data.contact_info?.phone;
  const address = siteConfig?.address || data.contact_info?.address;

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: phone,
      href: phone ? `tel:${phone}` : undefined,
    },
    {
      icon: MapPin,
      label: "Visit us",
      value: address,
    },
  ].filter(item => item.value);

  const socialLinks = [
    { icon: Twitter, url: siteConfig?.twitter_url },
    { icon: Linkedin, url: siteConfig?.linkedin_url },
    { icon: Instagram, url: siteConfig?.instagram_url },
    { icon: Facebook, url: siteConfig?.facebook_url },
    { icon: Youtube, url: siteConfig?.youtube_url },
  ].filter(link => link.url);

  return (
    <div className="space-y-10">
      <div className="relative z-10 space-y-8">
        <div className="space-y-6">
          {contactItems.map((item, index) => (
            <div key={index} className="group flex items-center gap-4">
              <div className="bg-card border-border -sm group-hover:border-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors">
                <item.icon
                  className="h-4 w-4"
                  style={{ color: theme?.colors?.primary }}
                />
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-foreground hover:text-primary block text-sm font-medium transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-foreground text-sm font-medium">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {socialLinks.length > 0 && (
          <div className="border-border pt-6">
            <p className="text-muted-foreground mb-4 text-[10px] font-bold tracking-widest uppercase">
              Elsewhere
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card border-border -sm hover:border-primary/50 flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:scale-110"
                >
                  <social.icon
                    className="h-4 w-4"
                    style={{ color: theme?.colors?.primary }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {siteConfig?.working_hours && (
          <div className="bg-background/50 border-border rounded-xl border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe
                className="h-4 w-4"
                style={{ color: theme?.colors?.primary }}
              />
              <span>Working Hours</span>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {siteConfig.working_hours}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
