"use client";

import { Mail, MapPin, Phone, Globe, MessageSquare, Twitter, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
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

  const email = siteConfig?.email || data.contact_info?.email || "hello@example.com";
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
      <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-8 shadow-sm">
        {/* Decorative background element */}
        <div 
          className="absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-10"
          style={{ backgroundColor: theme?.colors?.primary }}
        />
        
        <div className="relative z-10 space-y-8">
          <div>
            <h3 
              className="text-foreground font-display text-xl font-semibold"
              style={{ fontFamily: theme?.fonts?.heading }}
            >
              Contact Information
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              We're here to help. Reach out through any of these channels.
            </p>
          </div>

          <div className="space-y-6">
            {contactItems.map((item, index) => (
              <div key={index} className="group flex items-start gap-4">
                <div 
                  className="bg-background border-border flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-colors group-hover:border-primary/20"
                >
                  <item.icon 
                    className="h-5 w-5" 
                    style={{ color: theme?.colors?.primary }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a 
                      href={item.href}
                      className="text-foreground hover:text-primary block font-medium transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-foreground font-medium">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {socialLinks.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase mb-4">
                Follow us
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background border-border flex h-10 w-10 items-center justify-center rounded-lg border transition-all hover:scale-110 hover:border-primary/50"
                  >
                    <social.icon className="h-4 w-4" style={{ color: theme?.colors?.primary }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {siteConfig?.working_hours && (
            <div className="bg-background/50 border-border rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4" style={{ color: theme?.colors?.primary }} />
                <span>Working Hours</span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {siteConfig.working_hours}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Social Links if any could go here or as a separate card */}
      <div className="bg-primary/5 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
            <MessageSquare className="h-6 w-6" style={{ color: theme?.colors?.primary }} />
          </div>
          <div>
            <h4 className="font-display font-semibold" style={{ fontFamily: theme?.fonts?.heading }}>
              Need a quick answer?
            </h4>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              Check our FAQ section or drop us a message on social media for faster response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
