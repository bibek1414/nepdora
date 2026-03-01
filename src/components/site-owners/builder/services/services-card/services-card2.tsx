import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { formatDate } from "@/utils/date";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
interface ServicesCard2Props {
  services: ServicesPost;
  siteUser?: string;
  showReadTime?: boolean;
  onClick?: () => void;
  variant?: "featured" | "standard";
}

export const ServicesCard2: React.FC<ServicesCard2Props> = ({
  services,
  siteUser,
  onClick,
}) => {
  const pathname = usePathname();
  const servicesImage =
    services.thumbnail_image || "/fallback/image-not-found.png";

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/service-details-draft"
      : "/service-details";
    return generateLinkHref(`${basePath}/${services.slug}`, siteUser, pathname);
  };
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
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
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
      <article className="group transition-all duration-300 hover:-translate-y-1 hover:transform">
        {/* Image */}
        <div className="relative mb-6 h-48 w-full overflow-hidden rounded-lg">
          <Image
            src={servicesImage}
            alt={services.thumbnail_image_alt_description || services.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div>
          {/* Title */}
          <h2
            className="mb-4 text-xl leading-snug font-bold md:text-xl"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.heading,
            }}
          >
            {services.title}
          </h2>
        </div>
      </article>
    </CardWrapper>
  );
};
