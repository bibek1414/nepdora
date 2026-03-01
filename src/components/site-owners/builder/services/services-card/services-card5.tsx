import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import Image from "next/image";
import { ChevronRight, Briefcase } from "lucide-react";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ServicesCard5Props {
  services: ServicesPost;
  siteUser?: string;
  onClick?: () => void;
  index?: number;
}

const DEFAULT_THEME = {
  colors: {
    text: "#0F172A",
    primary: "#6247EA",
    primaryForeground: "#FFFFFF",
    secondary: "#C7D2FE",
    secondaryForeground: "#312E81",
    background: "#FFFFFF",
  },
  fonts: {
    body: "Inter, sans-serif",
    heading: "Poppins, sans-serif",
  },
};

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace("#", "");
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map(char => `${char}${char}`)
          .join("")
      : sanitized;

  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const ServicesCard5: React.FC<ServicesCard5Props> = ({
  services,
  siteUser,
  onClick,
}) => {
  const pathname = usePathname();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || DEFAULT_THEME;

  const primaryColor = theme.colors?.primary || DEFAULT_THEME.colors.primary;
  const textColor = theme.colors?.text || DEFAULT_THEME.colors.text;
  const headingFont = theme.fonts?.heading || DEFAULT_THEME.fonts.heading;
  const bodyFont = theme.fonts?.body || DEFAULT_THEME.fonts.body;

  const cardDescription = useMemo(() => {
    const plainText = stripHtml(services.description || "");
    if (!plainText)
      return "Discover how we can help take your business further.";
    return plainText.length > 160
      ? `${plainText.slice(0, 157).trim()}...`
      : plainText;
  }, [services.description]);

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/service-details-draft"
      : "/service-details";
    return generateLinkHref(`${basePath}/${services.slug}`, siteUser, pathname);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = getDetailsUrl();
    }
  };

  const CardWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={getDetailsUrl()}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <article className="border-border/60 relative flex h-full flex-col rounded-[32px] border bg-white p-8 text-center shadow-[0_35px_60px_-15px_rgba(15,23,42,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-slate-900 dark:text-white">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: hexToRgba(primaryColor, 0.08),
            boxShadow: `0 12px 30px ${hexToRgba(primaryColor, 0.25)}`,
            color: primaryColor,
          }}
        >
          {services.thumbnail_image ? (
            <div className="relative h-10 w-10">
              <Image
                src={services.thumbnail_image}
                alt={services.thumbnail_image_alt_description || services.title}
                fill
                sizes="40px"
                className="rounded-full object-contain"
              />
            </div>
          ) : (
            <Briefcase className="h-7 w-7" strokeWidth={1.75} />
          )}
        </div>

        <div className="space-y-4">
          <h3
            className="text-2xl font-semibold"
            style={{
              color: textColor,
              fontFamily: headingFont,
            }}
          >
            {services.title}
          </h3>
          <p
            className="text-base leading-relaxed text-slate-600 dark:text-slate-300"
            style={{
              fontFamily: bodyFont,
            }}
          >
            {cardDescription}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center text-sm font-semibold">
          <span
            className="inline-flex items-center gap-2"
            style={{ color: primaryColor }}
          >
            Learn More
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>
      </article>
    </CardWrapper>
  );
};
