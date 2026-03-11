"use client";

import React from "react";
import { SocialsData } from "@/types/owner-site/components/socials";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { SocialIcon } from "../footer/shared/social-icon";
import { EditableText } from "@/components/ui/editable-text";
import { motion } from "framer-motion";

interface SocialsStyle1Props {
  data: SocialsData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<SocialsData>) => void;
  siteUser?: string;
  
}

export const SocialsStyle1: React.FC<SocialsStyle1Props> = ({
  data,
  isEditable,
  onUpdate,
  siteUser,
}) => {
  const { data: siteConfig } = useSiteConfig();

  const socials = [
    { platform: "facebook", href: siteConfig?.facebook_url, label: "Facebook" },
    { platform: "instagram", href: siteConfig?.instagram_url, label: "Instagram" },
    { platform: "twitter", href: siteConfig?.twitter_url, label: "Twitter" },
    { platform: "linkedin", href: siteConfig?.linkedin_url, label: "LinkedIn" },
    { platform: "youtube", href: siteConfig?.youtube_url, label: "YouTube" },
    { platform: "tiktok", href: siteConfig?.tiktok_url, label: "TikTok" },
    { platform: "mail", href: siteConfig?.email ? `mailto:${siteConfig.email}` : null, label: "Email" },
  ].filter((s) => s.href);

  // If no socials found in site config, show some defaults for preview/builder
  const displaySocials = socials.length > 0 ? socials : [
    { platform: "github", href: "#", label: "GitHub" },
    { platform: "linkedin", href: "#", label: "LinkedIn" },
    { platform: "twitter", href: "#", label: "Twitter" },
    { platform: "mail", href: "mailto:hello@example.com", label: "Email" },
  ];

  const handleUpdate = (field: keyof SocialsData, value: string) => {
    if (!isEditable) return;
    onUpdate?.({ [field]: value });
  };

  return (
    <section 
      className="py-16 md:py-24 bg-secondary/10 dark:bg-secondary/5"
      style={{
        backgroundColor: data.backgroundType === "color" ? data.backgroundColor : undefined,
      }}
    >
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <EditableText
            as="p"
            className="font-mono text-primary text-sm tracking-widest uppercase mb-4"
            value={data.title || ""}
            onChange={(val) => handleUpdate("title", val)}
            isEditable={isEditable}
            placeholder="GET IN TOUCH"
          />

          <EditableText
            as="h2"
            className="text-3xl md:text-4xl font-bold tracking-tight mb-6"
            value={data.subtitle || ""}
            onChange={(val) => handleUpdate("subtitle", val)}
            isEditable={isEditable}
            placeholder="Let's build something together"
            multiline
          />

          <EditableText
            as="p"
            className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            value={data.description || ""}
            onChange={(val) => handleUpdate("description", val)}
            isEditable={isEditable}
            placeholder="I'm always open to discussing new projects, creative ideas, or opportunities..."
            multiline
          />
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
          {displaySocials.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <a
                href={s.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                onClick={(e) => {
                  if (isEditable) {
                    e.preventDefault();
                  }
                }}
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300"
              >
                <SocialIcon 
                  platform={s.platform} 
                  className="w-6 h-6 text-zinc-600 dark:text-zinc-400 transition-colors" 
                />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
