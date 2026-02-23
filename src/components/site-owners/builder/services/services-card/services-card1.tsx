import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ServicesPost } from "@/types/owner-site/admin/services";

interface ServicesCard1Props {
  services: ServicesPost;
  siteUser?: string;
  showReadTime?: boolean;
  onClick?: () => void;
}

export const ServicesCard1: React.FC<ServicesCard1Props> = ({
  services,
  siteUser,
  onClick,
}) => {
  const pathname = usePathname();
  const servicesImage =
    services.thumbnail_image ||
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=600&h=400&fit=crop";

  const getDetailsUrl = (): string => {
    if (siteUser) {
      if (pathname?.includes("/preview/")) {
        return `/preview/${siteUser}/services/${services.slug}`;
      }
      if (pathname?.includes("/publish/")) {
        return `/services/${services.slug}`;
      }
      return `/services/${services.slug}`;
    }
    return `/services/${services.slug}`;
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
        <Link href={getDetailsUrl()} className="group block h-full">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="group block h-full cursor-pointer">
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <div className="h-full overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-zinc-900/50">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={servicesImage}
            alt={services.thumbnail_image_alt_description || services.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h2 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
            {services.title}
          </h2>
          {/* Optional: Add a short excerpt here if description is plain text */}
        </div>
      </div>
    </CardWrapper>
  );
};
